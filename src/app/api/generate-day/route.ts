import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createUniversalChatCompletion } from '@/lib/ai-client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      country, 
      budget, 
      interests, 
      travelStyle, 
      travelers, 
      governorateId, 
      pace, 
      accessibility, 
      avoidPlaces, 
      avoidCrowds, 
      dayNumber, 
      existingItinerary 
    } = body;

    const parsedTravelers = parseInt(travelers, 10) || 1;

    // Grounding: Fetch real attractions
    const supabase = await createClient();
    let query = supabase.from('attractions').select('id, name_en, city, category, description_en').eq('verified', true);
    
    if (governorateId) {
      query = query.eq('governorate_id', governorateId);
    }
    
    const { data: attractions, error: dbError } = await query.limit(100);
    if (dbError) {
      console.warn('Database Error:', dbError);
    }

    const attractionsContext = attractions && attractions.length > 0 
      ? attractions.map(a => `- ${a.name_en} (${a.city}) [Category: ${a.category}]: ${a.description_en || 'Historic site'}`).join('\n')
      : 'Giza Pyramids, Egyptian Museum, Karnak Temple, Luxor Temple, Valley of the Kings, Philae Temple, Citadel of Saladin.';

    let paceInstruction = '3 activities per day.';
    if (pace === 'relaxed') paceInstruction = '1-2 activities per day.';
    else if (pace === 'packed') paceInstruction = '4-5 activities per day.';

    const interestsString = Array.isArray(interests) ? interests.join(', ') : 'sightseeing, heritage';

    const prompt = `You are an expert Egypt travel planner for EgyptX AI. The user wants to REGENERATE Day ${dayNumber} of their trip.
    
Traveler Details:
- Origin: ${country || 'International'}
- Total Budget: $${budget} for ${parsedTravelers} traveler(s)
- Interests: ${interestsString}
- Travel Style: ${travelStyle || 'standard'}
- Pace: ${paceInstruction}
${accessibility ? `- Accessibility: ${accessibility}` : ''}
${avoidPlaces ? `- Places to Avoid: ${avoidPlaces}` : ''}
${avoidCrowds ? `- Preference: Avoid crowded places.` : ''}

EXISTING ITINERARY CONTEXT:
${JSON.stringify(existingItinerary || {}, null, 2)}

REAL ATTRACTIONS DATABASE:
${attractionsContext}

IMPORTANT INSTRUCTIONS:
- You MUST return ONLY the JSON object for Day ${dayNumber}.
- Return strictly valid JSON matching this exact structure:

{
  "dayNumber": ${dayNumber},
  "city": "Cairo",
  "activities": [
    {
      "time": "09:00 AM",
      "category": "Historical",
      "title": "Exact Landmark Name",
      "description": "Engaging description of the activity and highlights."
    }
  ]
}

Do not include any text before or after the JSON.`;

    const rawContent = await createUniversalChatCompletion({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    let data: any;
    try {
      data = JSON.parse(rawContent);
    } catch {
      const cleanedText = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
      data = JSON.parse(cleanedText);
    }

    if (!data || !Array.isArray(data.activities)) {
      throw new Error('AI returned an invalid day structure.');
    }

    const formattedDay = {
      day: data.dayNumber || dayNumber,
      city: data.city || 'Cairo',
      activities: data.activities.map((a: any) => ({
        time: a.time || '10:00 AM',
        type: a.category || a.type || 'sightseeing',
        name: a.title || a.name || 'Activity',
        description: a.description || 'Enjoy this Egyptian cultural experience.',
      })),
    };

    return NextResponse.json(formattedDay);
  } catch (error) {
    console.error('Regenerate Day Route Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while regenerating this day.' }, { status: 500 });
  }
}
