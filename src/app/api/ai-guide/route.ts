import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

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

const SYSTEM_PROMPT = `You are an expert Egyptian historian, archaeologist, and AI tour guide with deep knowledge of Egyptian heritage.

${VERIFIED_FACTS}

If the requested information is not in the hardcoded facts, you MUST call the search tool to verify it. NEVER guess or hallucinate. Your final response MUST be in conversational Arabic.
NEVER use Markdown formatting. Do not use asterisks (**), hashes (#), or bullet symbols. Output 100% clean, conversational plain text.

STRICT GUIDELINES:
1. Always base your historical statements strictly on verified sources or verified search results.
2. If asked about the Grand Egyptian Museum (المتحف المصري الكبير), its official opening date is November 1, 2025.
3. NEVER leak internal tool-calling tags, parameter blocks, JSON calls, or technical tags to the user. Present only clean, conversational Arabic.
4. NEVER use Markdown formatting. Do not use asterisks (**), hashes (#), or bullet symbols. Output 100% clean, conversational plain text.`;

/**
 * Free Web Search Tool using Arabic/English Wikipedia and DuckDuckGo Instant Answers.
 * 100% free with strict error handling and timeouts to prevent hanging.
 */
function createFreeSearchTool() {
  return tool({
    description: 'Search the web for free using Wikipedia and DuckDuckGo for factual, verified historical information about Egyptian monuments, sites, pharaohs, and archaeology.',
    parameters: z.object({
      query: z.string().describe('The historical or archaeological query to look up'),
    }),
    execute: async ({ query }: { query: string }) => {
      try {
        if (!query || typeof query !== 'string' || !query.trim()) {
          return 'لم يتم تقديم استعلام بحث. يرجى الاعتماد على الحقائق التاريخية المؤكدة.';
        }

        const trimmedQuery = query.trim().slice(0, 100);
        const results: string[] = [];

        // 1. Search Arabic Wikipedia (2.5s timeout)
        try {
          const arSearchUrl = `https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(trimmedQuery)}&utf8=&format=json&origin=*`;
          const arRes = await fetch(arSearchUrl, {
            headers: { 'User-Agent': 'EgyptX-AI/1.0 (info@egyptx.ai)' },
            signal: AbortSignal.timeout(2500),
          });
          if (arRes.ok) {
            const data = await arRes.json();
            const items = data.query?.search?.slice(0, 2) || [];
            for (const item of items) {
              const cleanSnippet = (item.snippet || '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              if (cleanSnippet) {
                results.push(`[ويكيبيديا العربية: ${item.title}]: ${cleanSnippet}`);
              }
            }
          }
        } catch (err) {
          console.warn('[Search Tool] Wikipedia AR error caught:', err);
        }

        // 2. Search DuckDuckGo Instant Answer (2.5s timeout)
        try {
          const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(trimmedQuery)}&format=json&no_html=1&skip_disambig=1`;
          const ddgRes = await fetch(ddgUrl, {
            signal: AbortSignal.timeout(2500),
          });
          if (ddgRes.ok) {
            const ddgData = await ddgRes.json();
            if (ddgData.AbstractText) {
              results.push(`[DuckDuckGo: ${ddgData.Heading || trimmedQuery}]: ${ddgData.AbstractText}`);
            }
          }
        } catch (err) {
          console.warn('[Search Tool] DuckDuckGo error caught:', err);
        }

        if (results.length > 0) {
          return results.join('\n\n');
        }

        return 'لم يتم العثور على معلومات إضافية في البحث اللحظي. التزم بالحقائق التاريخية الموثقة المتاحة.';
      } catch (error: any) {
        console.error('[Search Tool] Safe error caught:', error);
        return 'تعذر إتمام البحث اللحظي. التزم فقط بالحقائق التاريخية الموثقة.';
      }
    },
  });
}

export async function POST(req: Request) {
  try {
    const groqKey = process.env.GROQ_API_KEY || (process.env as any)['\uFEFFGROQ_API_KEY'];
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!groqKey && !openaiKey) {
      return NextResponse.json({ error: 'AI API key is not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { messages, prompt, question, image, stream } = body;

    const openai = groqKey
      ? createOpenAI({
          baseURL: 'https://api.groq.com/openai/v1',
          apiKey: groqKey,
          compatibility: 'compatible',
        })
      : createOpenAI({ apiKey: openaiKey });

    const hasImage = Boolean(image);
    const modelName = groqKey
      ? hasImage
        ? 'qwen/qwen3.8-27b'
        : 'openai/gpt-oss-120b'
      : 'gpt-4o-mini';

    // Format messages for streamText
    let formattedMessages: Array<{ role: 'user' | 'assistant'; content: string | any[] }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      formattedMessages = messages.map((m: any) => ({
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
      formattedMessages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'حدد هذا المعلم أو الأثر المصري بدقة، واذكر اسمه وفترته التاريخية وموقعه في مصر وأهم تفاصيله الموثقة باللغة العربية المحادثية.',
            },
            { type: 'image', image: imageUrl },
          ],
        },
      ];
    } else {
      formattedMessages = [{ role: 'user', content: 'حدثني عن أهم المعالم الأثرية في مصر.' }];
    }

    const result = streamText({
      model: openai(modelName),
      system: SYSTEM_PROMPT,
      messages: formattedMessages as any,
      tools: hasImage
        ? undefined
        : {
            searchWeb: createFreeSearchTool(),
          },
      maxSteps: 5,
      temperature: 0.0,
    });

    const acceptHeader = req.headers.get('accept') || '';
    const isDataStream = req.headers.get('x-vercel-ai-data-stream') === 'v1' || acceptHeader.includes('text/event-stream');
    const isNonStreamingJson = stream === false || acceptHeader === 'application/json';

    if (isNonStreamingJson) {
      const fullText = await result.text;
      return NextResponse.json({
        identified_name: 'معلم أثري مصري',
        confidence_level: 'high',
        ai_description: fullText,
        reply: fullText,
      });
    }

    if (isDataStream) {
      return result.toDataStreamResponse();
    }

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('[AI Guide Route Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process AI guide request' },
      { status: 500 }
    );
  }
}
