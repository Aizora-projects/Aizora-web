import { createClient } from '@supabase/supabase-js';

// Service-role client for privileged server operations ONLY.
// NEVER import this in Client Components or browser bundles.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
