import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { MessageCircle, Phone, ArrowRight, Clock } from 'lucide-react';

interface OrdersPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const { status, page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10);
  const pageSize = 20;

  const adminClient = createAdminClient();

  let query = adminClient
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const from = (page - 1) * pageSize;
  const { data: orders, count } = await query.range(from, from + pageSize - 1);
  const totalPages = Math.ceil((count || 0) / pageSize);

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const getStatusBadge = (orderStatus: string) => {
    switch (orderStatus) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-admin-border/70">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-stone-900 tracking-wide uppercase">
          Customer Orders
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Monitor all incoming customer orders, delivery addresses, and send WhatsApp status updates.
        </p>
      </div>

      {/* Status Filters Bar (Touch-friendly & swipeable on mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        <Link
          href="/admin/orders"
          className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all flex-shrink-0 min-h-[38px] flex items-center ${
            !status
              ? 'bg-tan text-white shadow-xs'
              : 'bg-white text-stone-600 border border-admin-border hover:bg-[#FAF8F5] hover:text-stone-900 shadow-2xs'
          }`}
        >
          All Orders
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all flex-shrink-0 min-h-[38px] flex items-center ${
              status === s
                ? 'bg-tan text-white shadow-xs'
                : 'bg-white text-stone-600 border border-admin-border hover:bg-[#FAF8F5] hover:text-stone-900 shadow-2xs'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Orders View: Responsive Cards for Mobile, Clean Table for Desktop */}
      {orders && orders.length > 0 ? (
        <>
          {/* MOBILE CARDS VIEW (md:hidden) — Built specifically for iPhone / Mobile UX */}
          <div className="md:hidden space-y-3.5">
            {orders.map((order) => {
              const cleanDigits = (order.customer_phone || '').replace(/[^0-9]/g, '');
              const waPhone =
                cleanDigits.length === 10
                  ? `91${cleanDigits}`
                  : cleanDigits.startsWith('91') && cleanDigits.length === 12
                  ? cleanDigits
                  : cleanDigits;

              const shortRef = `#AIZ-${order.id.slice(0, 8).toUpperCase()}`;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-admin-border rounded-2xl p-4 shadow-2xs space-y-3"
                >
                  {/* Card Header: Ref & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-stone-900">
                      {shortRef}
                    </span>
                    <span
                      className={`text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info & Quick Contact */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {order.customer_name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Quick 1-Tap Mobile Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {order.customer_phone && (
                        <>
                          <a
                            href={`tel:${cleanDigits}`}
                            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-700 transition-colors"
                            aria-label={`Call ${order.customer_name}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                              `Hello ${order.customer_name}! 🌸 AIZORA Customer Care regarding order ${shortRef}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[#25D366] transition-colors"
                            aria-label={`WhatsApp ${order.customer_name}`}
                          >
                            <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Total & Action Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-admin-border/60">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        Total
                      </span>
                      <span className="text-base font-bold text-stone-900 font-heading">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAF5EE] hover:bg-tan text-tan hover:text-white rounded-xl text-xs font-semibold border border-tan/30 transition-all min-h-[38px]"
                    >
                      <span>View Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW (hidden md:block) */}
          <div className="hidden md:block bg-white border border-admin-border rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-admin-border bg-[#FAF8F5]/80 text-[10px] tracking-wider uppercase text-stone-500 font-semibold">
                    <th className="px-5 py-3.5">Order Ref</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Total Amount</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border/60">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FAF8F5]/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold text-stone-900 font-mono">
                          #AIZ-{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-stone-900">{order.customer_name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-stone-500 font-mono">
                            {order.customer_phone || order.customer_email}
                          </span>
                          {order.customer_phone && (
                            <a
                              href={`https://wa.me/${
                                order.customer_phone.replace(/[^0-9]/g, '').length === 10
                                  ? '91' + order.customer_phone.replace(/[^0-9]/g, '')
                                  : order.customer_phone.replace(/[^0-9]/g, '')
                              }?text=${encodeURIComponent(
                                `Hello ${order.customer_name}! 🌸 AIZORA Customer Care regarding order #AIZ-${order.id.slice(0, 8).toUpperCase()}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="text-[#25D366] hover:opacity-80 transition-opacity"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-stone-500">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-stone-900">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full font-bold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-xs font-semibold text-tan hover:text-tan-dark hover:underline"
                        >
                          View Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-admin-border rounded-xl text-center py-14 px-4 shadow-2xs">
          <p className="text-sm text-stone-500">
            {status
              ? `No ${status} orders found.`
              : 'No orders recorded yet. As customers click "Buy Now" on the storefront, orders will appear here.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?page=${p}${status ? `&status=${status}` : ''}`}
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
