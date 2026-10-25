import { NextResponse } from 'next/server';
import { analyzeImageGrounded } from '@/lib/groundedGuide';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const uncertainRecord = (lang: string) => ({
  transliteration: lang === 'ar' ? 'لم أتمكن من التعرف بدقة' : 'Could not identify accurately',
  englishTranslation: 'Could not accurately identify the inscription or monument.',
  arabicExplanation:
    lang === 'ar'
      ? 'لم أتمكن من التعرف بدقة على هذا المعلم أو النقش، أو لا تتوفر مصادر موثقة كافية حالياً. يرجى التقاط صورة أوضح أو بزاوية مباشرة.'
      : 'Could not accurately identify this monument or inscription, or no verified sources are currently available. Please capture a clearer photo or a direct angle.',
  context: {
    personOrKing: lang === 'ar' ? 'غير محدد' : 'Unspecified',
    era: lang === 'ar' ? 'غير مؤكد' : 'Uncertain',
    temple: lang === 'ar' ? 'غير محدد' : 'Unspecified',
    meaning:
      lang === 'ar'
        ? 'لا يمكن التحقق الأثري القطعي.'
        : 'Definitive archaeological verification is not possible.',
  },
  metadata: { confidence: '0%', source: 'Strict Factual Verification' },
});

export async function POST(req: Request) {
  let language = 'en';
  try {
    const { image, prompt, language: reqLang } = await req.json();
    if (reqLang) language = reqLang;

    if (!image) {
      return NextResponse.json({ error: 'No image payload provided' }, { status: 400 });
    }

    const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
    const result = await analyzeImageGrounded(imageUrl, language, prompt);

    if (result.status !== 'ok' || !result.data || !result.identity) {
      return NextResponse.json(uncertainRecord(language));
    }

    const { data, identity, sources } = result;
    const pct = { high: '95%', medium: '75%', low: '50%' }[data.confidence];

    return NextResponse.json({
      transliteration: language === 'ar' ? identity.name_ar || data.identified_name : identity.name_en || data.identified_name,
      englishTranslation: identity.name_en || data.identified_name,
      arabicExplanation: data.description,
      context: {
        personOrKing: data.person_or_king,
        era: data.era,
        temple: data.location,
        meaning: data.meaning,
      },
      metadata: {
        confidence: pct,
        source: result.verified ? 'EgyptX Verified Database + Live Web Search' : 'Live Web Search',
      },
      sources,
    });
  } catch (error: any) {
    console.error('[Analyze Vision Route Exception]:', error?.message || 'error');
    return NextResponse.json(uncertainRecord(language));
  }
}
