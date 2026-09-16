'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Save, Loader2, Edit2, Check, Trash2 } from 'lucide-react';
import type { Category } from '@/types/database';
import { updateCategory, deleteCategoryImage } from '@/actions/categories';
import { useRouter } from 'next/navigation';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: category.description || '',
    tagline: category.tagline || '',
    is_active: category.is_active,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(category.image_url);
  const [success, setSuccess] = useState('');

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', 'aizora/categories');

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Upload failed');
      }

      const updateRes = await updateCategory(category.id, {
        image_url: result.secure_url,
        cloudinary_public_id: result.public_id,
      });

      if (updateRes && 'error' in updateRes && updateRes.error) {
        throw new Error(updateRes.error);
      }

      setImageUrl(result.secure_url);
      setSuccess('Image saved to database & Cloudinary!');
      setTimeout(() => setSuccess(''), 3000);
      router.refresh();
    } catch (err) {
      console.error('Image upload failed:', err);
      alert(err instanceof Error ? err.message : 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete the image for "${category.name}"? This will also delete it from Cloudinary.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteCategoryImage(category.id);
      if (res && 'error' in res && res.error) {
        throw new Error(res.error);
      }

      setImageUrl(null);
      setSuccess('Image deleted from Cloudinary & database!');
      setTimeout(() => setSuccess(''), 3000);
      router.refresh();
    } catch (err) {
      console.error('Failed to delete category image:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete image.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateCategory(category.id, formData);
      if (res && 'error' in res && res.error) {
        throw new Error(res.error);
      }
      setIsEditing(false);
      setSuccess('Saved!');
      setTimeout(() => setSuccess(''), 2500);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-admin-border rounded-xl p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        {/* Category Circular Photo (Cloudinary) */}
        <div className="flex-shrink-0 self-center sm:self-start text-center">
          <div className="relative inline-block">
            <label className="cursor-pointer group block">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-admin-border group-hover:border-tan transition-colors relative bg-[#FAF8F5] shadow-xs">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <Upload className="w-5 h-5 mb-0.5" />
                    <span className="text-[8px] uppercase tracking-wider font-semibold">Upload</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center z-20">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                disabled={isUploading || isDeleting}
              />
            </label>

            {/* Quick Delete Floating Badge */}
            {imageUrl && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={isDeleting || isUploading}
                className="absolute -top-1 -right-1 z-30 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-110 disabled:opacity-50"
                title="Delete image from Cloudinary & Database"
              >
                {isDeleting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          <div className="mt-1 space-y-0.5">
            <p className="text-[10px] text-stone-400">
              {imageUrl ? 'Tap to replace' : 'Tap to upload'}
            </p>
            {imageUrl && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={isDeleting || isUploading}
                className="text-[10px] text-rose-600 hover:text-rose-700 hover:underline font-semibold block mx-auto disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Image'}
              </button>
            )}
          </div>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-admin-border/50">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900">{category.name}</h3>
              <span className="text-[10px] text-stone-500 bg-[#FAF8F5] px-2 py-0.5 rounded border border-admin-border/60 font-mono">
                /{category.slug}
              </span>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  category.is_active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {category.is_active ? 'Active' : 'Hidden'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {success && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {success}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-tan hover:text-tan-dark font-semibold transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3 mt-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 tracking-wider uppercase mb-1">
                  Tagline (e.g. Everyday Elegance)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
                  placeholder="e.g. Pure Heritage Weaves"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-600 tracking-wider uppercase mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={2}
                  className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all resize-none"
                  placeholder="Collection description for SEO and category pages..."
                />
              </div>

              <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                    }
                    className="w-4 h-4 accent-tan rounded cursor-pointer"
                  />
                  <span>Show on storefront homepage</span>
                </label>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-1.5 bg-tan hover:bg-tan-dark text-white px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-semibold transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {category.tagline && (
                <p className="text-xs text-tan font-medium italic">&ldquo;{category.tagline}&rdquo;</p>
              )}
              <p className="text-xs text-stone-600 leading-relaxed">
                {category.description || 'No description added yet. Click Edit to add one.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
