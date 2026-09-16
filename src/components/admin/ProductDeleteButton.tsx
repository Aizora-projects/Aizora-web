'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/actions/products';
import { useRouter } from 'next/navigation';

interface ProductDeleteButtonProps {
  productId: string;
  productName: string;
}

export default function ProductDeleteButton({ productId, productName }: ProductDeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteProduct(productId);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsDeleting(false);
    setShowConfirm(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
        title="Delete product"
        aria-label={`Delete ${productName}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-admin-border rounded-xl p-6 max-w-sm w-full shadow-lg animate-scale-in">
            <h3 className="text-sm font-bold text-stone-900 mb-2">Delete Product</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              Are you sure you want to delete &ldquo;{productName}&rdquo;? All associated images will also be removed from Cloudinary. This action cannot be undone.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-xs tracking-wider uppercase font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs tracking-wider uppercase font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50 shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
