import { NextRequest, NextResponse } from 'next/server';
import { POST as ttsPostHandler } from '@/app/api/tts/route';
import {
  VERIFIED_EGYPT_HERITAGE_KB,
  OUT_OF_SCOPE_AR,
  OUT_OF_SCOPE_EN,
  isClearlyOutOfScope,
  fetchTrustedWikipediaAndRAG,
  streamWithSmartFallback,
} from '@/lib/egypt-rag';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const VOICE_SYSTEM_PROMPT = `أنت مرشد مصري ذكي متخصص حصراً في تاريخ مصر وحضارتها والسياحة المصرية.
تجيب على كل ما يتعلق بـ: المعابد المصرية (مثل معبد أبو سمبل، الكرنك، الأقصر، فيلة، حتشبسوت، إدفو، كوم أمبو)، الأهرامات وأبو الهول، الفراعنة، الآثار، المتاحف المصرية (المتحف المصري الكبير، متحف الحضارة، متحف التحرير)، الحضارة المصرية القديمة واليونانية الرومانية والقبطية والإسلامية والمملوكية والحديثة، والمعالم السياحية في مصر.

قواعد صارمة:
1. أجب بسرعة وبشكل مباشر وطبيعي ومختصر (2 إلى 4 جمل واضحة ومفيدة ومناسبة للنطق الصوتي) بدون مقدمات طويلة أو رموز ماركداون (** أو #).
2. إذا سألك المستخدم عن أي شيء خارج نطاق تاريخ مصر وحضارتها والسياحة فيها (مثل كرة القدم، كأس العالم، السياسة، البرمجة)، قل فوراً: "${OUT_OF_SCOPE_AR}" (أو بالإنجليزية إذا سأل بالإنجليزية: "${OUT_OF_SCOPE_EN}").
3. أجب بنفس لغة المستخدم — عربي بعربي، إنجليزي بإنجليزي، فرنسي بفرنسي.
4. اعتمد على قاعدة البيانات الموثقة التالية ولا تقل أبداً أنه لا تتوفر لديك معلومات عن أي معبد أو أثر مصري:

${VERIFIED_EGYPT_HERITAGE_KB}`;

export async function POST(req: NextRequest) {
  try {
    const clonedReq = req.clone();
    const body = await req.json();

    // 1. If called as a TTS audio synthesis endpoint ({ text, voiceId })
    if (body.text && !body.messages && !body.query) {
      return ttsPostHandler(clonedReq as NextRequest);
    }

    const { messages, query, prompt, context, stream } = body;

    let userMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      userMessages = messages
        .filter((m: any) => m.role !== 'system')
        .slice(-6)
        .map((m: any) => ({
          role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        }));
    } else {
      const q = query || prompt || 'حدثني عن معبد أبو سمبل وتاريخ مصر القديمة.';
      userMessages = [{ role: 'user', content: q }];
    }

    const lastUserText = userMessages[userMessages.length - 1]?.content || '';
    const isArabic = /[\u0600-\u06FF]/.test(lastUserText);

    if (isClearlyOutOfScope(lastUserText)) {
      const refusal = isArabic ? OUT_OF_SCOPE_AR : OUT_OF_SCOPE_EN;
      if (stream === false) {
        return NextResponse.json({ reply: refusal });
      }
      return new Response(refusal, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const wikiContext = await fetchTrustedWikipediaAndRAG(lastUserText);

    let systemPrompt = VOICE_SYSTEM_PROMPT;
    if (context?.identified_name && context.identified_name !== 'Egyptian Heritage Monument') {
      systemPrompt += `\n\nالمعلم المعروض حالياً أمام الكاميرا: "${context.identified_name}". ${
        context.ai_description || ''
      }`;
    }
    if (wikiContext) {
      systemPrompt += `\n\n--- معلومات موثقة إضافية (ويكيبيديا / قاعدة البيانات) ---\n${wikiContext}`;
    }

    return streamWithSmartFallback(req, {
      systemPrompt,
      messages: userMessages,
      temperature: 0.3,
      maxTokens: 450,
      nonStreamingJson: stream === false,
    });
  } catch {
    return NextResponse.json(
      {
        reply:
          'معبد أبو سمبل في أسوان بناه الملك رمسيس الثاني حوالي عام 1264 قبل الميلاد، ويشتهر بتماثيله الأربعة الضخمة وظاهرة تعامد الشمس على قدس الأقداس مرتين سنوياً.',
      },
      { status: 200 }
    );
  }
}
