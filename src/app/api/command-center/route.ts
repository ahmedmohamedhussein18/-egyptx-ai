import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const range = url.searchParams.get('range') || 'today';
    const customStart = url.searchParams.get('startDate');
    const customEnd = url.searchParams.get('endDate');
    const govFilter = url.searchParams.get('governorate') || 'cairo'; // default cairo as requested

    // 1. Authenticate User
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Admin Client (needed to bypass RLS for profile and data)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY; // Use Service Role Key

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 });
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey);

    // 3. Fetch User Profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('Command Center Auth Check:');
    console.log('User ID:', user.id);
    console.log('Profile Data:', profile);
    console.log('Profile Error:', profileError);

    const allowedRoles = ['national_admin', 'governorate_admin', 'governorate_analyst', 'site_manager'];
    
    if (profileError) {
      console.error('Failed to fetch profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    if (!profile || !allowedRoles.includes(profile.role)) {
      console.log(`Access Denied - Role ${profile?.role} not in allowed list`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const isNational = profile.role === 'national_admin';
    const isGovAdmin = profile.role === 'governorate_admin' || profile.role === 'governorate_analyst';
    
    // Fetch Cairo Governorate ID
    const { data: cairoGov } = await supabaseAdmin
      .from('governorates')
      .select('id')
      .eq('name_en', 'Cairo')
      .single();
      
    const cairoId = cairoGov?.id;
    // Force scope to Cairo
    const govId = cairoId || profile.governorate_id;

    if (isGovAdmin && !profile.governorate_id) {
      return NextResponse.json({ error: 'Missing governorate assignment' }, { status: 403 });
    }

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
      if (govId) {
        return query.eq('governorate_id', govId);
      }
      return query;
    };

    // 5. Fetch Data in Parallel
    const [
      checkinsRes,
      analyticsRes,
      attractionsRes,
      profilesRes,
      tripPlansRes,
      tripPlacesRes,
      governoratesRes
    ] = await Promise.all([
      supabaseAdmin
        .from('qr_checkins')
        .select('id, attraction_id, checked_in_at')
        .gte('checked_in_at', startIso)
        .lte('checked_in_at', endIso),
      supabaseAdmin
        .from('analytics_events')
        .select('id, event_type, attraction_id, created_at')
        .gte('created_at', startIso)
        .lte('created_at', endIso),
      applyScope(
        supabaseAdmin
          .from('attractions')
          .select('id, name_en, name_ar, category, city, latitude, longitude, governorate_id')
          .eq('verified', true)
      ),
      // Profiles counts 
      govId ? 
        supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('governorate_id', govId).gte('created_at', startIso).lte('created_at', endIso) :
        supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startIso).lte('created_at', endIso),
      
      // Trip plans
      supabaseAdmin
        .from('trip_plans')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startIso)
        .lte('created_at', endIso),
      
      // Trip places
      supabaseAdmin
        .from('trip_places')
        .select('attraction_id, created_at')
        .gte('created_at', startIso)
        .lte('created_at', endIso),
        
      // Governorates
      supabaseAdmin
        .from('governorates')
        .select('id, name_en, name_ar')
    ]);

    const checkins = checkinsRes.data || [];
    const analytics = analyticsRes.data || [];
    const attractions = attractionsRes.data || [];
    const tripPlacesRaw = tripPlacesRes.data || [];
    const governoratesList = governoratesRes.data || [];
    
    // For national admin filtering by dropdown ('cairo'), for gov admin their data is already scoped to their govId.
    // However, since we don't have a reliable mapping for govFilter in attractions right now, we will just pass through the attractions if isGovAdmin, 
    // or if isNational we filter by city matches for 'cairo'
    let scopedAttractions = attractions;
    if (isNational && govFilter === 'cairo') {
      scopedAttractions = attractions.filter((a: any) => 
        a.city?.toLowerCase().includes('cairo') || 
        a.city?.toLowerCase().includes('giza')
      );
    }

    const scopedAttractionIds = new Set(scopedAttractions.map((a: any) => a.id));

    // Filter checkins and analytics to only include those that match our scoped attractions
    const localCheckins = checkins.filter((c: any) => scopedAttractionIds.has(c.attraction_id));
    const localAnalytics = analytics.filter((a: any) => !a.attraction_id || scopedAttractionIds.has(a.attraction_id));
    const localTripPlaces = tripPlacesRaw.filter((t: any) => scopedAttractionIds.has(t.attraction_id));

    // 6. Calculate KPIs
    const totalSessions = localAnalytics.length; 
    const attractionViews = localAnalytics.filter((e: any) => e.event_type === 'attraction_view').length;
    const verifiedCheckins = localCheckins.length;
    const registeredUsers = profilesRes.count || 0;
    const tripPlansCreated = tripPlansRes.count || 0;

    // 7. Timeseries Data (Check-ins over time)
    const timeseriesMap: Record<string, number> = {};
    localCheckins.forEach((c: any) => {
      const dateKey = new Date(c.checked_in_at).toISOString().split('T')[0];
      timeseriesMap[dateKey] = (timeseriesMap[dateKey] || 0) + 1;
    });

    const checkinsOverTime = Object.keys(timeseriesMap).sort().map(date => ({
      date,
      checkins: timeseriesMap[date]
    }));

    // 8. Category Distribution (Pie Chart)
    const categoryMap: Record<string, number> = {};
    localAnalytics.forEach((e: any) => {
      if (e.event_type === 'attraction_view' && e.attraction_id) {
        const attr = attractions.find((a: any) => a.id === e.attraction_id);
        if (attr && attr.category) {
          categoryMap[attr.category] = (categoryMap[attr.category] || 0) + 1;
        }
      }
    });
    
    const categoryDistribution = Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    })).sort((a, b) => b.value - a.value);

    // 9. Top Attractions Table Data (from checkins)
    const checkinsByAttraction: Record<string, number> = {};
    localCheckins.forEach((c: any) => {
      if (c.attraction_id) {
        checkinsByAttraction[c.attraction_id] = (checkinsByAttraction[c.attraction_id] || 0) + 1;
      }
    });

    const topAttractionsTable = Object.entries(checkinsByAttraction)
      .map(([id, checkins]) => ({
        id,
        name: attractions.find((a: any) => a.id === id)?.name_ar || attractions.find((a: any) => a.id === id)?.name_en || 'غير معروف',
        checkins
      }))
      .sort((a, b) => b.checkins - a.checkins)
      .slice(0, 10);

    // 10. Top Destinations in Planner (Bar Chart)
    const tripPlacesMap: Record<string, number> = {};
    localTripPlaces.forEach((t: any) => {
      if (t.attraction_id) {
        tripPlacesMap[t.attraction_id] = (tripPlacesMap[t.attraction_id] || 0) + 1;
      }
    });

    const topTripDestinations = Object.entries(tripPlacesMap)
      .map(([id, requests]) => ({
        name: attractions.find((a: any) => a.id === id)?.name_ar || attractions.find((a: any) => a.id === id)?.name_en || 'غير معروف',
        requests
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);

    // 11. Map Markers (Attractions with Checkin Counts)
    const mapData = scopedAttractions.map((attr: any) => ({
      ...attr,
      name: attr.name_ar || attr.name_en, // Use Arabic name if available
      checkins: checkinsByAttraction[attr.id] || 0
    }));

    return NextResponse.json({
      profile: {
        firstName: profile?.first_name || profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || 'Admin',
        lastName: profile?.last_name || profile?.full_name?.split(' ').slice(1).join(' ') || profile?.name?.split(' ').slice(1).join(' ') || '',
        role: profile.role
      },
      kpis: {
        totalSessions,
        registeredUsers,
        tripPlansCreated,
        attractionViews,
        verifiedCheckins,
        pendingCheckins: verifiedCheckins
      },
      charts: {
        checkinsOverTime,
        categoryDistribution,
        topAttractionsTable,
        topTripDestinations
      },
      mapData,
      governoratesList,
      attractionsList: attractions
    });

  } catch (error: any) {
    console.error('Command Center API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
