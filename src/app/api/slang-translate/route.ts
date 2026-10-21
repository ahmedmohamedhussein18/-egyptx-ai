import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, mode, sourceLang, targetLang } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const isLocalInput = mode === 'local' || (typeof sourceLang === 'string' && sourceLang.startsWith('ar'));
    const touristLanguageName = targetLang || 'English';

    const systemPrompt = isLocalInput
      ? `You are an expert bilingual cultural bridge between Egyptian locals and visiting international tourists.
The user input is in Egyptian Arabic dialect (اللهجة المصرية) from a local Egyptian.
Translate the phrase naturally into the tourist's language (${touristLanguageName}), and provide clear phonetic guidance and cultural context.

Output MUST be strictly valid raw JSON without markdown or codeblocks:
{"translation": "natural and accurate translation in ${touristLanguageName}", "phonetic": "authentic Egyptian Arabic pronunciation in English Latin letters", "context": "1-2 friendly sentences explaining the Egyptian cultural meaning and warmth of this phrase"}`
      : `You are a native Egyptian linguist and dialect voice coach specializing in authentic Egyptian Arabic (اللهجة المصرية العامية).
Translate the user input to natural, conversational Egyptian colloquial Arabic.

CRITICAL PRONUNCIATION & PHONETIC RULES FOR TTS ENGINES:
1. In the "translation" field, write standard, authentic Egyptian colloquial Arabic (e.g. "إزيك", "عامل إيه", "كده", "فِين", "يلا بينا").
2. DO NOT artificially elongate letters or repeat characters (NEVER write "ازييييك", "اييييه", "ياااا سطا"). Always write the clean native spelling so voice models pronounce whole words fluidly rather than spelling individual letters out loud.
3. Include natural punctuation (. , ? !) to allow the voice synthesis engine to pause naturally and maintain correct Egyptian intonation.
4. In "phonetic", provide an easy-to-read transliteration using English Latin letters (e.g., "Izzayak? 'Amel eh?").
5. In "context", provide 1-2 friendly, culturally rich sentences explaining how and when locals say this.

Output MUST be strictly valid raw JSON without markdown or codeblocks:
{"translation": "clean Egyptian Arabic text", "phonetic": "English phonetic transliteration", "context": "cultural context note"}`;

    const rawResult = await generateContentWithFallback({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      config: { temperature: 0.6, max_tokens: 400 }
    });

    const content = rawResult.choices[0].message.content;

    try {
      // Clean possible markdown code fences if model returned them
      const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned);

      // Clean any accidental letter repetition in translation
      if (parsed.translation && typeof parsed.translation === 'string') {
        parsed.translation = parsed.translation
          .replace(/\u0640+/g, '')
          .replace(/([\u0621-\u064A])\1{2,}/gu, '$1')
          .trim();
      }

      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return NextResponse.json({
        translation: content,
        phonetic: '',
        context: ''
      });
    }

  } catch (error) {
    console.error('Slang translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
