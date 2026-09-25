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

    const { day, city, attractionName } = await req.json();

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    // Try to find the attraction by name
    const { data: attractions } = await supabaseAdmin
      .from('attractions')
      .select('id, governorate_id')
      .or(`name_en.ilike.%${attractionName}%,name_ar.ilike.%${attractionName}%`)
      .limit(1);

    console.log(`[Planner Checkin] Searching for attraction: ${attractionName} in ${city}`);
    const attraction = attractions && attractions.length > 0 ? attractions[0] : null;

    if (attraction) {
      console.log(`[Planner Checkin] Match found! ID: ${attraction.id}`);
      // Check if already recorded
      const { data: existing } = await supabaseAdmin
        .from('qr_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('attraction_id', attraction.id)
        .eq('verification_method', 'ai_planner_self_report')
        .limit(1);
        
      if (!existing || existing.length === 0) {
        const { error: insertError } = await supabaseAdmin.from('qr_checkins').insert({
          user_id: user.id,
          attraction_id: attraction.id,
          governorate_id: attraction.governorate_id,
          verification_method: 'ai_planner_self_report'
        });
        if (insertError) {
          console.error(`[Planner Checkin] Error inserting with ID:`, insertError);
        } else {
          console.log(`[Planner Checkin] Successfully inserted checkin for user: ${user.id}`);
        }
      } else {
        console.log(`[Planner Checkin] Already exists for user: ${user.id}`);
      }
    } else {
      console.log(`[Planner Checkin] No match found. Inserting as metadata fallback for user: ${user.id}`);
      // Fallback: log to qr_checkins with NULL attraction_id
      const { error: insertError } = await supabaseAdmin.from('qr_checkins').insert({
        user_id: user.id,
        attraction_id: null,
        verification_method: 'ai_planner_self_report',
        metadata: { city, day_number: day, attraction_name: attractionName }
      });
      if (insertError) {
        console.error(`[Planner Checkin] Error inserting metadata fallback:`, insertError);
      } else {
        console.log(`[Planner Checkin] Successfully inserted metadata fallback.`);
      }
    }

    return NextResponse.json({ success: true, found: !!attraction });
  } catch (error: any) {
    console.error('Planner check-in error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
