import { NextResponse } from 'next/server';
import { getOpenRouterClient, getOpenAIClient, getGroqClient } from '@/lib/ai-client';

const STRICT_VISION_SYSTEM_PROMPT = `You are an expert Egyptologist analyzing web uploads. 1) OCR: Read any Arabic text in the image first. If it explicitly says 'المتحف المصري الكبير', you MUST identify it as the Grand Egyptian Museum. 2) Never output 'قصر محمد علي باشا' unless the architecture explicitly matches it. 3) If the user asks about the opening date of the Grand Egyptian Museum (المتحف المصري الكبير), you MUST strictly answer that the official full opening date is November 1, 2025. NEVER output or invent dates like February 16, 2023. 4) If uncertain, strictly return 'لم أتمكن من التعرف بدقة'.`;

/**
 * Route: /api/vision
 * Analyzes artifacts, monuments, and Egyptian heritage with strict 0.0 temperature
 * and verified factual constraints.
 */
export async function POST(req: Request) {
  try {
    const { image, prompt, language } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
    const userPrompt = prompt || 'Identify this Egyptian landmark or artifact and explain its significance in verified detail.';

    const lang = language || 'en';
    const languageInstruction = `You MUST generate your entire response strictly in this language: ${lang}. If the requested language is 'en', output completely in English. If 'ar', output in Arabic.`;

    const systemInstruction = `${STRICT_VISION_SYSTEM_PROMPT} ${languageInstruction} If uncertain, reply ONLY with: "${lang === 'en' ? 'Could not identify accurately' : 'لم أتمكن من التعرف بدقة'}".`;

    const messages = [
      {
        role: 'system' as const,
        content: systemInstruction,
      },
      {
        role: 'user' as const,
        content: [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        ],
      },
    ];

    let replyText = '';

    // 1. Primary: OpenRouter gpt-4o-mini with Vision (temperature: 0.0)
    const openRouter = getOpenRouterClient();
    if (openRouter) {
      try {
        const response = await openRouter.chat.completions.create({
          model: 'openai/gpt-4o-mini',
          messages: messages as any,
          max_tokens: 800,
          temperature: 0.0,
        });
        replyText = response.choices?.[0]?.message?.content || '';
      } catch (orErr: any) {
        console.warn('[Vision API] OpenRouter vision failed, falling back:', orErr?.message || orErr);
      }
    }

    // 2. OpenAI Direct (temperature: 0.0)
    if (!replyText) {
      const openAi = getOpenAIClient();
      if (openAi) {
        try {
          const response = await openAi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages as any,
            max_tokens: 800,
            temperature: 0.0,
          });
          replyText = response.choices?.[0]?.message?.content || '';
        } catch (oaErr: any) {
          console.warn('[Vision API] OpenAI direct vision failed:', oaErr?.message || oaErr);
        }
      }
    }

    // 3. Fallback: Groq Qwen Vision (temperature: 0.0)
    if (!replyText) {
      const groq = getGroqClient();
      if (groq) {
        try {
          const response = await groq.chat.completions.create({
            model: 'qwen/qwen3.8-27b',
            messages: messages as any,
            max_tokens: 800,
            temperature: 0.0,
          });
          replyText = response.choices?.[0]?.message?.content || '';
        } catch (groqErr: any) {
          console.error('[Vision API] Groq vision error:', groqErr?.message || groqErr);
        }
      }
    }

    if (!replyText || replyText.includes('لم أتمكن من التعرف بدقة')) {
      replyText = 'لم أتمكن من التعرف بدقة على هذا الأثر أو المعلم من خلال الصورة المرفقة.';
    }

    return NextResponse.json({ reply: replyText, result: replyText });
  } catch (error: any) {
    console.error('[Vision API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process vision query' },
      { status: 500 }
    );
  }
}
