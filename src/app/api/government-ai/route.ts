import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, governorate, stats } = body;

    if (!query || !governorate) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const systemInstruction = `You are the EgyptX AI Tourism Intelligence Agent for the ${governorate} Governorate.
You provide insights, explain trends, and answer questions based on the real verified data provided to you.
Keep your answers professional, concise, and focused on tourism strategy. 
If asked to speak Arabic, do so fluently and professionally.

CURRENT VERIFIED DATA FOR ${governorate}:
- Verified Check-ins: ${stats?.checkins || 0}
- Attraction Views: ${stats?.views || 0}
- AI Planner Requests: ${stats?.plannerReqs || 0}
- Active Tourists: ${stats?.activeUsers || 0}
`;

    const groqMessages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: query }
    ];

    const response = await generateContentWithFallback({
      messages: groqMessages,
      config: {
        temperature: 0.5,
        max_tokens: 500,
      }
    });

    const replyText = response?.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate an analysis at this time.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Government AI API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
