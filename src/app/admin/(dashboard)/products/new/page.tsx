import ProductForm from '@/components/admin/ProductForm';
import { getCategories } from '@/actions/categories';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 text-admin-muted hover:text-admin-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-heading font-bold text-admin-text tracking-[0.1em] uppercase">
          New Product
        </h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
