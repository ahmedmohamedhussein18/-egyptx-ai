import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { country, duration, budget, interests, travelStyle } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY');
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Validate inputs
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration < 1 || parsedDuration > 30) {
      return NextResponse.json({ error: 'Invalid duration.' }, { status: 400 });
    }

    const interestsString = Array.isArray(interests) ? interests.join(', ') : '';

    const prompt = `You are an expert Egypt travel planner. Create a realistic, day-by-day itinerary in Egypt for a traveler from ${country || 'abroad'}.
Trip Details:
- Duration: ${parsedDuration} days
- Budget: $${budget}
- Interests: ${interestsString || 'general'}
- Travel Style: ${travelStyle || 'standard'}

IMPORTANT INSTRUCTIONS:
- You MUST return exactly ${parsedDuration} days.
- Distribute activities logically, accounting for travel times between cities.
- Use only valid, prominent Egyptian tourist cities such as: Cairo, Giza, Luxor, Aswan, Siwa, Fayoum, Hurghada, Alexandria, Abu Simbel, Sharm El Sheikh, Dahab, Marsa Alam.
- Tailor the activities, dining, and accommodations hints to their budget ($${budget} total) and style (${travelStyle}).
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
          "title": "Grand Egyptian Museum",
          "description": "Short description of the activity"
        }
      ]
    }
  ]
}

Only return the JSON. No markdown formatting blocks or extra text.`;

    let data;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
      
      const text = response.text || '';
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // Retry once if parsing fails or text is wrapped in markdown
        const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanedText);
      }
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError);
      return NextResponse.json({ error: 'Failed to communicate with AI planner.' }, { status: 502 });
    }

    if (!data || !Array.isArray(data.days)) {
      throw new Error('AI returned an invalid structure.');
    }

    // Map `category` to `type` to match frontend expectations, and `dayNumber` to `day`
    const formattedData = data.days.map((d: any) => ({
      day: d.dayNumber,
      city: d.city,
      activities: d.activities.map((a: any) => ({
        time: a.time,
        type: a.category,
        name: a.title,
        description: a.description
      }))
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Generate Itinerary Route Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while planning your journey.' }, { status: 500 });
  }
}
