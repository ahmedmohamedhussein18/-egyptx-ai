import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SECRET/service_role client. Only import this inside app/api/** route
// handlers, Server Actions, or server-side evaluation scripts.
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient cannot be called from client-side code.");
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    process.env.SUPABASE_SECRET_KEY || "dummy",
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
