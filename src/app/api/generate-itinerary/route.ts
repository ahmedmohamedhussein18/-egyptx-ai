import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createUniversalChatCompletion } from '@/lib/ai-client';

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

    // Fetch verified attractions from Supabase
    const supabase = await createClient();
    let query = supabase
      .from('attractions')
      .select('id, name_en, city, category, description_en')
      .eq('verified', true);

    if (governorateId) {
      query = query.eq('governorate_id', governorateId);
    }

    const { data: attractions, error: dbError } = await query.limit(100);
    if (dbError) {
      console.warn('Database Attractions Warning:', dbError);
    }

    const attractionsContext =
      attractions && attractions.length > 0
        ? attractions
            .map(
              (a) =>
                `- ${a.name_en} (${a.city}) [${a.category}]: ${a.description_en || 'Historic Egyptian site'}`
            )
            .join('\n')
        : 'Major landmarks: Giza Pyramids, Egyptian Museum, Khan el-Khalili, Karnak Temple, Valley of the Kings, Philae Temple, Abu Simbel.';

    const paceInstruction =
      pace === 'relaxed'
        ? 'Schedule 2 activities per day.'
        : pace === 'packed'
        ? 'Schedule 4-5 activities per day.'
        : 'Schedule 3 activities per day.';

    const interestsString = Array.isArray(interests) ? interests.join(', ') : 'sightseeing, history, culture';
    const destinationsConstraint =
      destinations && destinations.length > 0 ? destinations.join(', ') : 'Cairo, Luxor, Aswan';

    const systemPrompt = `You are the master Egypt travel planner for EgyptX AI.
Generate a realistic, exciting, and factually accurate ${parsedDuration}-day Egypt travel itinerary.

CRITICAL INSTRUCTIONS:
1. You MUST respond ONLY with a valid JSON object matching the schema below. Do not include markdown fences, preambles, or explanations.
2. Generate EXACTLY ${parsedDuration} days. Each day MUST contain at least 2 to 4 activities.
3. Every activity MUST have:
   - "time": e.g. "09:00 AM", "01:30 PM", "06:00 PM"
   - "title": Exact landmark or activity name
   - "description": 2-3 engaging, descriptive sentences
   - "category": e.g. "Historical", "Culture", "Dining", "Adventure"
   - "transport": e.g. "Taxi - 20 mins", "Walking - 5 mins", "Nile Felucca"
   - "cost": e.g. "$ Budget-friendly", "$$ Moderate", "$$$ Luxury", "Free entry"
   - "historicalFact": An authentic historical fact about the site

JSON SCHEMA REQUIRED:
{
  "days": [
    {
      "dayNumber": 1,
      "city": "Cairo",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Giza Pyramids and Great Sphinx",
          "description": "Witness the colossal pyramids of Khufu, Khafre, and Menkaure on the Giza plateau.",
          "category": "Historical",
          "transport": "Taxi - 25 mins from center",
          "cost": "$$ Moderate",
          "historicalFact": "The Great Pyramid remained the tallest human-made structure for over 3,800 years."
        }
      ]
    }
  ]
}

Available Landmarks for Reference:
${attractionsContext}`;

    const userPrompt = `Generate a ${parsedDuration}-day itinerary for ${parsedTravelers} traveler(s).
Budget: $${budget || 'Flexible'}.
Destinations: ${destinationsConstraint}.
Interests: ${interestsString}.
Travel style: ${travelStyle || 'standard'}.
Pace: ${paceInstruction}
${accessibility ? `Accessibility: ${accessibility}` : ''}
${avoidPlaces ? `Avoid: ${avoidPlaces}` : ''}
${avoidCrowds ? `Avoid crowded peak hours where possible.` : ''}
${routePreference ? `Route: ${routePreference}` : ''}`;

    let formattedData: any = null;
    let lastError: any = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Itinerary Generator] Attempt ${attempt} calling OpenRouter / OpenAI SDK...`);

        const rawContent = await createUniversalChatCompletion({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 4000,
          response_format: { type: 'json_object' },
        });

        // Clean & parse JSON safely
        let parsed: any;
        try {
          parsed = JSON.parse(rawContent);
        } catch {
          const cleaned = rawContent
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();
          parsed = JSON.parse(cleaned);
        }

        const rawDays = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.days)
          ? parsed.days
          : Array.isArray(parsed?.itinerary)
          ? parsed.itinerary
          : null;

        if (!rawDays || rawDays.length === 0) {
          throw new Error('Parsed response does not contain a valid days array.');
        }

        // Format to exact schema expected by PlannerContent.tsx
        formattedData = rawDays.map((d: any, idx: number) => {
          const dayNum = d.dayNumber ?? d.day ?? idx + 1;
          const city = d.city || destinationsConstraint.split(',')[0].trim() || 'Cairo';
          const activities = Array.isArray(d.activities) ? d.activities : [];

          return {
            day: dayNum,
            city,
            activities: activities.map((a: any) => ({
              time: a.time || '10:00 AM',
              name: a.title || a.name || 'Egyptian Landmark Experience',
              title: a.title || a.name || 'Egyptian Landmark Experience',
              description: a.description || 'Immerse yourself in authentic Egyptian culture and historical wonders.',
              type: a.category || a.type || 'sightseeing',
              imagePath: a.imagePath || `/destinations/${city.toLowerCase().replace(/\s+/g, '-')}-main.jpg`,
              transport: a.transport || '🚕 Taxi - 15 mins',
              cost: a.cost || '$$ Moderate',
              tip: a.tip || null,
              fact: a.historicalFact || a.fact || null,
            })),
          };
        });

        console.log(`[Itinerary Generator] Successfully generated ${formattedData.length} days.`);
        break;
      } catch (err: any) {
        lastError = err;
        console.error(`[Itinerary Generator] Attempt ${attempt} failed:`, err?.message || err);
      }
    }

    if (!formattedData || formattedData.length === 0) {
      console.error('[Itinerary Generator] All attempts failed, returning fallback itinerary structure.');
      // Emergency graceful itinerary fallback if all providers fail so UI never breaks
      const defaultCities = ['Cairo', 'Giza', 'Luxor', 'Aswan', 'Alexandria'];
      formattedData = Array.from({ length: parsedDuration }, (_, i) => {
        const city = defaultCities[i % defaultCities.length];
        return {
          day: i + 1,
          city,
          activities: [
            {
              time: '09:00 AM',
              name: `${city} Heritage Exploration`,
              title: `${city} Heritage Exploration`,
              description: `Discover the monumental landmarks, archaeological treasures, and rich legacy of ${city}.`,
              type: 'Historical',
              imagePath: `/destinations/${city.toLowerCase()}-main.jpg`,
              transport: '🚕 Taxi - 20 mins',
              cost: '$$ Moderate',
              tip: 'Arrive early to beat the afternoon heat.',
              fact: `${city} has stood as a crossroad of civilization for millennia.`,
            },
            {
              time: '02:00 PM',
              name: `${city} Cultural Journey`,
              title: `${city} Cultural Journey`,
              description: `Experience authentic Egyptian crafts, local culinary traditions, and guided museum collections.`,
              type: 'Culture',
              imagePath: `/destinations/${city.toLowerCase()}-main.jpg`,
              transport: '🚶 Walking - 10 mins',
              cost: '$ Budget-friendly',
              tip: 'Sample fresh koshary and hibiscus tea.',
              fact: 'Traditional Egyptian hospitality dates back to ancient times.',
            },
            {
              time: '06:30 PM',
              name: `Nile Sunset & Evening Promenade`,
              title: `Nile Sunset & Evening Promenade`,
              description: `Unwind with an evening stroll along the vibrant waterfront or take a traditional felucca sail.`,
              type: 'Relaxation',
              imagePath: `/destinations/${city.toLowerCase()}-main.jpg`,
              transport: '⛵ Felucca Boat',
              cost: '$$ Moderate',
              tip: 'Sunset on the Nile offers incredible photography lighting.',
              fact: 'The Nile River has nurtured civilization in Egypt for over 5,000 years.',
            },
          ],
        };
      });
    }

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('[Itinerary Generator Critical Error]:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while planning your journey.' },
      { status: 500 }
    );
  }
}
