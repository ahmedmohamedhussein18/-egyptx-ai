import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import GovernmentLayout from '@/components/government/GovernmentLayout';
import ReportsContent from '@/components/government/ReportsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "التقارير والتصدير | EgyptX AI",
  description: "إنشاء وتقارير مخصصة",
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Use admin client to bypass RLS for profile
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';
  const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey);

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'tourist') {
    redirect('/');
  }

  const profileData = {
    firstName: profile?.first_name || profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || 'Admin',
    lastName: profile?.last_name || profile?.full_name?.split(' ').slice(1).join(' ') || profile?.name?.split(' ').slice(1).join(' ') || ''
  };

  return (
    <GovernmentLayout profile={profileData}>
      <ReportsContent />
    </GovernmentLayout>
  );
}
