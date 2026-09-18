import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memories } = body;

    if (!memories || !Array.isArray(memories) || memories.length === 0) {
      return NextResponse.json({ error: 'No memories provided' }, { status: 400 });
    }

    // Format memories for the prompt
    const memoriesContext = memories.map((m: any, index: number) => {
      let location = m.attractions?.name_en ? `Location: ${m.attractions.name_en}` : '';
      let date = m.visited_at ? `Date: ${m.visited_at}` : '';
      return `Memory ${index + 1}:
Title: ${m.title}
${date}
${location}
Note: ${m.note}
`;
    }).join('\n');

    const systemInstruction = `You are "EgyptX AI Memories", an expert personalized travel journal writer.
Your task is to write a cohesive, engaging, and personalized trip summary paragraph (4-6 sentences) based ONLY on the user's provided memories.
CRITICAL RULES:
1. ONLY use the destinations, dates, and experiences described in the provided memories.
2. DO NOT invent or hallucinate visits to any attractions or cities that are not explicitly mentioned.
3. Write in the second person ("You visited...", "Your journey began...").
4. Keep the tone warm, reflective, and poetic, capturing the essence of their Egyptian adventure.
5. If the memories are very brief, summarize them elegantly without adding fake details.`;

    const prompt = `Here are the user's memories:\n\n${memoriesContext}\n\nPlease generate the personalized trip summary.`;

    const response = await generateContentWithFallback({
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      config: {
        temperature: 0.7
      }
    });

    const replyText = response?.choices?.[0]?.message?.content || "Unable to generate summary at this time.";

    return NextResponse.json({ summary: replyText });
  } catch (error) {
    console.error('Generate Summary API Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
