import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { email, service_type } = await req.json();

    if (!email || !service_type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('mobility_notifications')
      .insert([
        { email, service_type }
      ]);

    if (error) {
      console.error('Supabase error inserting mobility notification:', error);
      return NextResponse.json({ error: 'Failed to insert notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mobility Notify API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
