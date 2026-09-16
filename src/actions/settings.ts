'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings(): Promise<Record<string, string>> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  const settingsMap: Record<string, string> = {};
  data?.forEach((row: { key: string; value: string }) => {
    if (row.key) {
      settingsMap[row.key] = row.value ?? '';
    }
  });

  return settingsMap;
}

export async function updateSiteSettings(
  settings: Record<string, string>
): Promise<{ success?: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value: value ?? '',
    updated_at: new Date().toISOString(),
  }));

  if (rows.length === 0) {
    return { success: true };
  }

  const { error } = await adminClient
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) {
    console.error('Error updating site settings:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
  revalidatePath('/admin/dashboard');

  return { success: true };
}
