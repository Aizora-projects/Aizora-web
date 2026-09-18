import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  MapPin,
  PackageCheck,
  Clock,
  ExternalLink,
  ShieldCheck,
  Store,
} from 'lucide-react';
import OrderStatusChanger from '@/components/admin/OrderStatusChanger';
import OrderItemThumbnail from '@/components/admin/OrderItemThumbnail';
import {
  CopyOrderRefButton,
  CopyAddressButton,
  CustomerContactActions,
  StickyMobileOrderBar,
} from '@/components/admin/OrderQuickActions';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const adminClient = createAdminClient();

  const { data: order } = await adminClient
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(
          id,
          name,
          slug,
          images:product_images(*)
        )
      )
    `)
    .eq('id', id)
    .single();

  if (!order) notFound();

  const shortCode = `#AIZ-${order.id.slice(0, 8).toUpperCase()}`;

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

  const fullAddressString = `${order.customer_name}\n${order.shipping_address}\n${order.shipping_city}, ${order.shipping_state} - ${order.shipping_pincode}\nPhone: ${order.customer_phone || 'N/A'}`;

  const mapsQuery = encodeURIComponent(
    `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_pincode}`
  );

  return (
    <div className="space-y-5 sm:space-y-6 pb-24 lg:pb-6">
      {/* 1. Header (Mobile & iPhone optimized) */}
      <div className="pb-4 border-b border-admin-border/70 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/orders"
            className="p-2.5 -ml-1 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 rounded-xl border border-admin-border shadow-2xs transition-all flex-shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Back to orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-stone-900 tracking-wide uppercase">
                Order {shortCode}
              </h1>
              <CopyOrderRefButton orderCode={shortCode} />
              <span
                className={`inline-flex sm:hidden items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Placed on{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Status Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${getStatusBadge(
              order.status
            )}`}
          >
            ● {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Main Column: Purchased Items (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <div className="bg-white border border-admin-border rounded-2xl p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-admin-border/60">
              <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-tan" />
                <span>Purchased Items ({order.items?.length || 0})</span>
              </h2>
            </div>

            {/* Items List */}
            <div className="divide-y divide-admin-border/60">
              {order.items?.map(
                (item: {
                  id: string;
                  product_id: string | null;
                  product_image_url: string | null;
                  product_name: string;
                  quantity: number;
                  price_at_purchase: number;
                  total: number;
                  product?: {
                    id: string;
                    name: string;
                    slug: string;
                    images?: Array<{ secure_url: string; is_primary?: boolean }>;
                  } | null;
                }) => {
                  // Resolve primary image from either stored order_item or linked product
                  const productImages = item.product?.images || [];
                  const primaryProductImage =
                    productImages.find((img) => img.is_primary)?.secure_url ||
                    productImages[0]?.secure_url ||
                    null;
                  const itemImage = item.product_image_url || primaryProductImage;

                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3.5 sm:gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      {/* Robust Image Thumbnail with Error Fallback */}
                      <OrderItemThumbnail
                        src={itemImage}
                        alt={item.product_name}
                        productSlug={item.product?.slug}
                        size="md"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-stone-900 leading-snug">
                              {item.product_name}
                            </p>
                            {item.product?.slug && (
                              <Link
                                href={`/product/${item.product.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-[11px] text-tan hover:text-tan-dark font-medium mt-0.5 hover:underline"
                              >
                                <span>View in Storefront</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                          <span className="text-sm sm:text-base font-bold text-stone-900 flex-shrink-0 font-heading">
                            {formatPrice(Number(item.total))}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-500">
                          <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-admin-border font-medium text-stone-700">
                            Qty: <strong className="text-stone-900">{item.quantity}</strong>
                          </span>
                          <span className="text-stone-400">•</span>
                          <span>Unit: {formatPrice(Number(item.price_at_purchase))}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-admin-border/80 pt-4 mt-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-700">
                  {order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold text-stone-900 pt-3 border-t border-admin-border/70 font-heading">
                <span>Total Amount</span>
                <span className="text-stone-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column: Status & Customer & Delivery (1 col on desktop) */}
        <div className="space-y-5 sm:space-y-6">
          {/* Fulfillment & WhatsApp Notifier */}
          <div className="bg-white border border-admin-border rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-admin-border/60">
              <ShieldCheck className="w-4 h-4 text-tan" />
              <span>Fulfillment & WhatsApp</span>
            </h2>
            <OrderStatusChanger
              orderId={order.id}
              currentStatus={order.status}
              customerName={order.customer_name}
              customerPhone={order.customer_phone}
              total={Number(order.total)}
              orderCode={shortCode}
              shippingCity={order.shipping_city}
            />
          </div>

          {/* Customer Details */}
          <div className="bg-white border border-admin-border rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3.5">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-admin-border/60">
              <User className="w-4 h-4 text-tan" />
              <span>Customer Information</span>
            </h2>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EE] border border-tan/40 text-tan font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {order.customer_name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900 text-sm truncate">
                    {order.customer_name}
                  </p>
                  {order.customer_phone && (
                    <p className="text-stone-600 font-mono text-xs mt-0.5">
                      {order.customer_phone}
                    </p>
                  )}
                </div>
              </div>

              {order.customer_email && (
                <div className="pt-1 text-xs text-stone-500">
                  <span className="text-stone-400">Email: </span>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="hover:text-stone-900 underline"
                  >
                    {order.customer_email}
                  </a>
                </div>
              )}

              {/* Quick Call & WhatsApp Buttons */}
              {order.customer_phone && (
                <CustomerContactActions
                  phone={order.customer_phone}
                  name={order.customer_name}
                  orderCode={shortCode}
                />
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-admin-border rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-admin-border/60">
              <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-tan" />
                <span>Delivery Address</span>
              </h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-tan hover:text-tan-dark font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="text-xs text-stone-700 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-admin-border/70 space-y-1">
              <p className="font-bold text-stone-900 text-sm">{order.customer_name}</p>
              <p className="text-stone-600">{order.shipping_address}</p>
              <p className="text-stone-600">
                {order.shipping_city}, {order.shipping_state}
              </p>
              <p className="font-semibold text-stone-900 pt-1">
                PIN: <span className="font-mono">{order.shipping_pincode}</span>
              </p>
            </div>

            {/* 1-Tap Copy Full Address Button for Courier Apps */}
            <CopyAddressButton addressText={fullAddressString} />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile & iPhone */}
      <StickyMobileOrderBar
        customerPhone={order.customer_phone}
        customerName={order.customer_name}
        orderCode={shortCode}
        total={Number(order.total)}
        status={order.status}
      />
    </div>
  );
}
