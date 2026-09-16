import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-body">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-3.5 sm:p-6 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
