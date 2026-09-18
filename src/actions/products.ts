'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { productSchema } from '@/lib/validations/schemas';
import { revalidatePath } from 'next/cache';
import type { Product, ProductImage } from '@/types/database';
import { verifyAdmin } from '@/lib/authAdmin';
import { slugify } from '@/lib/utils';

export async function getProducts(options?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOffer?: boolean;
  isBestseller?: boolean;
  search?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}) {
  const supabase = createAdminClient();
  const {
    page = 1,
    pageSize = 20,
    categoryId,
    isActive,
    isFeatured,
    isNew,
    isOffer,
    isBestseller,
    search,
    orderBy = 'created_at',
    orderDir = 'desc',
  }: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    isOffer?: boolean;
    isBestseller?: boolean;
    search?: string;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
  } = options || {};

  // If filtering for offer items, resolve product IDs tagged with offer variant
  let offerProductIds: string[] | null = null;
  if (isOffer) {
    const { data: offerVariants } = await supabase
      .from('product_variants')
      .select('product_id')
      .eq('name', 'offer');

    offerProductIds = (offerVariants || []).map((v) => v.product_id);
    if (offerProductIds.length === 0) {
      return {
        data: [],
        count: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }
  }

  let query = supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)', { count: 'exact' });

  if (offerProductIds !== null) query = query.in('id', offerProductIds);
  if (categoryId) query = query.eq('category_id', categoryId);
  if (isActive !== undefined) query = query.eq('is_active', isActive);
  if (isFeatured !== undefined) query = query.eq('is_featured', isFeatured);
  if (isBestseller !== undefined) query = query.eq('is_featured', isBestseller);
  if (isNew !== undefined) query = query.eq('is_new', isNew);
  if (search) query = query.ilike('name', `%${search}%`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order(orderBy, { ascending: orderDir === 'asc' })
    .range(from, to);

  if (error) {
    console.error('getProducts query error:', error.message);
    return {
      data: [],
      count: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  const mapped = ((data as unknown as Product[]) || []).map((p) => ({
    ...p,
    is_offer: p.variants?.some((v) => v.name.toLowerCase() === 'offer') ?? false,
    is_bestseller: p.is_featured || (p.variants?.some((v) => v.name.toLowerCase() === 'bestseller') ?? false),
  }));

  return {
    data: mapped,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getProductBySlug(slug: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  const prod = data as unknown as Product;
  prod.is_offer = prod.variants?.some((v) => v.name.toLowerCase() === 'offer') ?? false;
  prod.is_bestseller = prod.is_featured || (prod.variants?.some((v) => v.name.toLowerCase() === 'bestseller') ?? false);
  return prod;
}

export async function getProductById(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  const prod = data as unknown as Product;
  prod.is_offer = prod.variants?.some((v) => v.name.toLowerCase() === 'offer') ?? false;
  prod.is_bestseller = prod.is_featured || (prod.variants?.some((v) => v.name.toLowerCase() === 'bestseller') ?? false);
  return prod;
}

export async function createProduct(formData: Record<string, unknown>) {
  const user = await verifyAdmin();
  if (!user) return { error: 'Unauthorized: Admin privileges required' };

  const { sizes, colors, is_offer, is_bestseller, ...productFields } = formData;

  if (is_bestseller !== undefined) {
    productFields.is_featured = is_bestseller === true || is_bestseller === 'true';
  }

  if (!productFields.slug && typeof productFields.name === 'string') {
    productFields.slug = slugify(productFields.name);
  }

  const result = productSchema.safeParse(productFields);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('products')
    .insert(result.data)
    .select()
    .single();

  if (error) return { error: error.message };

  // Save sizes, colors, and offer tag as variants
  const variantsToInsert: {
    product_id: string;
    name: string;
    value: string;
    price_modifier: number;
    stock: number;
  }[] = [];

  if (is_offer === true || is_offer === 'true') {
    variantsToInsert.push({
      product_id: data.id,
      name: 'offer',
      value: 'true',
      price_modifier: 0,
      stock: data.stock,
    });
  }

  if (is_bestseller === true || is_bestseller === 'true') {
    variantsToInsert.push({
      product_id: data.id,
      name: 'bestseller',
      value: 'true',
      price_modifier: 0,
      stock: data.stock,
    });
  }

  if (Array.isArray(sizes)) {
    sizes.forEach((size) => {
      if (typeof size === 'string' && size.trim()) {
        variantsToInsert.push({
          product_id: data.id,
          name: 'size',
          value: size.trim(),
          price_modifier: 0,
          stock: data.stock,
        });
      }
    });
  }

  if (Array.isArray(colors)) {
    colors.forEach((color) => {
      if (typeof color === 'string' && color.trim()) {
        variantsToInsert.push({
          product_id: data.id,
          name: 'color',
          value: color.trim(),
          price_modifier: 0,
          stock: data.stock,
        });
      }
    });
  }

  if (variantsToInsert.length > 0) {
    await adminClient.from('product_variants').insert(variantsToInsert);
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/offers');
  revalidatePath('/admin/products');

  return { data: data as Product };
}

export async function updateProduct(id: string, formData: Record<string, unknown>) {
  const user = await verifyAdmin();
  if (!user) return { error: 'Unauthorized: Admin privileges required' };

  const { sizes, colors, is_offer, is_bestseller, ...productFields } = formData;

  if (is_bestseller !== undefined) {
    productFields.is_featured = is_bestseller === true || is_bestseller === 'true';
  }

  if (!productFields.slug && typeof productFields.name === 'string') {
    productFields.slug = slugify(productFields.name);
  }

  const result = productSchema.safeParse(productFields);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('products')
    .update(result.data)
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  // Replace existing variants
  await adminClient.from('product_variants').delete().eq('product_id', id);

  const variantsToInsert: {
    product_id: string;
    name: string;
    value: string;
    price_modifier: number;
    stock: number;
  }[] = [];

  if (is_offer === true || is_offer === 'true') {
    variantsToInsert.push({
      product_id: id,
      name: 'offer',
      value: 'true',
      price_modifier: 0,
      stock: data.stock,
    });
  }

  if (is_bestseller === true || is_bestseller === 'true') {
    variantsToInsert.push({
      product_id: id,
      name: 'bestseller',
      value: 'true',
      price_modifier: 0,
      stock: data.stock,
    });
  }

  if (Array.isArray(sizes)) {
    sizes.forEach((size) => {
      if (typeof size === 'string' && size.trim()) {
        variantsToInsert.push({
          product_id: id,
          name: 'size',
          value: size.trim(),
          price_modifier: 0,
          stock: data.stock,
        });
      }
    });
  }

  if (Array.isArray(colors)) {
    colors.forEach((color) => {
      if (typeof color === 'string' && color.trim()) {
        variantsToInsert.push({
          product_id: id,
          name: 'color',
          value: color.trim(),
          price_modifier: 0,
          stock: data.stock,
        });
      }
    });
  }

  if (variantsToInsert.length > 0) {
    await adminClient.from('product_variants').insert(variantsToInsert);
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/offers');
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/product/${data.slug}`);

  return { data: data as Product };
}

export async function deleteProduct(id: string) {
  const user = await verifyAdmin();
  if (!user) return { error: 'Unauthorized: Admin privileges required' };

  const adminClient = createAdminClient();

  // Get product images to delete from Cloudinary
  const { data: images } = await adminClient
    .from('product_images')
    .select('cloudinary_public_id')
    .eq('product_id', id);

  // Delete product variants
  await adminClient.from('product_variants').delete().eq('product_id', id);

  // Delete product (cascades to images in DB)
  const { error } = await adminClient
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  // Clean up Cloudinary images
  if (images && images.length > 0) {
    const cloudinary = (await import('@/lib/cloudinary/config')).default;
    for (const img of images) {
      try {
        await cloudinary.uploader.destroy(img.cloudinary_public_id);
      } catch {
        // Log but don't fail the operation
        console.error('Failed to delete Cloudinary image:', img.cloudinary_public_id);
      }
    }
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/admin/products');

  return { success: true };
}

export async function addProductImage(productId: string, imageData: {
  cloudinary_public_id: string;
  secure_url: string;
  alt_text?: string;
  sort_order?: number;
  is_primary?: boolean;
}) {
  const user = await verifyAdmin();
  if (!user) return { error: 'Unauthorized: Admin privileges required' };

  const adminClient = createAdminClient();

  // If this is primary, unset other primaries
  if (imageData.is_primary) {
    await adminClient
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', productId);
  }

  const { data, error } = await adminClient
    .from('product_images')
    .insert({
      product_id: productId,
      ...imageData,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath(`/admin/products/${productId}`);

  return { data: data as ProductImage };
}

export async function deleteProductImage(imageId: string, cloudinaryPublicId: string) {
  const user = await verifyAdmin();
  if (!user) return { error: 'Unauthorized: Admin privileges required' };

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (error) return { error: error.message };

  // Delete from Cloudinary
  try {
    const cloudinary = (await import('@/lib/cloudinary/config')).default;
    await cloudinary.uploader.destroy(cloudinaryPublicId);
  } catch {
    console.error('Failed to delete Cloudinary image:', cloudinaryPublicId);
  }

  revalidatePath('/');
  revalidatePath('/shop');

  return { success: true };
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/admin/products');

  return { success: true };
}
