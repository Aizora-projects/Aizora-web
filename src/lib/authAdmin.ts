import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Server-side helper to verify if the requesting user has admin privileges.
 * Bypasses RLS issues on the profiles table by utilizing the admin service role.
 */
export async function verifyAdmin() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // 1. Check user metadata or admin email directly
    if (user.email === 'admin@aizora.in' || user.user_metadata?.role === 'admin') {
      return user;
    }

    // 2. Check profiles table with adminClient to safely bypass RLS
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role === 'admin') {
      return user;
    }

    return null;
  } catch (err) {
    console.error('verifyAdmin error:', err);
    return null;
  }
}
