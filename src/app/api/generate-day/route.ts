import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to fetch attractions data.' }, { status: 500 });
    }

    // Prepare context string of attractions
    const attractionsContext = attractions && attractions.length > 0 
      ? attractions.map(a => `- ${a.name_en} (${a.city}) [Category: ${a.category}]: ${a.description_en || 'No description'}`).join('\n')
      : 'No verified attractions available in the database for this selection.';

    let paceInstruction = '';
    if (pace === 'relaxed') paceInstruction = '1-2 activities per day.';
    else if (pace === 'balanced') paceInstruction = '3-4 activities per day.';
    else if (pace === 'packed') paceInstruction = '5+ activities per day.';

    const interestsString = Array.isArray(interests) ? interests.join(', ') : '';

    const prompt = `You are an expert Egypt travel planner. The user wants to REGENERATE Day ${dayNumber} of their trip.
    
Traveler Details:
- Country: ${country || 'abroad'}
- Budget: $${budget} total for ${parsedTravelers} traveler(s). That's $${(budget / parsedTravelers).toFixed(2)} per person. Keep this in mind!
- Travelers: ${parsedTravelers}
- Interests: ${interestsString || 'general'}
- Travel Style: ${travelStyle || 'standard'}
- Pace: ${paceInstruction || 'Balanced pace.'}
${accessibility ? `- Accessibility Needs: ${accessibility}` : ''}
${avoidPlaces ? `- Places to Avoid: ${avoidPlaces}` : ''}
${avoidCrowds ? `- Preference: Avoid crowded places.` : ''}

EXISTING ITINERARY (Do NOT repeat the exact same activities for this day if possible, try a different approach/different places):
${JSON.stringify(existingItinerary, null, 2)}

REAL ATTRACTIONS DATABASE:
You MUST ONLY select places from the following list. DO NOT invent or hallucinate any place names. If a venue is very small and there are many travelers, deprioritize it.
${attractionsContext}

IMPORTANT INSTRUCTIONS:
- You MUST return ONLY the JSON for Day ${dayNumber}.
- Use ONLY the real attractions provided above.
- Your response MUST be strictly valid JSON matching this exact structure:

{
  "dayNumber": ${dayNumber},
  "city": "Cairo",
  "activities": [
    {
      "time": "09:00",
      "category": "ancient",
      "title": "Exact Name from Database",
      "description": "Short description of the activity and why it fits their budget/style."
    }
  ]
}

Only return the JSON. No markdown formatting blocks.`;

    // Call Groq API with retry
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key is missing.' }, { status: 500 });
    }

    let groqRes;
    let rawError = '';
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.4 // slightly higher for varied regeneration
          })
        });

        if (groqRes.ok) break; // Success
        
        rawError = await groqRes.text();
        console.error(`Groq API Error generate-day (Attempt ${attempt}):`, groqRes.status, rawError);
        
        if (groqRes.status !== 429 && groqRes.status !== 503 && groqRes.status !== 504) {
          break;
        }
      } catch (err) {
        console.error(`Groq fetch exception generate-day (Attempt ${attempt}):`, err);
        if (attempt === 2) throw err;
      }

      if (attempt === 1) {
        await new Promise(res => setTimeout(res, 2000));
      }
    }

    if (!groqRes || !groqRes.ok) {
      if (groqRes && groqRes.status === 429) {
        return NextResponse.json({ error: 'AI is currently busy (rate limit). Please try again in a moment.' }, { status: 429 });
      }
      return NextResponse.json({ error: 'AI provider timeout or error. Please try again.' }, { status: groqRes?.status || 500 });
    }

    const groqData = await groqRes.json();
    const text = groqData.choices[0]?.message?.content || '';

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      data = JSON.parse(cleanedText);
    }

    if (!data || !data.activities) {
      throw new Error('AI returned an invalid structure.');
    }

    const formattedDay = {
      day: data.dayNumber,
      city: data.city,
      activities: data.activities.map((a: any) => ({
        time: a.time,
        type: a.category,
        name: a.title,
        description: a.description
      }))
    };

    return NextResponse.json(formattedDay);
  } catch (error) {
    console.error('Regenerate Day Route Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while regenerating this day.' }, { status: 500 });
  }
}
