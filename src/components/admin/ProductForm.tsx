'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Star, Loader2, Check, Plus, Palette, Tag } from 'lucide-react';
import { createProduct, updateProduct, addProductImage, deleteProductImage } from '@/actions/products';
import { slugify } from '@/lib/utils';
import type { Product, Category, ProductImage } from '@/types/database';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

const POPULAR_COLORS = [
  { name: 'Maroon', hex: '#800000' },
  { name: 'Sage Green', hex: '#9CAF88' },
  { name: 'Ivory Cream', hex: '#FAF5EE' },
  { name: 'Dusty Rose', hex: '#DCAE96' },
  { name: 'Navy Blue', hex: '#1B263B' },
  { name: 'Mustard Gold', hex: '#D4A373' },
  { name: 'Wine / Plum', hex: '#581845' },
  { name: 'Classic Black', hex: '#1C1917' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_id: product?.category_id || (categories[0]?.id || ''),
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price || 0,
    compare_at_price: product?.compare_at_price || null,
    sku: product?.sku || '',
    stock: product?.stock || 10,
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    is_new: product?.is_new ?? true,
    is_offer: product?.variants?.some((v) => v.name.toLowerCase() === 'offer') ?? false,
    is_bestseller: product?.is_bestseller ?? product?.is_featured ?? (product?.variants?.some((v) => v.name.toLowerCase() === 'bestseller') ?? false),
  });

  const [images, setImages] = useState<ProductImage[]>(
    product?.images?.sort((a, b) => a.sort_order - b.sort_order) || []
  );

  const initialSizes = product?.variants
    ? product.variants.filter((v) => v.name.toLowerCase() === 'size').map((v) => v.value)
    : [];

  const initialColors = product?.variants
    ? product.variants.filter((v) => v.name.toLowerCase() === 'color').map((v) => v.value)
    : [];

  const [hasSizes, setHasSizes] = useState<boolean>(
    isEditing ? initialSizes.length > 0 : true
  );
  const [hasColors, setHasColors] = useState<boolean>(
    isEditing ? initialColors.length > 0 : true
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSizeInput.trim().toUpperCase();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes((prev) => [...prev, trimmed]);
      setCustomSizeInput('');
    }
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const addCustomColor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customColorInput.trim();
    if (trimmed && !selectedColors.includes(trimmed)) {
      setSelectedColors((prev) => [...prev, trimmed]);
      setCustomColorInput('');
    }
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slugify(name),
    }));
  };

  const handleImageUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'aizora/products');

      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Upload failed');
        }

        const result = await response.json();

        if (product?.id) {
          const imageResult = await addProductImage(product.id, {
            cloudinary_public_id: result.public_id,
            secure_url: result.secure_url,
            alt_text: formData.name || product.name,
            sort_order: images.length + i,
            is_primary: images.length === 0 && i === 0,
          });

          if (imageResult.data) {
            setImages((prev) => [...prev, imageResult.data!]);
          }
        } else {
          const newImg: ProductImage = {
            id: `temp-${Date.now()}-${i}`,
            product_id: '',
            cloudinary_public_id: result.public_id,
            secure_url: result.secure_url,
            alt_text: formData.name || 'Product Image',
            sort_order: images.length + i,
            is_primary: images.length === 0 && i === 0,
            created_at: new Date().toISOString(),
          };
          setImages((prev) => [...prev, newImg]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      }
    }

    setIsUploading(false);
  }, [product?.id, formData.name, images.length]);

  const handleImageDelete = async (image: ProductImage) => {
    if (product?.id && !image.id.startsWith('temp-')) {
      const result = await deleteProductImage(image.id, image.cloudinary_public_id);
      if (!result.error) {
        setImages((prev) => prev.filter((img) => img.id !== image.id));
      }
    } else {
      setImages((prev) => prev.filter((img) => img.id !== image.id));
    }
  };

  const handleSetPrimary = async (image: ProductImage) => {
    if (product?.id && !image.id.startsWith('temp-')) {
      await addProductImage(product.id, {
        cloudinary_public_id: image.cloudinary_public_id,
        secure_url: image.secure_url,
        alt_text: image.alt_text || undefined,
        sort_order: image.sort_order,
        is_primary: true,
      });
    }

    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: img.id === image.id,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const data = {
      ...formData,
      slug: formData.slug || slugify(formData.name),
      price: Number(formData.price),
      compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
      stock: Number(formData.stock),
      sizes: hasSizes ? selectedSizes : [],
      colors: hasColors ? selectedColors : [],
    };

    let result;
    if (isEditing && product) {
      result = await updateProduct(product.id, data);
    } else {
      result = await createProduct(data);
    }

    if ('error' in result && result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    if ('data' in result && result.data) {
      const createdOrUpdatedId = result.data.id;

      // Save any pending images if it was a new product
      if (!isEditing && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          await addProductImage(createdOrUpdatedId, {
            cloudinary_public_id: img.cloudinary_public_id,
            secure_url: img.secure_url,
            alt_text: formData.name,
            sort_order: i,
            is_primary: img.is_primary,
          });
        }
      }

      setSuccess(isEditing ? 'Product updated successfully!' : 'Product created with images!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Banners */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-xl font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 mb-2">
              General Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
                placeholder="e.g. Pure Linen Co-ord Set"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                Short Description
              </label>
              <input
                type="text"
                value={formData.short_description || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                maxLength={300}
                className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
                placeholder="Brief summary for card hover and quick view..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                Full Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all resize-y"
                placeholder="Detailed styling notes, fabric blend, fit guide, and wash care..."
              />
            </div>
          </div>

          {/* Cloudinary Photoshoot Images */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900">
                Photoshoot Images (Cloudinary)
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                {images.length} uploaded
              </span>
            </div>

            {/* Upload Area */}
            <label
              className={`border-2 border-dashed border-admin-border hover:border-tan rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] mb-4 ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-tan animate-spin mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-tan mb-2" />
              )}
              <p className="text-sm font-semibold text-stone-900 mb-1">
                {isUploading ? 'Uploading to Cloudinary CDN...' : 'Click or tap to upload photos'}
              </p>
              <p className="text-xs text-stone-500">
                JPEG, PNG, WebP • Multi-select supported
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                disabled={isUploading}
              />
            </label>

            {/* Images Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-lg overflow-hidden bg-stone-100 border border-admin-border"
                  >
                    <div className="aspect-[3/4]">
                      <img
                        src={img.secure_url}
                        alt={img.alt_text || 'Product image'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Hover Controls */}
                    <div className="absolute inset-0 bg-stone-900/50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img)}
                        className={`p-1.5 rounded-full ${
                          img.is_primary
                            ? 'bg-amber-500 text-white'
                            : 'bg-white/95 text-stone-700 hover:bg-amber-500 hover:text-white'
                        } transition-colors shadow-xs`}
                        title="Set as primary"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageDelete(img)}
                        className="p-1.5 rounded-full bg-white/95 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-xs"
                        title="Delete photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {img.is_primary && (
                      <span className="absolute top-1.5 left-1.5 bg-tan text-white text-[9px] px-2 py-0.5 rounded-md tracking-wider uppercase font-bold shadow-xs">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 mb-2">
              Pricing Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                  }
                  required
                  min={0}
                  step={1}
                  className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                  Compare at Price (MRP ₹)
                </label>
                <input
                  type="number"
                  value={formData.compare_at_price || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      compare_at_price: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                  min={0}
                  step={1}
                  placeholder="Original price before discount"
                  className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sizes & Colors (Variants) */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-6">
            {/* Size Options Section */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-admin-border">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-tan" />
                  <div>
                    <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900">
                      Product Sizes
                    </h2>
                    <p className="text-[11px] text-stone-500">
                      {hasSizes
                        ? 'Select or add available sizes for this product'
                        : 'No size options — product has no size selection (Free / Single Size)'}
                    </p>
                  </div>
                </div>

                <div className="inline-flex p-0.5 bg-stone-100 rounded-lg border border-admin-border">
                  <button
                    type="button"
                    onClick={() => {
                      setHasSizes(true);
                      if (selectedSizes.length === 0) setSelectedSizes(['Free Size']);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      hasSizes
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Has Sizes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasSizes(false);
                      setSelectedSizes([]);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      !hasSizes
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    No Size Option
                  </button>
                </div>
              </div>

              {hasSizes ? (
                <div className="pt-4">
                  {/* Quick Action + Preset Size Chips */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setHasSizes(false);
                        setSelectedSizes([]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    >
                      ✕ Set to No Size
                    </button>
                    {PRESET_SIZES.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-stone-900 text-white shadow-xs'
                              : 'bg-[#FAF8F5] text-stone-700 border border-admin-border hover:border-tan'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Size Input */}
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      type="text"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomSize();
                        }
                      }}
                      placeholder="Custom size (e.g. 4XL, 36)"
                      className="flex-1 bg-[#FAF8F5] border border-admin-border rounded-lg px-3 py-1.5 text-xs text-stone-900 uppercase focus:bg-white focus:outline-none focus:border-tan"
                    />
                    <button
                      type="button"
                      onClick={() => addCustomSize()}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 border border-admin-border"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Selected Sizes Summary */}
                  {selectedSizes.length > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <span className="font-semibold text-stone-700">Selected Sizes ({selectedSizes.length}):</span>
                      {selectedSizes.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 bg-white border border-stone-300 rounded px-2 py-0.5 text-xs font-bold"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => toggleSize(s)}
                            className="text-stone-400 hover:text-rose-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-amber-600">
                      No sizes selected yet. Click size chips above or choose &quot;No Size Option&quot;.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>✓ <strong>No Size Option Active:</strong> This product will display without size selection. Customers can buy it directly as a single / free size.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHasSizes(true);
                      setSelectedSizes(['Free Size']);
                    }}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white font-bold uppercase tracking-wider text-[11px] rounded-lg flex-shrink-0 transition-colors"
                  >
                    + Add Sizes
                  </button>
                </div>
              )}
            </div>

            {/* Color Options Section */}
            <div className="border-t border-admin-border/60 pt-5">
              <div className="flex items-center justify-between pb-3 border-b border-admin-border">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-tan" />
                  <div>
                    <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900">
                      Product Colors
                    </h2>
                    <p className="text-[11px] text-stone-500">
                      {hasColors
                        ? 'Select or add available color shades for this product'
                        : 'No color options — product is sold as shown in photos'}
                    </p>
                  </div>
                </div>

                <div className="inline-flex p-0.5 bg-stone-100 rounded-lg border border-admin-border">
                  <button
                    type="button"
                    onClick={() => {
                      setHasColors(true);
                      if (selectedColors.length === 0) setSelectedColors(['Maroon']);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      hasColors
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Has Colors
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasColors(false);
                      setSelectedColors([]);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      !hasColors
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    No Color Option
                  </button>
                </div>
              </div>

              {hasColors ? (
                <div className="pt-4">
                  {/* Quick Action + Popular Color Chips */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setHasColors(false);
                        setSelectedColors([]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    >
                      ✕ Set to No Color
                    </button>
                    {POPULAR_COLORS.map((col) => {
                      const isSelected = selectedColors.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => toggleColor(col.name)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                              : 'bg-[#FAF8F5] text-stone-800 border-admin-border hover:border-tan'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 flex-shrink-0"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Color Input */}
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      type="text"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomColor();
                        }
                      }}
                      placeholder="Custom color (e.g. Copper Rust)"
                      className="flex-1 bg-[#FAF8F5] border border-admin-border rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan"
                    />
                    <button
                      type="button"
                      onClick={() => addCustomColor()}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 border border-admin-border"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Selected Colors Summary */}
                  {selectedColors.length > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <span className="font-semibold text-stone-700">Selected Colors ({selectedColors.length}):</span>
                      {selectedColors.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1 bg-white border border-stone-300 rounded px-2 py-0.5 text-xs font-bold"
                        >
                          {c}
                          <button
                            type="button"
                            onClick={() => toggleColor(c)}
                            className="text-stone-400 hover:text-rose-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-amber-600">
                      No colors selected yet. Click swatches above or choose &quot;No Color Option&quot;.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>✓ <strong>No Color Option Active:</strong> This product will display without color selection. Sold as shown in photos.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHasColors(true);
                      setSelectedColors(['Maroon']);
                    }}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white font-bold uppercase tracking-wider text-[11px] rounded-lg flex-shrink-0 transition-colors"
                  >
                    + Add Colors
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Controls (1 col) */}
        <div className="space-y-6">
          {/* Organization & Stock */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 mb-2">
              Organization & Stock
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                required
                className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 font-mono placeholder-stone-400 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
                placeholder="e.g. AIZ-COT-01"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))
                }
                min={0}
                required
                className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
              />
            </div>

            {/* Quick Out-of-Stock Action Switch */}
            <div className="pt-1">
              <div className="flex items-center justify-between p-3 rounded-lg border border-admin-border bg-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      formData.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                    }`}
                  />
                  <span className="text-xs font-bold text-stone-900">
                    {formData.stock > 0 ? `In Stock (${formData.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, stock: prev.stock > 0 ? 0 : 10 }))
                  }
                  className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                    formData.stock > 0
                      ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {formData.stock > 0 ? 'Mark Out of Stock' : 'Mark In Stock (10)'}
                </button>
              </div>
            </div>
          </div>

          {/* Visibility & Badges */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-3.5">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 mb-2">
              Visibility & Badges
            </h2>

            {[
              { key: 'is_active', label: 'Published / Live in Store' },
              { key: 'is_bestseller', label: 'Best Seller (Feature in Best Sellers Section)' },
              { key: 'is_new', label: 'New Arrival Ribbon' },
              { key: 'is_offer', label: 'Offer Item (Show in Offer Items Page)' },
            ].map((toggle) => (
              <label
                key={toggle.key}
                className="flex items-center justify-between cursor-pointer py-1"
              >
                <span className="text-xs font-medium text-stone-700">{toggle.label}</span>
                <div
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      [toggle.key]: !prev[toggle.key as keyof typeof prev],
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                    formData[toggle.key as keyof typeof formData]
                      ? 'bg-emerald-600'
                      : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${
                      formData[toggle.key as keyof typeof formData]
                        ? 'translate-x-4.5'
                        : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-tan hover:bg-tan-dark text-white py-3.5 rounded-xl text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>{isEditing ? 'Update Product' : 'Create Product & Save Images'}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
