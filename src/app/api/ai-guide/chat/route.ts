import { NextResponse } from 'next/server';
import {
  VERIFIED_EGYPT_HERITAGE_KB,
  OUT_OF_SCOPE_AR,
  OUT_OF_SCOPE_EN,
  isClearlyOutOfScope,
  isItineraryOrWeatherQuery,
  fetchEgyptLiveWeather,
  fetchTrustedWikipediaAndRAG,
  streamWithSmartFallback,
} from '@/lib/egypt-rag';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const TEXT_CHAT_SYSTEM_PROMPT = `You are the EgyptX AI Guide — the user's closest, warmest, and smartest Egyptian best friend ("صاحبي الجدع وحبيبي") and expert Egyptian historian & tour planner.

RULES & PERSONA:
1. Speak with the intelligence and fluency of ChatGPT, combined with the warmth, hospitality, and enthusiasm of a loyal Egyptian best friend walking alongside the user in Egypt.
2. Greet the user back naturally (e.g., if someone says "مرحبا" or "ازيك", reply warmly like a best friend; if they say "Hello", reply warmly in English).
3. Match the user's language 100% — Arabic for Arabic, English for English, French for French.
4. Ground all historical answers in the verified Egyptian heritage database and Wikipedia records below (covering Pharaonic, Greco-Roman, Coptic, Islamic, Mamluk, and Modern Egypt, including all temples, pyramids, and museums).
5. When the user says they have free time (e.g., "I have 3 free hours, what should I do?" or "أنا عندي 3 ساعات فاضيين أعمل إيه؟"), use the injected LIVE EGYPT WEATHER to suggest an immediate, tailored, step-by-step tourist and historical plan (e.g., visiting air-conditioned museums like the Grand Egyptian Museum or NMEC if it's hot outside, or walking through Al-Muizz Street, Khan el-Khalili, or attending a Sound & Light show if the weather is pleasant/evening).
6. STRICT TOPIC GUARDRAILS (Egyptian Tourism & History Only): You are strictly restricted to Egyptian history, monuments, museums, temples, and tourism in Egypt. If the user asks an out-of-scope question (e.g., "Did Egypt win the World Cup?", football, politics, coding, or non-Egyptian topics), politely and immediately refuse by stating:
   - In Arabic: "${OUT_OF_SCOPE_AR}"
   - In English (if asked in English): "${OUT_OF_SCOPE_EN}"
7. Output clean, readable conversational text without raw markdown symbols like ** or #.

${VERIFIED_EGYPT_HERITAGE_KB}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, context, stream } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastUserMessage =
      [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
    const isArabic = /[\u0600-\u06FF]/.test(String(lastUserMessage));

    if (isClearlyOutOfScope(String(lastUserMessage))) {
      const refusal = isArabic ? OUT_OF_SCOPE_AR : OUT_OF_SCOPE_EN;
      if (stream === false) {
        return NextResponse.json({ reply: refusal, landmark: context?.identified_name || null });
      }
      return new Response(refusal, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const [wikiAndDbContext, weatherContext] = await Promise.all([
      fetchTrustedWikipediaAndRAG(String(lastUserMessage)),
      isItineraryOrWeatherQuery(String(lastUserMessage))
        ? fetchEgyptLiveWeather(String(lastUserMessage))
        : Promise.resolve(''),
    ]);

    let systemPrompt = TEXT_CHAT_SYSTEM_PROMPT;
    if (context?.identified_name && context.identified_name !== 'Egyptian Heritage Monument') {
      systemPrompt += `\n\nCURRENTLY VIEWED MONUMENT CONTEXT: "${context.identified_name}". ${
        context.ai_description || ''
      }`;
    }
    if (weatherContext) {
      systemPrompt += `\n\n--- LIVE EGYPT WEATHER ---\n${weatherContext}`;
    }
    if (wikiAndDbContext) {
      systemPrompt += `\n\n--- LIVE WIKIPEDIA & VERIFIED RAG ---\n${wikiAndDbContext}`;
    }

    const formattedMessages: Array<{ role: 'user' | 'assistant'; content: string }> = messages
      .filter((m: any) => m.role !== 'system')
      .slice(-8)
      .map((m: any) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      }));

    return streamWithSmartFallback(req, {
      systemPrompt,
      messages: formattedMessages,
      temperature: 0.5,
      nonStreamingJson: stream === false,
      extraJsonFields: { landmark: context?.identified_name || null },
    });
  } catch {
    return NextResponse.json(
      {
        reply:
          'أهلاً بك يا صاحبي! أنا مرشدك ورفيقك السياحي في مصر، اسألني عن أي معبد أو أثر أو خروجة سياحية وهجاوبك فوراً!',
      },
      { status: 200 }
    );
  }
}
