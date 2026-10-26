import { NextResponse } from 'next/server';
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
تجيب على كل ما يتعلق بـ: المعابد المصرية (أبو سمبل، الكرنك، الأقصر، فيلة، حتشبسوت)، الأهرامات، الفراعنة، الآثار، المتاحف المصرية، والحضارة المصرية بجميع عصورها.

قواعد صارمة:
1. أجب بسرعة وبشكل مباشر ومختصر بدون رموز ماركداون.
2. إذا سألك المستخدم عن أي شيء خارج نطاق تاريخ مصر وحضارتها والسياحة فيها، قل فوراً: "${OUT_OF_SCOPE_AR}" (أو بالإنجليزية: "${OUT_OF_SCOPE_EN}").
3. أجب بنفس لغة المستخدم.

${VERIFIED_EGYPT_HERITAGE_KB}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, query, prompt, stream } = body;

    let userQuestion = '';
    if (typeof query === 'string' && query.trim()) {
      userQuestion = query.trim();
    } else if (typeof prompt === 'string' && prompt.trim()) {
      userQuestion = prompt.trim();
    } else if (Array.isArray(messages) && messages.length > 0) {
      const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
      userQuestion = lastUser?.content || '';
    }

    if (!userQuestion) {
      return NextResponse.json({ error: 'User query is required' }, { status: 400 });
    }

    const isArabic = /[\u0600-\u06FF]/.test(userQuestion);
    if (isClearlyOutOfScope(userQuestion)) {
      const refusal = isArabic ? OUT_OF_SCOPE_AR : OUT_OF_SCOPE_EN;
      if (stream === false) {
        return NextResponse.json({ reply: refusal });
      }
      return new Response(refusal, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const wikiContext = await fetchTrustedWikipediaAndRAG(userQuestion);
    const systemPrompt = wikiContext
      ? `${VOICE_SYSTEM_PROMPT}\n\n--- معلومات موثقة إضافية ---\n${wikiContext}`
      : VOICE_SYSTEM_PROMPT;

    return streamWithSmartFallback(req, {
      systemPrompt,
      messages: [{ role: 'user', content: userQuestion }],
      temperature: 0.1,
      maxTokens: 450,
      nonStreamingJson: stream === false,
    });
  } catch {
    return NextResponse.json(
      { reply: 'أهلاً بك! أنا مرشدك الصوتي الذكي في مصر. اسألني عن أي معبد أو أثر مصري!' },
      { status: 200 }
    );
  }
}
