import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const range = url.searchParams.get('range') || '7d';
    const govFilter = url.searchParams.get('governorate') || 'cairo';

    // 1. Authenticate User
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Admin Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role === 'tourist') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Date Logic
    let startDate = new Date();
    let endDate = new Date();
    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '7d') {
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '30d') {
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    }
    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();

    // Gov ID Logic
    const { data: gov } = await supabaseAdmin
      .from('governorates')
      .select('id, name_ar')
      .eq('name_en', govFilter === 'cairo' ? 'Cairo' : govFilter === 'alexandria' ? 'Alexandria' : govFilter === 'giza' ? 'Giza' : govFilter === 'luxor' ? 'Luxor' : govFilter === 'aswan' ? 'Aswan' : govFilter)
      .single();
      
    const govId = gov?.id;

    // Fetch stats for reports
    const [checkinsRes, profilesRes, attractionsRes] = await Promise.all([
      supabaseAdmin.from('qr_checkins').select('id, attraction_id').gte('checked_in_at', startIso).lte('checked_in_at', endIso),
      govId ? supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('governorate_id', govId).gte('created_at', startIso).lte('created_at', endIso) : supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startIso).lte('created_at', endIso),
      govId ? supabaseAdmin.from('attractions').select('id, name_ar, name_en, category').eq('verified', true).eq('governorate_id', govId) : supabaseAdmin.from('attractions').select('id, name_ar, name_en, category').eq('verified', true)
    ]);

    const checkins = checkinsRes.data || [];
    const attractions = attractionsRes.data || [];
    
    // scope checkins
    const scopedAttractionsIds = new Set(attractions.map((a: any) => a.id));
    const localCheckins = checkins.filter((c: any) => scopedAttractionsIds.has(c.attraction_id));

    // Calculate report data
    const totalCheckins = localCheckins.length;
    const newUsers = profilesRes.count || 0;
    
    const checkinsByAttraction: Record<string, number> = {};
    localCheckins.forEach((c: any) => {
      if (c.attraction_id) {
        checkinsByAttraction[c.attraction_id] = (checkinsByAttraction[c.attraction_id] || 0) + 1;
      }
    });

    const topAttractions = Object.entries(checkinsByAttraction)
      .map(([id, count]) => ({
        name: attractions.find((a: any) => a.id === id)?.name_ar || 'غير معروف',
        count
      }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 5);

    let governorateNameAr = 'القاهرة';
    if (govFilter === 'alexandria') governorateNameAr = 'الإسكندرية';
    else if (govFilter === 'giza') governorateNameAr = 'الجيزة';
    else if (govFilter === 'luxor') governorateNameAr = 'الأقصر';
    else if (govFilter === 'aswan') governorateNameAr = 'أسوان';

    return NextResponse.json({
      governorateName: gov?.name_ar || governorateNameAr,
      dateRange: range,
      totalCheckins,
      newUsers,
      totalAttractions: attractions.length,
      topAttractions
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
