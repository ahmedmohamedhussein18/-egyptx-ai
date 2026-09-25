import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      country, 
      duration, 
      budget, 
      interests, 
      travelStyle,
      travelers,
      governorateId,
      pace,
      accessibility,
      avoidPlaces,
      avoidCrowds
    } = body;

    // Validate inputs
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration < 1 || parsedDuration > 30) {
      return NextResponse.json({ error: 'Invalid duration.' }, { status: 400 });
    }

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

    // Construct Pace instruction
    let paceInstruction = '';
    if (pace === 'relaxed') paceInstruction = '1-2 activities per day.';
    else if (pace === 'balanced') paceInstruction = '3-4 activities per day.';
    else if (pace === 'packed') paceInstruction = '5+ activities per day.';

    const interestsString = Array.isArray(interests) ? interests.join(', ') : '';

    const prompt = `You are an expert Egypt travel planner. Create a realistic, day-by-day itinerary in Egypt for a traveler from ${country || 'abroad'}.
Trip Details:
- Duration: ${parsedDuration} days
- Budget: $${budget} (Total for ${parsedTravelers} traveler(s). That's $${(budget / parsedTravelers).toFixed(2)} per person. Keep this in mind!)
- Travelers: ${parsedTravelers}
- Interests: ${interestsString || 'general'}
- Travel Style: ${travelStyle || 'standard'}
- Pace: ${paceInstruction || 'Balanced pace.'}
${accessibility ? `- Accessibility Needs: ${accessibility}` : ''}
${avoidPlaces ? `- Places to Avoid: ${avoidPlaces}` : ''}
${avoidCrowds ? `- Preference: Avoid crowded places.` : ''}

REAL ATTRACTIONS DATABASE:
You MUST ONLY select places from the following list. DO NOT invent or hallucinate any place names. If a venue is very small and there are many travelers, deprioritize it.
${attractionsContext}

IMPORTANT INSTRUCTIONS:
- You MUST return exactly ${parsedDuration} days.
- Distribute activities logically, accounting for travel times between cities.
- Use ONLY the real attractions provided above.
- If there are not enough real attractions to fill the days logically, include fewer activities, but NEVER invent places.
- Your response MUST be strictly valid JSON matching this exact structure:

{
  "days": [
    {
      "dayNumber": 1,
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
  ],
  "message": "Optional message (e.g. if limited attractions available)"
}

Only return the JSON. No markdown formatting blocks or extra text.`;

    // Call Groq API with validation and retry
    let formattedData: any = null;
    let errorStatus = 500;
    let errorMessage = '';

    const maxAttempts = 3; // Initial + 2 retries
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      let currentPrompt = prompt;
      
      if (attempt > 1) {
        currentPrompt += `\n\nCRITICAL VALIDATION FAILURE ON PREVIOUS ATTEMPT:
${errorMessage}

The application has already determined the requested duration.
requestedDays = ${parsedDuration}

You MUST generate exactly ${parsedDuration} itinerary days.
Do not decide a different duration.
Do not omit days.
Do not merge days.
Do not create extra days.
Do not duplicate days.
The days MUST be sequentially numbered from 1 to ${parsedDuration}.`;
      }

      try {
        const { generateContentWithFallback } = await import('@/lib/groq');
        const groqData = await generateContentWithFallback({
          messages: [{ role: 'user', content: currentPrompt }],
          config: {
            response_format: { type: "json_object" },
            // Slightly increase temperature on retry to encourage different outputs
            temperature: attempt === 1 ? 0.2 : 0.4
          }
        });
        
        const text = groqData.choices[0]?.message?.content || '';

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          data = JSON.parse(cleanedText);
        }

        if (!data || !Array.isArray(data.days)) {
          throw new Error('AI returned an invalid structure. Missing "days" array.');
        }

        // 1. Validate total day count
        if (data.days.length !== parsedDuration) {
          throw new Error(`Expected exactly ${parsedDuration} days, but received ${data.days.length} days.`);
        }

        // 2. Validate sequential day numbers
        for (let i = 0; i < parsedDuration; i++) {
          const expectedDayNumber = i + 1;
          const actualDayNumber = data.days[i].dayNumber || data.days[i].day;
          
          if (actualDayNumber !== expectedDayNumber) {
            throw new Error(`Expected day ${expectedDayNumber} at index ${i}, but found day ${actualDayNumber}. Days must be strictly sequential starting from 1.`);
          }
        }

        // If validation passes, construct formattedData
        formattedData = data.days.map((d: any) => ({
          day: d.dayNumber || d.day, 
          city: d.city || 'Egypt',
          activities: (d.activities || []).map((a: any) => ({
            time: a.time || '10:00',
            type: a.category || 'general',
            name: a.title || 'Activity',
            description: a.description || ''
          }))
        }));

        console.log(`[Planner] requestedDays=${parsedDuration} generatedDays=${formattedData.length} validation=SUCCESS retry=${attempt-1}`);
        break; // Success!

      } catch (err: any) {
        console.error(`[Planner] Attempt ${attempt} failed validation/fetch:`, err.message);
        errorMessage = err.message || String(err);
        
        if (errorMessage.includes('429')) errorStatus = 429;
        if (errorMessage.includes('503') || errorMessage.includes('504')) errorStatus = 503;
        
        // Only stop early if it's an API rate limit or hard timeout
        if (errorStatus === 429 || errorStatus === 503 || errorStatus === 504) {
          break;
        }

        console.log(`[Planner] requestedDays=${parsedDuration} validation=FAILED retry=${attempt}`);
        
        // Add a small delay before retrying
        if (attempt < maxAttempts) {
          await new Promise(res => setTimeout(res, 1000 * attempt));
        }
      }
    }

    if (!formattedData) {
      if (errorStatus === 429) {
        return NextResponse.json({ error: 'AI is currently busy (rate limit). Please try again in a moment.' }, { status: 429 });
      }
      return NextResponse.json({ error: 'Unable to generate a valid itinerary for the requested duration. Please try again.' }, { status: 422 });
    }

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Generate Itinerary Route Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while planning your journey.' }, { status: 500 });
  }
}
