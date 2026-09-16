import Link from 'next/link';
import { getProducts } from '@/actions/products';
import { formatPrice } from '@/lib/utils';
import { Plus, Eye, Edit, Search } from 'lucide-react';
import ProductStatusToggle from '@/components/admin/ProductStatusToggle';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const { page: pageStr, search } = await searchParams;
  const page = parseInt(pageStr || '1', 10);

  const result = await getProducts({ page, pageSize: 20, search: search || undefined });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-admin-border/60">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900 tracking-[0.05em] uppercase">
            Products Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your fashion catalog, inventory stock, and Cloudinary photoshoot images.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-tan hover:bg-tan-dark text-white px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-semibold transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="max-w-md w-full">
        <form action="/admin/products" method="GET">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search by product name..."
              className="w-full bg-white border border-admin-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all shadow-2xs"
            />
          </div>
        </form>
      </div>

      {/* Products Table Card */}
      <div className="bg-white border border-admin-border rounded-xl overflow-hidden shadow-2xs">
        {result.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-admin-border bg-[#FAF8F5]/80 text-[10px] tracking-wider uppercase text-stone-500 font-semibold">
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-4 py-3.5 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border/60">
                {result.data.map((product) => {
                  const primaryImage =
                    product.images?.find((img) => img.is_primary) || product.images?.[0];
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#FAF8F5]/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {primaryImage ? (
                            <img
                              src={primaryImage.secure_url}
                              alt={product.name}
                              className="w-10 h-12 object-cover rounded-md bg-stone-100 border border-admin-border/50 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-12 bg-[#FAF8F5] border border-admin-border/50 rounded-md flex items-center justify-center text-stone-400 text-[10px] flex-shrink-0">
                              No img
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm text-stone-900 font-medium line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-stone-500 font-mono">
                              SKU: {product.sku || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-stone-600">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-stone-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-[11px] text-stone-400 line-through block">
                            {formatPrice(product.compare_at_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            product.stock <= 5
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'text-stone-700'
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <ProductStatusToggle productId={product.id} isActive={product.is_active} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
                            title="View live on storefront"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-stone-400 hover:text-tan hover:bg-cream/60 rounded-md transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <ProductDeleteButton productId={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-14 px-4">
            <p className="text-stone-500 text-sm mb-4">
              {search ? `No products match "${search}"` : 'No products in catalog yet.'}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-tan hover:bg-tan-dark text-white px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/products?page=${p}${search ? `&search=${search}` : ''}`}
              className={`w-9 h-9 flex items-center justify-center text-xs rounded-lg font-medium transition-colors ${
                p === page
                  ? 'bg-tan text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-admin-border hover:bg-[#FAF8F5]'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
