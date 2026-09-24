import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GovernmentLayout from '@/components/government/GovernmentLayout';
import AnalyticsContent from '@/components/government/AnalyticsContent';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', session.user.id)
    .single();

  if (profile?.role === 'tourist') {
    redirect('/');
  }

  const govProfile = {
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
  };

  return (
    <GovernmentLayout profile={govProfile}>
      <AnalyticsContent />
    </GovernmentLayout>
  );
}
