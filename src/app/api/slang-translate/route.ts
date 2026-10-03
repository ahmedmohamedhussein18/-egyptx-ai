import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert in Egyptian Arabic dialect (اللهجة المصرية). Translate the input to authentic Egyptian colloquial Arabic with exactly this JSON format (no markdown, raw JSON only): {"translation": "the Egyptian Arabic text", "phonetic": "pronunciation in English letters", "context": "a short fun cultural context note in 1-2 sentences"}`;

    const rawResult = await generateContentWithFallback({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      config: { temperature: 0.7, max_tokens: 400 }
    });

    const content = rawResult.choices[0].message.content;

    try {
      const parsed = JSON.parse(content);
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
