import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { day, city, attractionName, activities, logAnalyticsOnly, attractionId } = await req.json();

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    // If it's a save-trip flow, log the specific attractionId
    if (logAnalyticsOnly && attractionId) {
      await supabaseAdmin.from('analytics_events').insert({
        event_type: 'attraction_view',
        user_id: user.id,
        attraction_id: attractionId,
        metadata: { source: 'planner_save' }
      });
      return NextResponse.json({ success: true });
    }

    // For Day Visit Check-in flow
    // Try to find the attraction by name for the primary checkin (backward compatibility)
    let primaryAttraction = null;
    if (attractionName) {
      const { data: attractions } = await supabaseAdmin
        .from('attractions')
        .select('id, governorate_id')
        .or(`name_en.ilike.%${attractionName}%,name_ar.ilike.%${attractionName}%`)
        .limit(1);
      primaryAttraction = attractions && attractions.length > 0 ? attractions[0] : null;

      if (primaryAttraction) {
        // Log to qr_checkins
        const { data: existing } = await supabaseAdmin
          .from('qr_checkins')
          .select('id')
          .eq('user_id', user.id)
          .eq('attraction_id', primaryAttraction.id)
          .eq('verification_method', 'ai_planner_self_report')
          .limit(1);
          
        if (!existing || existing.length === 0) {
          await supabaseAdmin.from('qr_checkins').insert({
            user_id: user.id,
            attraction_id: primaryAttraction.id,
            governorate_id: primaryAttraction.governorate_id,
            verification_method: 'ai_planner_self_report'
          });
        }
      } else {
        await supabaseAdmin.from('qr_checkins').insert({
          user_id: user.id,
          attraction_id: null,
          verification_method: 'ai_planner_self_report',
          metadata: { city, day_number: day, attraction_name: attractionName }
        });
      }
    }

    // New requirement: log analytics_events for EACH attraction in the day
    if (activities && activities.length > 0) {
      const { data: allAttractions } = await supabaseAdmin.from('attractions').select('id, name_en');
      if (allAttractions) {
        for (const act of activities) {
          const actName = act.name || '';
          const match = allAttractions.find(a => 
            actName.toLowerCase().includes(a.name_en.toLowerCase()) || 
            a.name_en.toLowerCase().includes(actName.toLowerCase())
          );
          if (match) {
            await supabaseAdmin.from('analytics_events').insert({
              event_type: 'attraction_view',
              user_id: user.id,
              attraction_id: match.id,
              metadata: { source: 'planner_visit_day' }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, found: !!primaryAttraction });
  } catch (error: any) {
    console.error('Planner check-in error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
