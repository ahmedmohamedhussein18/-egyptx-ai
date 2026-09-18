import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CheckinClient from './CheckinClient';
import { trackEvent } from '@/lib/analytics';

export default async function CheckinPage({ params }: { params: { attractionId: string } }) {
  const { attractionId } = await params;
  const supabase = await createClient();

  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login if not authenticated
    redirect(`/login?redirectTo=/checkin/${attractionId}`);
  }

  // 2. Validate attraction exists and is verified
  const { data: attraction, error: attractionError } = await supabase
    .from('attractions')
    .select('*')
    .eq('id', attractionId)
    .eq('verified', true)
    .single();

  if (attractionError || !attraction) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Invalid Attraction</h1>
        <p className="text-gray-400 text-center">This QR code is invalid or the attraction is not currently verified.</p>
      </div>
    );
  }

  // 3. Check for duplicates in the last 4 hours
  const fourHoursAgo = new Date();
  fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

  const { data: recentCheckins, error: checkinSearchError } = await supabase
    .from('qr_checkins')
    .select('id')
    .eq('user_id', user.id)
    .eq('attraction_id', attractionId)
    .gte('checked_in_at', fourHoursAgo.toISOString());

  if (checkinSearchError) {
    console.error('Error checking recent checkins:', checkinSearchError);
  }

  if (recentCheckins && recentCheckins.length > 0) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-[#C9A84C] mb-4 text-center">Already Checked In!</h1>
        <p className="text-gray-400 text-center mb-8">You already checked in at {attraction.name_en} recently.</p>
        <a href="/smart-site" className="px-6 py-3 bg-[#1B6B93] rounded-xl font-bold">Go to Smart Sites</a>
      </div>
    );
  }

  // 4. Create check-in
  const { error: insertError } = await supabase
    .from('qr_checkins')
    .insert({
      attraction_id: attractionId,
      user_id: user.id,
      governorate_id: attraction.governorate_id,
      verification_method: 'qr_scan'
    });

  if (insertError) {
    console.error('Checkin Insert Error:', insertError);
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Check-in Failed</h1>
        <p className="text-gray-400 text-center">An error occurred while processing your check-in. Please try again.</p>
      </div>
    );
  }

  // Track the event
  // We can track it server-side by inserting directly, but we don't have session_id here easily.
  // We will track it by passing a success flag to the client component.
  
  return <CheckinClient attraction={attraction} userId={user.id} />;
}
