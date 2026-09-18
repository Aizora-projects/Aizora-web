import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your AIZORA account',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <User className="w-16 h-16 text-sand mx-auto mb-4" />
          <h1 className="font-heading text-2xl text-brown-dark mb-2">Welcome to AIZORA</h1>
          <p className="text-sm text-brown-light mb-8">
            Sign in to access your account and orders.
          </p>
          <p className="text-xs text-brown-light mb-4">
            Account features coming soon. For now, please use the admin panel for management.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brown-dark text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-[0.1em] uppercase text-brown-dark mb-8">
          My Account
        </h1>

        {/* Profile */}
        <div className="bg-white border border-border p-6 rounded-sm mb-6">
          <h2 className="text-xs tracking-[0.15em] uppercase font-semibold text-brown-dark mb-4">
            Profile
          </h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-brown-light">Email:</span> <span className="text-brown-dark">{profile?.email || user.email}</span></p>
            <p><span className="text-brown-light">Name:</span> <span className="text-brown-dark">{profile?.full_name || 'Not set'}</span></p>
            <p><span className="text-brown-light">Phone:</span> <span className="text-brown-dark">{profile?.phone || 'Not set'}</span></p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-border p-6 rounded-sm">
          <h2 className="text-xs tracking-[0.15em] uppercase font-semibold text-brown-dark mb-4">
            Recent Orders
          </h2>
          {orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-brown-dark">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-brown-light">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brown-dark">₹{order.total}</p>
                    <span className={`text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-success/10 text-success' :
                      order.status === 'cancelled' ? 'bg-error/10 text-error' :
                      'bg-gold/10 text-gold-dark'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brown-light py-4 text-center">
              No orders yet. Start shopping to see your orders here!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
