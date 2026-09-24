import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, governorate')
      .eq('id', sessionData.session.user.id)
      .single();

    if (!profile || (profile.role !== 'national_admin' && profile.role !== 'governorate_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminSupabase = createAdminClient();
    let query = adminSupabase.from('attractions').select('*').order('created_at', { ascending: false });

    if (profile.role === 'governorate_admin') {
      if (!profile.governorate) {
        return NextResponse.json({ data: [] });
      }
      // Assuming the column could be either governorate or governorate_id. We'll use governorate_id based on generate-day
      query = query.eq('governorate_id', profile.governorate);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, governorate')
      .eq('id', sessionData.session.user.id)
      .single();

    if (!profile || (profile.role !== 'national_admin' && profile.role !== 'governorate_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name_en, name_ar, description_en, description_ar, city, category, governorate_id, verified, image_url } = body;

    if (!name_en || !description_en || !city || !category || !governorate_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (profile.role === 'governorate_admin' && governorate_id !== profile.governorate) {
      return NextResponse.json({ error: 'Forbidden to create in another governorate' }, { status: 403 });
    }

    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase.from('attractions').insert([{
      name_en,
      name_ar,
      description_en,
      description_ar,
      city,
      category,
      governorate_id,
      verified: verified || false,
      image_url: image_url || ''
    }]).select().single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, governorate')
      .eq('id', sessionData.session.user.id)
      .single();

    if (!profile || (profile.role !== 'national_admin' && profile.role !== 'governorate_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name_en, name_ar, description_en, description_ar, city, category, governorate_id, verified, image_url } = body;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const adminSupabase = createAdminClient();
    
    const { data: existing, error: fetchError } = await adminSupabase.from('attractions').select('*').eq('id', id).single();
    if (fetchError || !existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (profile.role === 'governorate_admin') {
      if (existing.governorate_id !== profile.governorate || (governorate_id && governorate_id !== profile.governorate)) {
        return NextResponse.json({ error: 'Forbidden to edit this governorate' }, { status: 403 });
      }
    }

    const { data, error } = await adminSupabase.from('attractions').update({
      name_en: name_en !== undefined ? name_en : existing.name_en,
      name_ar: name_ar !== undefined ? name_ar : existing.name_ar,
      description_en: description_en !== undefined ? description_en : existing.description_en,
      description_ar: description_ar !== undefined ? description_ar : existing.description_ar,
      city: city !== undefined ? city : existing.city,
      category: category !== undefined ? category : existing.category,
      governorate_id: governorate_id !== undefined ? governorate_id : existing.governorate_id,
      verified: verified !== undefined ? verified : existing.verified,
      image_url: image_url !== undefined ? image_url : existing.image_url
    }).eq('id', id).select().single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, governorate')
      .eq('id', sessionData.session.user.id)
      .single();

    if (!profile || (profile.role !== 'national_admin' && profile.role !== 'governorate_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const adminSupabase = createAdminClient();
    
    const { data: existing, error: fetchError } = await adminSupabase.from('attractions').select('*').eq('id', id).single();
    if (fetchError || !existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (profile.role === 'governorate_admin' && existing.governorate_id !== profile.governorate) {
      return NextResponse.json({ error: 'Forbidden to delete this governorate' }, { status: 403 });
    }

    const { error } = await adminSupabase.from('attractions').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
