import { NextResponse } from 'next/server';
import {
  ARCHAEOLOGICAL_ACCURACY_RULE,
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

const TEXT_CHAT_SYSTEM_PROMPT = `You are a warm, highly intelligent Egyptian travel companion, best friend, and authoritative Egyptologist. Greet the user back naturally (e.g., if they say 'مرحبا', reply 'مرحبا! كيف يمكنني مساعدتك اليوم؟', and if they greet you in English, greet them back warmly in English). If they ask for itinerary advice like 'I have 3 free hours', give them an awesome, creative plan focusing on Egyptian tourism using the live weather.

NEVER say you lack information on Egyptian heritage. Match the user's language exactly (Arabic for Arabic, English for English).

${ARCHAEOLOGICAL_ACCURACY_RULE}

${VERIFIED_EGYPT_HERITAGE_KB}

NEVER use Markdown formatting. Do not use asterisks (**), hashes (#), or bullet symbols. Output 100% clean, conversational plain text.`;

/**
 * Vision monument recognition: OpenAI gpt-4o -> OpenRouter -> Groq vision.
 * Returns null if every provider fails so the caller can fall back to text.
 */
async function identifyWithVision(
  formattedMessages: Array<{ role: 'user' | 'assistant'; content: string | any[] }>,
  isArabic: boolean
): Promise<Record<string, any> | null> {
  const lastUser = [...formattedMessages].reverse().find((m) => Array.isArray(m.content));
  const parts = (lastUser?.content as any[]) || [];
  const imagePart = parts.find((p) => p.type === 'image');
  if (!imagePart) return null;
  const userText =
    parts.find((p) => p.type === 'text')?.text ||
    (isArabic ? 'حدد هذا المعلم المصري.' : 'Identify this Egyptian monument.');

  const sys = `You are an expert Egyptologist. Identify the Egyptian monument or artifact in the image.
${ARCHAEOLOGICAL_ACCURACY_RULE}
${VERIFIED_EGYPT_HERITAGE_KB}
Reply in ${isArabic ? 'Arabic' : 'English'} using ONLY raw JSON (no code fences, no markdown): {"identified_name":"name","confidence_level":"high|medium|low","ai_description":"3-5 plain-text sentences: period, location in Egypt, key facts"}`;

  const body = (model: string) =>
    JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 700,
      messages: [
        { role: 'system', content: sys },
        {
          role: 'user',
          content: [
            { type: 'text', text: userText },
            { type: 'image_url', image_url: { url: imagePart.image } },
          ],
        },
      ],
    });

  const groqKey = (process.env.GROQ_API_KEY || (process.env as any)['\uFEFFGROQ_API_KEY'])?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const orKey = process.env.OPENROUTER_API_KEY?.trim();

  const tries: Array<{ url: string; key: string; model: string }> = [];
  if (openaiKey) {
    tries.push({ url: 'https://api.openai.com/v1/chat/completions', key: openaiKey, model: 'gpt-4o' });
    tries.push({ url: 'https://api.openai.com/v1/chat/completions', key: openaiKey, model: 'gpt-4o-mini' });
  }
  if (orKey) {
    tries.push({ url: 'https://openrouter.ai/api/v1/chat/completions', key: orKey, model: 'openai/gpt-4o-mini' });
    tries.push({ url: 'https://openrouter.ai/api/v1/chat/completions', key: orKey, model: 'google/gemini-2.0-flash-001' });
  }
  if (groqKey) {
    tries.push({ url: 'https://api.groq.com/openai/v1/chat/completions', key: groqKey, model: 'qwen/qwen3.8-27b' });
  }

  for (const t of tries) {
    try {
      const res = await fetch(t.url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${t.key}`, 'Content-Type': 'application/json' },
        body: body(t.model),
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      let text: string = data?.choices?.[0]?.message?.content || '';
      text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/```json|```/gi, '').trim();
      if (!text) continue;
      let parsed: any = null;
      try {
        const m = text.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(m ? m[0] : text);
      } catch {
        parsed = null;
      }
      const name = parsed?.identified_name || (isArabic ? 'معلم أثري مصري' : 'Egyptian monument');
      const desc = String(parsed?.ai_description || text).replace(/\*\*/g, '');
      return {
        identified_name: name,
        confidence_level: parsed?.confidence_level || 'high',
        ai_description: desc,
        reply: desc,
      };
    } catch {
      // try next provider
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const groqKey = (process.env.GROQ_API_KEY || (process.env as any)['\uFEFFGROQ_API_KEY'])?.trim();
    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!groqKey && !openaiKey && !openrouterKey) {
      return NextResponse.json({ error: 'AI API key is not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { messages, prompt, question, image, language, stream } = body;
    const hasImage = Boolean(image);

    let formattedMessages: Array<{ role: 'user' | 'assistant'; content: string | any[] }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      formattedMessages = messages
        .filter((m: any) => m.role !== 'system')
        .map((m: any) => ({
          role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: m.content,
        }));
    } else if (prompt || question) {
      const textQuery = prompt || question;
      if (image) {
        const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
        formattedMessages = [
          {
            role: 'user',
            content: [
              { type: 'text', text: textQuery },
              { type: 'image', image: imageUrl },
            ],
          },
        ];
      } else {
        formattedMessages = [{ role: 'user', content: textQuery }];
      }
    } else if (image) {
      const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
      const isArabic = language === 'ar';
      formattedMessages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: isArabic
                ? 'حدد هذا المعلم أو الأثر المصري بدقة، واذكر اسمه وفترته التاريخية وموقعه في مصر وأهم تفاصيله.'
                : 'Identify this Egyptian monument or artifact accurately. State its name, historical period, location in Egypt, and key details.',
            },
            { type: 'image', image: imageUrl },
          ],
        },
      ];
    } else {
      const isArabic = language === 'ar';
      formattedMessages = [
        {
          role: 'user',
          content: isArabic
            ? 'مرحباً! حدثني عن مصر وأجمل الأماكن لزيارتها.'
            : 'Hello! Tell me about Egypt and the best places to visit.',
        },
      ];
    }

    if (hasImage) {
      const vision = await identifyWithVision(formattedMessages, language === 'ar');
      if (vision) return NextResponse.json(vision);
    }

    const textMessages = formattedMessages.map((m) => ({
      role: m.role,
      content:
        typeof m.content === 'string'
          ? m.content
          : (m.content as any[]).filter((p) => p.type === 'text').map((p) => p.text).join('\n'),
    }));

    const lastUserText =
      [...textMessages].reverse().find((m) => m.role === 'user')?.content || '';
    const isArabicQuery = /[\u0600-\u06FF]/.test(String(lastUserText));

    if (isClearlyOutOfScope(String(lastUserText))) {
      const refusal = isArabicQuery ? OUT_OF_SCOPE_AR : OUT_OF_SCOPE_EN;
      if (stream === false) {
        return NextResponse.json({ reply: refusal });
      }
      return new Response(refusal, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const [wikiAndDbContext, weatherContext] = await Promise.all([
      fetchTrustedWikipediaAndRAG(String(lastUserText)),
      isItineraryOrWeatherQuery(String(lastUserText))
        ? fetchEgyptLiveWeather(String(lastUserText))
        : Promise.resolve(''),
    ]);

    let systemPrompt = TEXT_CHAT_SYSTEM_PROMPT;
    if (weatherContext) {
      systemPrompt += `\n\n--- LIVE EGYPT WEATHER ---\n${weatherContext}`;
    }
    if (wikiAndDbContext) {
      systemPrompt += `\n\n--- VERIFIED ENCYCLOPEDIA & WIKIPEDIA RAG CONTEXT ---\n${wikiAndDbContext}`;
    }

    return await streamWithSmartFallback(req, {
      systemPrompt,
      messages: textMessages,
      temperature: 0.1,
      nonStreamingJson: stream === false,
      extraJsonFields: {
        identified_name: 'معلم أثري مصري',
        confidence_level: 'high',
      },
    });
  } catch (error: any) {
    console.error('[AI Guide Route Error]:', error);
    return NextResponse.json(
      { reply: 'مرحباً بك! أنا رفيقك السياحي في مصر، كيف يمكنني مساعدتك في رحلتك اليوم؟' },
      { status: 200 }
    );
  }
}
