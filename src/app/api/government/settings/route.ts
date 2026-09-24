import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role === 'tourist') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Honest empty states - getting real counts from Supabase API
    const [governoratesRes, attractionsRes, usersRes, plansRes] = await Promise.all([
      supabase.from('governorates').select('id', { count: 'exact', head: true }),
      supabase.from('attractions').select('id', { count: 'exact', head: true }).eq('verified', true),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('trip_plans').select('id', { count: 'exact', head: true })
    ]);

    return NextResponse.json({
      governorates: governoratesRes.count || 0,
      attractions: attractionsRes.count || 0,
      users: usersRes.count || 0,
      tripPlans: plansRes.count || 0
    });
  } catch (error) {
    console.error('Settings API GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, governorate } = body;

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        governorate: governorate
      })
      .eq('id', session.user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings API PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
