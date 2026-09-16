import { getDashboardStats } from '@/actions/categories';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import {
  Package,
  CheckCircle,
  Grid3X3,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      badge: 'In catalog',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Live Products',
      value: stats.activeProducts,
      icon: CheckCircle,
      badge: 'Active in store',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Categories',
      value: stats.totalCategories,
      icon: Grid3X3,
      badge: 'Collections',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      badge: 'Customer orders',
      color: 'text-violet-600 bg-violet-50',
    },
    {
      label: 'Gross Sales',
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      badge: 'Completed sales',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Low Stock',
      value: stats.lowStockProducts.length,
      icon: AlertTriangle,
      badge: '< 5 units',
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-admin-border/60">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900 tracking-[0.05em] uppercase">
            Store Overview
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Welcome to AIZORA Administration. Monitor inventory, incoming WhatsApp orders, and catalog status.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 bg-tan hover:bg-tan-dark text-white px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] border border-admin-border text-stone-800 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs"
          >
            <span>View Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-admin-border rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-stone-500 truncate">
                  {stat.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-stone-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">{stat.badge}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-admin-border/60">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900">
              Recent Products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-tan hover:text-tan-dark font-semibold flex items-center gap-1"
            >
              <span>Manage Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentProducts.length > 0 ? (
            <div className="divide-y divide-admin-border/60">
              {stats.recentProducts.map((product: Record<string, unknown>) => {
                const images = product.images as Array<{ secure_url: string; is_primary: boolean }> | undefined;
                const thumb = images?.find((img) => img.is_primary)?.secure_url || images?.[0]?.secure_url;

                return (
                  <div
                    key={product.id as string}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={product.name as string}
                          className="w-10 h-12 object-cover rounded-md bg-stone-100 border border-admin-border/50 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-12 bg-[#FAF8F5] border border-admin-border/50 rounded-md flex items-center justify-center text-stone-400 text-[10px] flex-shrink-0">
                          No img
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-sm font-medium text-stone-900 hover:text-tan transition-colors truncate block"
                        >
                          {product.name as string}
                        </Link>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {(product.category as Record<string, string>)?.name || 'Uncategorized'} •{' '}
                          {formatPrice(Number(product.price))}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0 border ${
                        product.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-xs">
              No products created yet. Click &ldquo;Add Product&rdquo; to start your catalog.
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-admin-border/60">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-tan hover:text-tan-dark font-semibold flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length > 0 ? (
            <div className="divide-y divide-admin-border/60">
              {stats.recentOrders.map((order: Record<string, unknown>) => (
                <div
                  key={order.id as string}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-semibold text-stone-900 hover:text-tan transition-colors font-mono"
                    >
                      #AIZ-{(order.id as string).slice(0, 8).toUpperCase()}
                    </Link>
                    <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                      {order.customer_name as string} • {order.customer_phone as string}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-stone-900">
                      {formatPrice(Number(order.total))}
                    </p>
                    <span className="text-[10px] font-semibold text-tan uppercase tracking-wider">
                      {order.status as string}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-xs">
              No customer orders yet. When customers check out via WhatsApp, orders will appear here.
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockProducts.length > 0 && (
          <div className="bg-white border border-amber-200 rounded-xl p-5 sm:p-6 lg:col-span-2 shadow-2xs">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low Stock Alert ({stats.lowStockProducts.length} items with &lt; 5 units)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {stats.lowStockProducts.map((product: Record<string, unknown>) => (
                <div
                  key={product.id as string}
                  className="bg-[#FAF8F5] border border-admin-border p-3 rounded-lg"
                >
                  <p className="text-xs font-medium text-stone-900 truncate">
                    {product.name as string}
                  </p>
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    Only {Number(product.stock)} in stock
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
