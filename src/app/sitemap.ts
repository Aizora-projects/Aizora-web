import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';

const BASE_URL = 'https://aizora.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adminClient = createAdminClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Category pages
  const { data: categories } = await adminClient
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true);

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(cat.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Product pages
  const { data: products } = await adminClient
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true);

  const productPages: MetadataRoute.Sitemap = (products || []).map((prod) => ({
    url: `${BASE_URL}/product/${prod.slug}`,
    lastModified: new Date(prod.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
