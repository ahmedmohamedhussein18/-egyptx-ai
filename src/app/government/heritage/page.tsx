import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GovernmentLayout from '@/components/government/GovernmentLayout';
import HeritageContent from '@/components/government/HeritageContent';

export const metadata = {
  title: 'Heritage Management - EgyptX',
  description: 'Manage and verify Egyptian heritage sites and attractions.',
};

export default async function HeritagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'tourist') {
    redirect('/');
  }

  return (
    <GovernmentLayout>
      <HeritageContent />
    </GovernmentLayout>
  );
}
