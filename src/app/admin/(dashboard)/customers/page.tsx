import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminCustomersPage() {
  const adminClient = createAdminClient();

  const { data: customers, count } = await adminClient
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-admin-border/60">
        <h1 className="text-2xl font-heading font-bold text-stone-900 tracking-[0.05em] uppercase">
          Customers
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Registered customer accounts and shopping profiles.
        </p>
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden shadow-2xs">
        {customers && customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-admin-border bg-[#FAF8F5]/80 text-[10px] tracking-wider uppercase text-stone-500 font-semibold">
                  <th className="px-5 py-3.5">Customer Name & Email</th>
                  <th className="px-4 py-3.5 hidden sm:table-cell">Phone Number</th>
                  <th className="px-5 py-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border/60">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-[#FAF8F5]/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-stone-900">
                        {customer.full_name || 'Customer'}
                      </p>
                      <p className="text-xs text-stone-500">{customer.email}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-stone-600 font-mono">
                        {customer.phone || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-stone-500">
                        {new Date(customer.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-14 px-4">
            <p className="text-sm text-stone-500">
              No registered customers yet. Customer profiles will appear here.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-stone-500 font-medium">
        {count || 0} total customer accounts
      </p>
    </div>
  );
}
