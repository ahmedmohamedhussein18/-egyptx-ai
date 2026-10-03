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
      avoidCrowds,
      routePreference,
      destinations,
    } = body;

    // Validate inputs
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration < 1 || parsedDuration > 30) {
      return NextResponse.json({ error: 'Invalid duration.' }, { status: 400 });
    }

    const parsedTravelers = parseInt(travelers, 10) || 1;

    // Grounding: Fetch real attractions from Supabase
    const supabase = await createClient();
    let query = supabase
      .from('attractions')
      .select('id, name_en, city, category, description_en')
      .eq('verified', true);

    if (governorateId) {
      query = query.eq('governorate_id', governorateId);
    }

    const { data: attractions, error: dbError } = await query.limit(150);
    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to fetch attractions data.' }, { status: 500 });
    }

    const attractionsContext =
      attractions && attractions.length > 0
        ? attractions
            .map(
              (a) =>
                `- ${a.name_en} | City: ${a.city} | Category: ${a.category} | ${a.description_en || 'Historic site'}`
            )
            .join('\n')
        : 'No verified attractions in database — use general knowledge of Egypt.';

    // Build pace instruction
    const paceInstruction =
      pace === 'relaxed'
        ? 'Schedule 2 activities per day with generous free time.'
        : pace === 'packed'
        ? 'Schedule 5+ activities per day.'
        : 'Schedule exactly 3 activities per day.';

    const interestsString = Array.isArray(interests) ? interests.join(', ') : 'general sightseeing';
    const destinationsConstraint =
      destinations && destinations.length > 0 ? destinations.join(', ') : 'Cairo';

    // ── ULTRA-STRICT SYSTEM PROMPT ──────────────────────────────────────────
    const systemPrompt = `You are EgyptX AI, the world's leading Egypt travel itinerary generator.

ABSOLUTE RULES — VIOLATING ANY RULE MAKES YOUR OUTPUT WORTHLESS:
1. You MUST return ONLY raw JSON — no markdown, no code fences, no comments, no extra text.
2. You MUST generate EXACTLY ${parsedDuration} days. Not ${parsedDuration - 1}. Not ${parsedDuration + 1}. EXACTLY ${parsedDuration}.
3. EVERY single day MUST have AT LEAST 3 complete activities. NEVER leave a day empty. NEVER write "No activities planned".
4. EVERY activity MUST include ALL 7 required fields: time, title, description, imagePath, transport, cost, historicalFact.
5. imagePath MUST follow exactly this format: /destinations/[city-in-lowercase]-main.jpg
   Examples: /destinations/cairo-main.jpg, /destinations/luxor-main.jpg, /destinations/aswan-main.jpg
6. You MUST ONLY use destinations from this list: ${destinationsConstraint}
7. Use ONLY real attractions from the VERIFIED DATABASE below. If the database has insufficient data, supplement with real, well-known Egyptian landmarks.

VERIFIED ATTRACTIONS DATABASE:
${attractionsContext}`;

    // ── USER PROMPT ──────────────────────────────────────────────────────────
    const userPrompt = `Generate a ${parsedDuration}-day Egypt itinerary with these exact parameters:
- Traveler origin: ${country || 'International'}
- Total budget: $${budget} for ${parsedTravelers} traveler(s)
- Interests: ${interestsString}
- Travel style: ${travelStyle || 'standard'}
- Pace: ${paceInstruction}
${accessibility ? `- Accessibility needs: ${accessibility}` : ''}
${avoidPlaces ? `- Avoid: ${avoidPlaces}` : ''}
${avoidCrowds ? `- Prefer: avoid crowded locations` : ''}
${routePreference === 'shortest-distance' ? `- Route: shortest distance, group nearby cities` : ''}

Return ONLY this exact JSON structure (no other text):

{
  "days": [
    {
      "dayNumber": 1,
      "city": "Cairo",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Great Pyramids of Giza",
          "description": "Stand before the last surviving wonder of the ancient world. Marvel at the colossal limestone structures built 4,500 years ago by Pharaoh Khufu. Walk among the three main pyramids and visit the iconic Great Sphinx.",
          "imagePath": "/destinations/cairo-main.jpg",
          "transport": "🚕 Taxi - 30 mins from downtown",
          "cost": "$$ Moderate",
          "historicalFact": "The Great Pyramid was the tallest man-made structure on Earth for over 3,800 years."
        },
        {
          "time": "02:00 PM",
          "title": "Egyptian Museum of Antiquities",
          "description": "Explore the world's largest collection of ancient Egyptian artifacts. Witness the golden death mask of Tutankhamun, royal mummies, and priceless treasures spanning 5,000 years of civilization.",
          "imagePath": "/destinations/cairo-main.jpg",
          "transport": "🚕 Taxi - 15 mins from Giza",
          "cost": "$ Budget-friendly",
          "historicalFact": "The museum houses over 120,000 artifacts, including 5,000 items from Tutankhamun's tomb."
        },
        {
          "time": "07:00 PM",
          "title": "Khan el-Khalili Night Market",
          "description": "Wander through Cairo's most famous medieval bazaar. Browse hand-crafted jewelry, spices, perfumes, and traditional crafts. Sip authentic Egyptian tea at the historic El Fishawi café.",
          "imagePath": "/destinations/cairo-main.jpg",
          "transport": "🚶 Walking - 10 mins from museum",
          "cost": "💸 Free entry (shopping optional)",
          "historicalFact": "Khan el-Khalili was established in 1382 by Emir Jarkas el-Khalili as a caravanserai."
        }
      ]
    }
  ]
}

REMINDER: Generate ALL ${parsedDuration} days. Each day needs AT LEAST 3 activities. ALL 7 fields required for every activity. Return ONLY JSON.`;

    // ── GROQ CALL WITH RETRY ─────────────────────────────────────────────────
    let formattedData: any = null;
    let errorMessage = '';
    let errorStatus = 500;
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const retryNote =
        attempt > 1
          ? `\n\nPREVIOUS ATTEMPT FAILED: ${errorMessage}\nYou MUST fix this. Generate exactly ${parsedDuration} days with at least 3 activities each. Return ONLY raw JSON.`
          : '';

      try {
        const { generateContentWithFallback } = await import('@/lib/groq');
        const groqData = await generateContentWithFallback({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt + retryNote },
          ],
          config: {
            response_format: { type: 'json_object' },
            temperature: attempt === 1 ? 0.1 : 0.3,
            max_tokens: 8000,
          },
        });

        const rawText = groqData.choices[0]?.message?.content || '';

        let parsed: any;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          const cleaned = rawText
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();
          parsed = JSON.parse(cleaned);
        }

        if (!parsed || !Array.isArray(parsed.days)) {
          throw new Error('Response missing "days" array.');
        }

        if (parsed.days.length !== parsedDuration) {
          throw new Error(
            `Expected ${parsedDuration} days, got ${parsed.days.length}.`
          );
        }

        // Validate sequential day numbers
        for (let i = 0; i < parsedDuration; i++) {
          const dayNum = parsed.days[i].dayNumber ?? parsed.days[i].day;
          if (dayNum !== i + 1) {
            throw new Error(
              `Day numbering broken: index ${i} has dayNumber ${dayNum}, expected ${i + 1}.`
            );
          }
        }

        // Map API response → internal Activity shape (supports both old & new fields)
        formattedData = parsed.days.map((d: any) => ({
          day: d.dayNumber ?? d.day,
          city: d.city || 'Egypt',
          activities: (d.activities || []).map((a: any) => ({
            time: a.time || '09:00 AM',
            name: a.title || a.name || 'Activity',
            description: a.description || '',
            type: a.category || a.type || 'sightseeing',
            // ── new rich fields ──
            imagePath: a.imagePath || `/destinations/${(d.city || 'cairo').toLowerCase().replace(/\s+/g, '-')}-main.jpg`,
            transport: a.transport || '🚕 Taxi',
            cost: a.cost || '$ Moderate',
            tip: a.tip || null,
            fact: a.historicalFact || a.fact || null,
          })),
        }));

        console.log(
          `[Planner] SUCCESS attempt=${attempt} days=${formattedData.length}`
        );
        break;
      } catch (err: any) {
        errorMessage = err.message || String(err);
        console.error(`[Planner] Attempt ${attempt} failed:`, errorMessage);

        if (errorMessage.includes('429')) errorStatus = 429;
        if (errorMessage.includes('503') || errorMessage.includes('504'))
          errorStatus = 503;

        if (errorStatus === 429 || errorStatus === 503) break;

        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1200 * attempt));
        }
      }
    }

    if (!formattedData) {
      if (errorStatus === 429) {
        return NextResponse.json(
          { error: 'AI is busy (rate limit). Please try again in a moment.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: 'Unable to generate a valid itinerary. Please try again.' },
        { status: 422 }
      );
    }

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Generate Itinerary Route Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while planning your journey.' },
      { status: 500 }
    );
  }
}
