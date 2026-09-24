import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', sessionData.session.user.id)
      .single();

    if (!userData || userData.role === 'tourist') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Fetch Attractions and Check-ins Count
    let formattedAttractions: any[] = [];
    const { data: attractions, error: attrError } = await supabase
      .from('attractions')
      .select('id, name, governorate');
      
    if (!attrError && attractions) {
      // For each attraction, we count check_ins. Since we don't know the exact schema,
      // we'll try to query check_ins table.
      const { data: checkinsData } = await supabase
        .from('check_ins')
        .select('attraction_id');
        
      const counts: Record<string, number> = {};
      if (checkinsData) {
        checkinsData.forEach((c: any) => {
          counts[c.attraction_id] = (counts[c.attraction_id] || 0) + 1;
        });
      }

      formattedAttractions = attractions.map((a: any) => ({
        id: a.id,
        name: a.name,
        governorate: a.governorate,
        checkinsCount: counts[a.id] || 0
      }));
    }

    // 2. Fetch Platform Visit Trends (Last 30 days)
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);

    const { data: eventsData } = await supabase
      .from('analytics_events')
      .select('created_at')
      .gte('created_at', dateFrom.toISOString())
      .order('created_at', { ascending: true });

    let trends: any[] = [];
    if (eventsData) {
      const grouped: Record<string, number> = {};
      eventsData.forEach((ev: any) => {
        const d = new Date(ev.created_at);
        const dateStr = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        grouped[dateStr] = (grouped[dateStr] || 0) + 1;
      });

      trends = Object.keys(grouped).map(d => ({ date: d, count: grouped[d] }));
    }

    return NextResponse.json({ 
      attractions: formattedAttractions,
      trends
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

