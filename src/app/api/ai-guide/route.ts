import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    const supabase = await createClient();
    
    const { image, language, voiceId } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key missing' }, { status: 500 });
    }

    console.log(`[AI Guide] Using Groq API Key starting with: ${apiKey.substring(0, 8)}...`);

    // Make sure we have the full data URL to send to Groq
    const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

    const { default: Groq } = await import('groq-sdk');
    const groq = new Groq({ apiKey });
    
    let aiResponseStr = null;

    try {
      console.log(`[AI Guide] Trying model: qwen/qwen3.8-27b`);
      
      const isAhmed = voiceId === 'ihycSANIrpHfhWoaq1g3' || voiceId === 'egyptian' || voiceId === 'ahmed';

      const promptText = isAhmed
        ? `${AHMED_PROMPT}

بص في الصورة وعلق عليها بطريقتك كصاحب مصري دمك خفيف.
لازم ترد بـ JSON فقط بالصيغة دي بالظبط:
{
  "identified_name": "اسم الحاجة أو المكان اللي شايفه (أو وصف عام لو مش أثر معروف)",
  "confidence_level": "high" | "medium" | "low" | "unable",
  "ai_description": "تعليقك المصري الشقي اللطيف والدردشة العفوية عن اللي شايفه في الصورة (جملتين أو 3)"
}`
        : `You are an expert Egyptian heritage guide. Identify this monument, artifact, or landmark. Provide: name, historical period, location in Egypt, and a brief 2-3 sentence description. If you cannot identify it with confidence, say so honestly. Never invent information.${language && language !== 'en' ? ` Provide identified_name and ai_description in the language code: "${language}".` : ''}\n\nYou must respond ONLY with a valid JSON object matching this schema exactly:\n{\n  "identified_name": "The exact name of the monument/artifact (or empty string if unable)",\n  "confidence_level": "high" | "medium" | "low" | "unable",\n  "ai_description": "A 2-3 sentence accurate description. If unable to identify, provide a helpful message here explaining why."\n}`;

      const response = await groq.chat.completions.create({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              },
              {
                type: 'text',
                text: promptText
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        temperature: isAhmed ? 0.7 : 0.2
      });

      aiResponseStr = response.choices[0]?.message?.content;
      console.log(`[AI Guide] Success with Groq model`);
      
    } catch (error: any) {
      console.error(`[AI Guide] Groq model failed:`, error.message);
      throw new Error(`Groq Vision model failed: ${error.message}`);
    }

    if (!aiResponseStr) {
      throw new Error(`Groq Vision model returned empty response.`);
    }

    // Clean up potential markdown wrapper from text output
    const cleanedStr = aiResponseStr.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse the JSON. If the model fails to output valid JSON, it will naturally fall to catch block
    const parsedResponse = JSON.parse(cleanedStr);
    
    let dbMatch = null;
    if (parsedResponse.confidence_level !== 'unable' && parsedResponse.identified_name) {
      // Search in our verified attractions table
      // Try an exact/full phrase match first
      let { data: dbData } = await supabase
        .from('attractions')
        .select('*')
        .eq('verified', true)
        .ilike('name_en', `%${parsedResponse.identified_name}%`)
        .limit(1);
        
      if (!dbData || dbData.length === 0) {
        // Fallback: search by significant keyword (ignoring 'the', 'a', etc)
        const words = parsedResponse.identified_name.split(' ').filter((w: string) => !['the', 'a', 'an', 'of'].includes(w.toLowerCase()));
        if (words.length > 0) {
          const searchName = words[0]; 
          const { data: fallbackData } = await supabase
            .from('attractions')
            .select('*')
            .eq('verified', true)
            .ilike('name_en', `%${searchName}%`)
            .limit(1);
          dbData = fallbackData;
        }
      }
        
      if (dbData && dbData.length > 0) {
        dbMatch = dbData[0];
      }
    }

    return NextResponse.json({
      ...parsedResponse,
      db_match: dbMatch
    });

  } catch (error: any) {
    console.error('AI Guide Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze image' }, { status: 500 });
  }
}
