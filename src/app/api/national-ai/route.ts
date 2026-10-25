import { NextResponse } from 'next/server';
import { createUniversalChatCompletion } from '@/lib/ai-client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, stats } = body;

    if (!query) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const systemInstruction = `You are the EgyptX Supreme National AI Tourism Intelligence Agent.
You provide insights, explain trends, and answer questions based on the real verified national data provided to you.
Keep your answers professional, concise, and focused on national tourism strategy, policy making, and resource allocation.
If asked to speak Arabic, do so fluently and professionally.

CURRENT VERIFIED NATIONAL DATA:
- Total Verified Check-ins: ${stats?.checkins || 0}
- Total Attraction Views: ${stats?.views || 0}
- Total AI Planner Requests: ${stats?.plannerReqs || 0}
- Total Active Tourists: ${stats?.activeUsers || 0}
`;

    const messages = [
      { role: 'system' as const, content: systemInstruction },
      { role: 'user' as const, content: query },
    ];

    const replyText = await createUniversalChatCompletion({
      model: 'openai/gpt-4o-mini',
      messages,
      temperature: 0.3,
      max_tokens: 600,
    });

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('National AI API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
