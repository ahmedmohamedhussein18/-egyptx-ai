import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GovernmentLayout from '@/components/government/GovernmentLayout';
import ContentManagement from '@/components/government/ContentManagement';

export const dynamic = 'force-dynamic';

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name, governorate')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role === 'tourist' || !['national_admin', 'governorate_admin'].includes(profile.role)) {
    redirect('/');
  }

  const govProfile = {
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    role: profile.role,
    governorate: profile.governorate || '',
  };

  return (
    <GovernmentLayout profile={govProfile}>
      <ContentManagement profile={govProfile} />
    </GovernmentLayout>
  );
}
