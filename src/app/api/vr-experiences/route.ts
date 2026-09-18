import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Server-side role validation
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['national_admin', 'governorate_admin', 'site_manager'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { attraction_id, asset_url, source, license, creator } = body;

    if (!attraction_id || !asset_url) {
      return NextResponse.json({ error: 'attraction_id and asset_url are required' }, { status: 400 });
    }

    // Insert the VR experience as verified
    const { data, error } = await supabase
      .from('vr_experiences')
      .insert({
        attraction_id,
        asset_url,
        asset_type: 'panorama_360',
        source,
        license,
        creator,
        verified: true // Admins add verified content
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('VR Add API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
