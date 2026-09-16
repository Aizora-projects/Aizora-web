'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { Category } from '@/types/database';
import { verifyAdmin } from '@/lib/authAdmin';

export async function getCategories(activeOnly = false) {
  const supabase = createAdminClient();

  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getCategories query error:', error.message);
    return [];
  }
  return (data as Category[]) || [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Category;
}

export async function updateCategory(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    tagline: string;
    image_url: string | null;
    cloudinary_public_id: string | null;
    sort_order: number;
    is_active: boolean;
  }>
) {
  const user = await verifyAdmin();
  if (!user) return { error: 'Unauthorized: Admin privileges required' };

  const adminClient = createAdminClient();

  // If updating image, delete old Cloudinary image to keep Cloudinary free tier clean
  if (updates.cloudinary_public_id) {
    const { data: existing } = await adminClient
      .from('categories')
      .select('cloudinary_public_id')
      .eq('id', id)
      .single();

    if (
      existing?.cloudinary_public_id &&
      existing.cloudinary_public_id !== updates.cloudinary_public_id
    ) {
      try {
        const cloudinary = (await import('@/lib/cloudinary/config')).default;
        await cloudinary.uploader.destroy(existing.cloudinary_public_id);
      } catch (err) {
        console.error('Failed to delete old category image from Cloudinary:', err);
      }
    }
  }

  const { data, error } = await adminClient
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateCategory error:', error.message);
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/categories');
  revalidatePath('/category/[slug]', 'page');

  return { data: data as Category };
}

export async function deleteCategoryImage(id: string) {
  const user = await verifyAdmin();
  if (!user) return { error: 'Unauthorized: Admin privileges required' };

  const adminClient = createAdminClient();

  // 1. Fetch current category's public_id
  const { data: existing, error: fetchErr } = await adminClient
    .from('categories')
    .select('cloudinary_public_id')
    .eq('id', id)
    .single();

  if (fetchErr) return { error: fetchErr.message };

  // 2. Destroy from Cloudinary
  if (existing?.cloudinary_public_id) {
    try {
      const cloudinary = (await import('@/lib/cloudinary/config')).default;
      await cloudinary.uploader.destroy(existing.cloudinary_public_id);
    } catch (err) {
      console.error('Failed to destroy Cloudinary image:', err);
    }
  }

  // 3. Clear in Supabase
  const { data, error: updateErr } = await adminClient
    .from('categories')
    .update({
      image_url: null,
      cloudinary_public_id: null,
    })
    .eq('id', id)
    .select()
    .single();

  if (updateErr) return { error: updateErr.message };

  revalidatePath('/');
  revalidatePath('/admin/categories');
  revalidatePath('/category/[slug]', 'page');

  return { success: true, data: data as Category };
}

export async function getDashboardStats() {
  const adminClient = createAdminClient();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalCategories },
    { count: totalOrders },
    { data: revenueData },
    { data: lowStockProducts },
    { data: recentProducts },
    { data: recentOrders },
  ] = await Promise.all([
    adminClient.from('products').select('*', { count: 'exact', head: true }),
    adminClient.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    adminClient.from('categories').select('*', { count: 'exact', head: true }),
    adminClient.from('orders').select('*', { count: 'exact', head: true }),
    adminClient.from('orders').select('total').not('status', 'eq', 'cancelled'),
    adminClient.from('products').select('id, name, stock, is_active').lte('stock', 5).order('stock', { ascending: true }).limit(10),
    adminClient.from('products').select('*, category:categories(name), images:product_images(secure_url, is_primary)').order('created_at', { ascending: false }).limit(5),
    adminClient.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

  return {
    totalProducts: totalProducts || 0,
    activeProducts: activeProducts || 0,
    totalCategories: totalCategories || 0,
    totalOrders: totalOrders || 0,
    totalRevenue,
    lowStockProducts: lowStockProducts || [],
    recentProducts: recentProducts || [],
    recentOrders: recentOrders || [],
  };
}
