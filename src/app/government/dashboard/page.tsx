import GovernmentDashboardContent from "@/components/GovernmentDashboardContent";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: "مركز الذكاء السياحي - محافظة القاهرة | EgyptX AI",
  description: "لوحة تحكم ذكية لإدارة السياحة في محافظة القاهرة",
};

export default async function GovernmentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Admin client to bypass RLS for profile check if needed
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, governorate_id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  if (profile.role === 'national_admin') {
    redirect('/command-center');
  }

  if (profile.role !== 'governorate_admin') {
    redirect('/login');
  }

  // Get Cairo UUID
  const { data: cairo } = await supabaseAdmin
    .from('governorates')
    .select('id')
    .ilike('name_en', 'Cairo')
    .single();

  if (!cairo || profile.governorate_id !== cairo.id) {
    redirect('/login');
  }

  return <GovernmentDashboardContent />;
}
