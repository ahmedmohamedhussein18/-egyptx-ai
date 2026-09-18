import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const range = url.searchParams.get('range') || 'today';
    const customStart = url.searchParams.get('startDate');
    const customEnd = url.searchParams.get('endDate');

    // 1. Authenticate User
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch User Profile
    const { data: profile, error: profileError } = await supabaseUser
      .from('profiles')
      .select('role, governorate_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role === 'tourist') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const isNational = profile.role === 'national_admin';
    const govId = profile.governorate_id;

    if (!isNational && !govId) {
      return NextResponse.json({ error: 'Missing governorate assignment' }, { status: 400 });
    }

    // 3. Admin Client
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    // 4. Date Range Logic
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
    } else if (range === 'custom') {
      if (customStart) startDate = new Date(customStart);
      if (customEnd) endDate = new Date(customEnd);
      endDate.setHours(23, 59, 59, 999);
    }

    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();

    // Helper for scoping
    const applyScope = (query: any) => {
      if (!isNational) {
        return query.eq('governorate_id', govId);
      }
      return query;
    };

    // 5. Fetch Data in Parallel
    const [
      checkinsRes,
      analyticsRes,
      attractionsRes,
      governorateRes
    ] = await Promise.all([
      applyScope(
        supabaseAdmin
          .from('qr_checkins')
          .select('id, attraction_id, checked_in_at')
          .gte('checked_in_at', startIso)
          .lte('checked_in_at', endIso)
      ),
      applyScope(
        supabaseAdmin
          .from('analytics_events')
          .select('id, event_type, attraction_id, created_at')
          .gte('created_at', startIso)
          .lte('created_at', endIso)
      ),
      applyScope(
        supabaseAdmin
          .from('attractions')
          .select('id, name_en, category, city, latitude, longitude')
          .eq('verified', true)
      ),
      isNational ? Promise.resolve({ data: { name_en: 'National' } }) : supabaseAdmin.from('governorates').select('name_en').eq('id', govId).single()
    ]);

    const checkins = checkinsRes.data || [];
    const analytics = analyticsRes.data || [];
    const attractions = attractionsRes.data || [];
    const scopeName = governorateRes.data?.name_en || 'National';

    // 6. Calculate KPIs
    const verifiedCheckins = checkins.length;
    
    const attractionViews = analytics.filter((e: any) => e.event_type === 'attraction_view').length;
    const plannerRequests = analytics.filter((e: any) => e.event_type === 'planner_completed').length;

    // Top Attraction
    const viewsByAttraction: Record<string, number> = {};
    analytics.forEach((e: any) => {
      if (e.event_type === 'attraction_view' && e.attraction_id) {
        viewsByAttraction[e.attraction_id] = (viewsByAttraction[e.attraction_id] || 0) + 1;
      }
    });

    let topAttractionId = null;
    let topAttractionCount = 0;
    for (const [id, count] of Object.entries(viewsByAttraction)) {
      if (count > topAttractionCount) {
        topAttractionCount = count;
        topAttractionId = id;
      }
    }
    
    let mostViewedAttraction = null;
    if (topAttractionId) {
      const topAttrData = attractions.find((a: any) => a.id === topAttractionId);
      if (topAttrData) {
        mostViewedAttraction = {
          name: topAttrData.name_en,
          views: topAttractionCount
        };
      }
    }

    // 7. Timeseries Data (Check-ins over time)
    const timeseriesMap: Record<string, number> = {};
    checkins.forEach((c: any) => {
      const dateKey = new Date(c.checked_in_at).toISOString().split('T')[0];
      timeseriesMap[dateKey] = (timeseriesMap[dateKey] || 0) + 1;
    });

    // If no data, return empty array, else sort keys
    const checkinsOverTime = Object.keys(timeseriesMap).sort().map(date => ({
      date,
      checkins: timeseriesMap[date]
    }));

    // 8. Bar Chart Data (Most Viewed Attractions - Top 5)
    const viewsChartData = Object.entries(viewsByAttraction)
      .map(([id, views]) => ({
        name: attractions.find((a: any) => a.id === id)?.name_en || 'Unknown',
        views
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // 9. Map Markers (Attractions with Checkin Counts)
    const checkinsByAttraction: Record<string, number> = {};
    checkins.forEach((c: any) => {
      if (c.attraction_id) {
        checkinsByAttraction[c.attraction_id] = (checkinsByAttraction[c.attraction_id] || 0) + 1;
      }
    });

    const mapData = attractions.map((attr: any) => ({
      ...attr,
      checkins: checkinsByAttraction[attr.id] || 0
    }));

    return NextResponse.json({
      scopeName,
      isNational,
      kpis: {
        verifiedCheckins,
        attractionViews,
        plannerRequests,
        mostViewedAttraction
      },
      charts: {
        checkinsOverTime,
        viewsChartData
      },
      mapData
    });

  } catch (error) {
    console.error('Command Center API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
