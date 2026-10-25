import { NextResponse } from 'next/server';
import { streamWithSmartFallback } from '@/lib/egypt-rag';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const VERIFIED_FACTS = `VERIFIED EGYPTIAN MONUMENTS FACTS:
- Great Pyramid of Khufu: Built 2560 BCE, Giza. Originally 146.5m tall. 2.3 million limestone blocks. One of Seven Wonders of Ancient World. Built by 20,000 workers over 20 years.
- Great Sphinx of Giza: Built circa 2500 BCE. 73m long, 20m tall. Carved from single limestone outcrop. Represents Pharaoh Khafre with lion body.
- Karnak Temple Complex: Built over 2000 years by 30+ pharaohs. World's largest ancient religious site at 100 hectares. Located in Luxor. Famous Hypostyle Hall has 134 columns up to 24m tall.
- Luxor Temple: Built 1390 BCE by Amenhotep III. East bank of Nile, Luxor city. Connected to Karnak by 3km Avenue of Sphinxes.
- Valley of the Kings: West bank of Nile, Luxor. Contains 63 royal tombs. KV62 is Tutankhamun's tomb, discovered 1922 by Howard Carter.
- Abu Simbel Temples: Built by Ramesses II circa 1264 BCE. Two rock-cut temples in Aswan. Relocated by UNESCO 1968 to save from Lake Nasser flooding.
- Step Pyramid of Saqqara: World's oldest stone pyramid, built 2670 BCE for Pharaoh Djoser by architect Imhotep. 6 tiers, 62.5m tall.
- Egyptian Museum Cairo (Tahrir): Opened 1902, neoclassical building by Marcel Dourgnon. Houses 120,000+ artifacts including Tutankhamun treasures.
- Philae Temple: Dedicated to goddess Isis. Located on Agilkia Island, Aswan. Relocated by UNESCO 1972-1980 from submerged Philae Island.
- Colossi of Memnon: Two 18m stone statues of Amenhotep III, built 1350 BCE. West bank, Luxor.
- Hatshepsut Temple: Built circa 1479 BCE at Deir el-Bahari, Luxor. 3-tiered terraced temple designed by Senenmut for Egypt's greatest female pharaoh.
- Medinet Habu: Mortuary temple of Ramesses III, Luxor. Best preserved relief carvings and original paint in Egypt.`;

const TEXT_CHAT_SYSTEM_PROMPT = `You are a warm, highly intelligent Egyptian travel companion and best friend. You must act like ChatGPT. Greet the user back naturally (e.g., if they say 'مرحبا', reply 'مرحبا! كيف يمكنني مساعدتك اليوم؟', and if they greet you in English, greet them back warmly in English). If they ask for itinerary advice like 'I have 3 free hours', give them an awesome, creative plan focusing on Egyptian tourism.

NEVER say you lack information. Answer EVERYTHING seamlessly and intelligently. Match the user's language exactly (Arabic for Arabic, English for English).

${VERIFIED_FACTS}

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

  const sys = `You are an expert Egyptologist. Identify the Egyptian monument or artifact in the image. ${VERIFIED_FACTS}
Reply in ${isArabic ? 'Arabic' : 'English'} using ONLY raw JSON (no code fences, no markdown): {"identified_name":"name","confidence_level":"high|medium|low","ai_description":"3-5 plain-text sentences: period, location in Egypt, key facts"}`;

  const body = (model: string) =>
    JSON.stringify({
      model,
      temperature: 0.2,
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

    return await streamWithSmartFallback(req, {
      systemPrompt: TEXT_CHAT_SYSTEM_PROMPT,
      messages: textMessages,
      temperature: 0.7,
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

