import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Server-side role check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role === 'tourist') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch attractions and governorates
    const [attractionsRes, governoratesRes] = await Promise.all([
      supabase.from('attractions').select('*, governorates(id, name_en, name_ar)').order('created_at', { ascending: false }),
      supabase.from('governorates').select('id, name_en, name_ar').order('name_en')
    ]);

    if (attractionsRes.error) throw attractionsRes.error;
    if (governoratesRes.error) throw governoratesRes.error;

    return NextResponse.json({
      attractions: attractionsRes.data || [],
      governorates: governoratesRes.data || []
    });

  } catch (error: any) {
    console.error('Heritage API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch heritage data.' }, 
      { status: 500 }
    );
  }
}
