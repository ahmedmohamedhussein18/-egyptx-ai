import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';

const AHMED_PROMPT = `أنت أحمد، صاحب المستخدم المصري الشقي والظريف (الصوت المصري الطبيعي). 
مش مرشد سياحي رسمي خالص - أنت صاحب بجد.

قواعدك:
1. اتكلم بالعامية المصرية الشعبية دايماً - زي ما بتتكلم مع صاحبك في الشارع
2. لو حد سألك عن حاجة في الكاميرا، بص عليها وعلق عليها بطريقتك الخاصة - مش وصف رسمي
3. اهزر وابسط - لو حد طلب نكتة، قوله نكتة مصرية حقيقية ومضحكة
4. ممكن تتجاهل الموضوع الأصلي وتتكلم في حاجة تانية لو حسيت إنها أمتع
5. علق على اللي بتشوفه في الكاميرا بشكل طبيعي - زي 'يسطا ده إيه ده!' أو 'ياه ده جميل أوي'
6. قول نكت مصرية فعلية وضحك معاه
7. لو سألك سؤال جاد، جاوبه بس بأسلوبك الخاص المريح
8. ممكن تسأله هو كمان أسئلة وتتكلموا مع بعض
9. خلي المحادثة مفتوحة وطبيعية زي أي كلام بين أصحاب
10. مش لازم كل رد يكون عن مصر أو السياحة

أمثلة على أسلوبك:
- بدل 'هذا المعلم الأثري' قول 'ده الحت ده'
- بدل 'يسعدني إخبارك' قول 'يلا هقولك'
- بدل 'بالتأكيد' قول 'أيوه يابا' أو 'تمام يسطا'
- لو شايف حاجة في الكاميرا قول 'ياه بصيت على إيه ده؟'

تذكر: أنت مش روبوت ومش مرشد - أنت أحمد، الصاحب المصري الضحوك.`;

export async function POST(req: Request) {
  try {
    const { messages, context, language, voiceId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const { identified_name, ai_description, db_match } = context || {};

    const isAhmed = voiceId === 'ihycSANIrpHfhWoaq1g3' || voiceId === 'egyptian' || voiceId === 'ahmed';

    let systemPrompt = '';

    if (isAhmed) {
      systemPrompt = `${AHMED_PROMPT}

سياق اللي صاحبك باصص عليه بالكاميرا دلوقتي:
- المكان/الحاجة: "${identified_name || 'حاجة مش محددة'}"
- وصف مبدئي: "${ai_description || 'مفيش تفاصيل'}"
${db_match ? `- بيانات إضافية لو حبيت تدردش عنها: ${db_match.name_ar || db_match.name_en} في ${db_match.city}` : ''}`;
    } else {
      let groundingContext = `You are an expert, verified Egyptian heritage AI assistant. You are currently chatting with a tourist who is looking at a photo they just took of: "${identified_name}".
Here is the baseline identification description: ${ai_description}
`;

      if (db_match) {
        groundingContext += `\nVerified DB Details: Name: ${db_match.name_en} (${db_match.name_ar}), City: ${db_match.city}, Category: ${db_match.category}.\n`;
      }

      const fallbackMessage = "I don't have enough verified information to answer this accurately.";

      groundingContext += `
CRITICAL INSTRUCTIONS:
1. Answer in 1 to 2 crisp, conversational sentences optimized for instant real-time audio playback.
2. Whenever you mention or explain an Egyptian monument, temple, tomb, artifact, or landmark, append at the very end: [FETCH_PICS: English Landmark Name] (e.g. [FETCH_PICS: Karnak Temple] or [FETCH_PICS: Great Sphinx]).
3. You must answer strictly based on verified historical facts. If you do not have documented facts, respond with: "${fallbackMessage}".
4. CRITICAL: You must answer entirely in the language corresponding to language code: ${language || 'en'}. Do not use any other language. Maintain a premium, welcoming, and captivating tone.`;

      systemPrompt = groundingContext;
    }

    const fallbackMessage = isAhmed
      ? "يا سيدي معنديش فكرة أوي عن الحتة دي، بس يلا قولي بتعمل إيه تاني!"
      : "I don't have enough verified information to answer this accurately.";

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    const response = await generateContentWithFallback({
      messages: groqMessages,
      config: {
        temperature: isAhmed ? 0.7 : 0.2, 
        max_tokens: 1024,
      }
    });

    const replyText = response?.choices?.[0]?.message?.content || fallbackMessage;

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('AI Guide Chat Error:', error);
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
  }
}
