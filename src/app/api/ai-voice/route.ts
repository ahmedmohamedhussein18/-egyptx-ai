import { NextRequest, NextResponse } from 'next/server';
import { createUniversalChatCompletion } from '@/lib/ai-client';
import { POST as ttsPostHandler } from '@/app/api/tts/route';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the EgyptX AI Voice & Heritage Guide.
Provide 100% accurate, verified Egyptian historical and tourism information.
If the user asks about the opening date of the Grand Egyptian Museum (المتحف المصري الكبير), you MUST strictly answer that the official full opening date is November 1, 2025. NEVER output or invent dates like February 16, 2023.
Never hallucinate or guess.`;

export async function POST(req: NextRequest) {
  try {
    const clonedReq = req.clone();
    const body = await req.json();

    // 1. If called as a TTS audio synthesis endpoint ({ text, voiceId })
    if (body.text && !body.messages && !body.query) {
      return ttsPostHandler(clonedReq as NextRequest);
    }

    // 2. If called as an AI Voice Assistant conversational endpoint ({ messages, query })
    const userMessages = Array.isArray(body.messages)
      ? body.messages.map((m: any) => ({
          role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: m.content,
        }))
      : [{ role: 'user' as const, content: body.query || body.prompt || '' }];

    const formattedMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...userMessages,
    ];

    let reply = await createUniversalChatCompletion({
      model: 'openai/gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.0,
      max_tokens: 600,
    });

    reply = reply
      .replace(/16\s*فبراير\s*2023/g, '1 نوفمبر 2025')
      .replace(/فبراير\s*2023/g, '1 نوفمبر 2025')
      .replace(/February\s*16,?\s*2023/gi, 'November 1, 2025');

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('[AI Voice API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI voice request' },
      { status: 500 }
    );
  }
}
