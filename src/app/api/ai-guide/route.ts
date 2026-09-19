import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API Key missing' }, { status: 500 });
    }

    // Make sure we have the full data URL to send to OpenRouter
    const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://egyptx-ai.vercel.app',
        'X-Title': 'EgyptX AI'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              },
              {
                type: 'text',
                text: 'You are an expert Egyptian heritage guide. Identify this monument, artifact, or landmark. Provide: name, historical period, location in Egypt, and a brief 2-3 sentence description. If you cannot identify it with confidence, say so honestly. Never invent information.\n\nYou must respond ONLY with a valid JSON object matching this schema exactly:\n{\n  "identified_name": "The exact name of the monument/artifact (or empty string if unable)",\n  "confidence_level": "high" | "medium" | "low" | "unable",\n  "ai_description": "A 2-3 sentence accurate description. If unable to identify, provide a helpful message here explaining why."\n}'
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errData}`);
    }

    const data = await response.json();
    const aiResponseStr = data.choices?.[0]?.message?.content;

    if (!aiResponseStr) {
      throw new Error(`Vision model returned empty response.`);
    }

    // Clean up potential markdown wrapper from text output
    const cleanedStr = aiResponseStr.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse the JSON. If the model fails to output valid JSON, it will naturally fall to catch block
    const parsedResponse = JSON.parse(cleanedStr);
    
    let dbMatch = null;
    if (parsedResponse.confidence_level !== 'unable' && parsedResponse.identified_name) {
      // Search in our verified attractions table
      const searchName = parsedResponse.identified_name.split(' ')[0]; // rough keyword match if full name fails
      const { data: dbData } = await supabase
        .from('attractions')
        .select('*')
        .eq('verified', true)
        .ilike('name_en', `%${searchName}%`)
        .limit(1);
        
      if (dbData && dbData.length > 0) {
        dbMatch = dbData[0];
      }
    }

    return NextResponse.json({
      identified_name: parsedResponse.identified_name || 'Unknown',
      confidence_level: parsedResponse.confidence_level,
      ai_description: parsedResponse.ai_description,
      db_match: dbMatch
    });

  } catch (error: any) {
    console.error('AI Guide API Error:', error);
    return NextResponse.json({ error: 'Vision AI is temporarily unavailable. Please try again later.' }, { status: 500 });
  }
}
