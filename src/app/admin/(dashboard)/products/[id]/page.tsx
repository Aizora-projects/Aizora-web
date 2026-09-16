import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

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
          Edit Product
        </h1>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
