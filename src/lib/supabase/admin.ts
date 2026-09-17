import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SECRET/service_role client. `import "server-only"` guarantees this
// file can never be bundled into client-side JS. Only import this
// inside app/api/** route handlers or Server Actions that genuinely
// need to bypass Row Level Security.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    process.env.SUPABASE_SECRET_KEY || "dummy",
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
