import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GovernmentLayout from '@/components/government/GovernmentLayout';
import VisitorsContent from '@/components/government/VisitorsContent';

export const metadata = {
  title: 'EgyptX - Visitors Monitoring',
};

export default async function VisitorsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!userData || userData.role === 'tourist') {
    redirect('/');
  }

  return (
    <GovernmentLayout>
      <VisitorsContent />
    </GovernmentLayout>
  );
}
