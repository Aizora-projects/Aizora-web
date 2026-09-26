import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aizorastyle.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adminClient = createAdminClient();

  const now = new Date();

  // Core Static Marketing & Discovery Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/offers`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Category Pages
    const { data: categories } = await adminClient
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true);

    const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

    // Product Pages
    const { data: products } = await adminClient
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true);

    const productPages: MetadataRoute.Sitemap = (products || []).map((prod) => ({
      url: `${BASE_URL}/product/${prod.slug}`,
      lastModified: prod.updated_at ? new Date(prod.updated_at) : now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...categoryPages, ...productPages];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticPages;
  }
}
