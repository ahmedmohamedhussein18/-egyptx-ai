import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GovernmentLayout from '@/components/government/GovernmentLayout';
import SettingsContent from '@/components/government/SettingsContent';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profile?.role === 'tourist') {
    redirect('/');
  }

  return (
    <GovernmentLayout profile={{ firstName: profile?.first_name, lastName: profile?.last_name }}>
      <SettingsContent initialProfile={profile} userEmail={session.user.email || ''} />
    </GovernmentLayout>
  );
}
