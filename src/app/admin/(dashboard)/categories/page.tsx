import { getCategories } from '@/actions/categories';
import CategoryList from '@/components/admin/CategoryList';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-admin-border/60">
        <h1 className="text-2xl font-heading font-bold text-stone-900 tracking-[0.05em] uppercase">
          Product Categories
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your 6 core categories. Upload circular photoshoot images that will display on the storefront homepage.
        </p>
      </div>

      <CategoryList categories={categories} />
    </div>
  );
}
