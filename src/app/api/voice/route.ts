import { NextResponse } from 'next/server';
import { executeThreeStagePipeline } from '@/lib/answerPipeline';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Route: /api/voice
 * Handles conversational voice tour-guide requests using the 3-Stage Answer Pipeline
 * (Groq -> OpenRouter -> OpenAI) with strict factual grounding.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, query, stream = false } = body;

    let userQuestion = '';
    if (typeof query === 'string' && query.trim()) {
      userQuestion = query.trim();
    } else if (Array.isArray(messages) && messages.length > 0) {
      const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
      userQuestion = lastUser?.content || '';
    }

    if (!userQuestion) {
      return NextResponse.json({ error: 'User query is required' }, { status: 400 });
    }

    const acceptsStreaming =
      stream === true || req.headers.get('accept')?.includes('text/event-stream');

    const result = await executeThreeStagePipeline(userQuestion, {
      stream: acceptsStreaming,
    });

    if (acceptsStreaming && result.stream) {
      return new Response(result.stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    return NextResponse.json({
      reply: result.reply,
      claims: result.supportedClaims,
      hasVerifiedData: result.context.hasVerifiedData,
    });
  } catch (error: any) {
    console.error('[Voice Assistant Pipeline Error]:', error);
    return NextResponse.json(
      { reply: 'أهلاً بك! أنا مرشدك الصوتي الذكي في مصر. كيف يمكنني إرشادك اليوم؟' },
      { status: 200 }
    );
  }
}
