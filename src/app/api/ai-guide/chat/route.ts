import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const { identified_name, ai_description, db_match } = context;

    let groundingContext = `You are an expert, verified Egyptian heritage AI assistant. You are currently chatting with a tourist who is looking at a photo they just took of: "${identified_name}".
Here is the baseline identification description: ${ai_description}
`;

    if (db_match) {
      groundingContext += `\nVerified DB Details: Name: ${db_match.name_en} (${db_match.name_ar}), City: ${db_match.city}, Category: ${db_match.category}.\n`;
    }

    const fallbackMessage = "I don't have enough verified information to answer this accurately.";

    groundingContext += `
CRITICAL INSTRUCTIONS:
1. You must answer their questions strictly based on verified historical facts about this specific place/artifact.
2. If the user asks a question you do not have reliable, documented historical facts to answer, you MUST respond exactly with: "${fallbackMessage}"
3. Do NOT fabricate dates, figures, stories, or historical events.
4. If the user tries to chat about unrelated topics, politely steer them back to the artifact/monument.
5. Provide your answers in English unless the user explicitly speaks in another language. Maintain a premium, professional, and welcoming tone.`;

    const groqMessages = [
      { role: 'system', content: groundingContext },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    const response = await generateContentWithFallback({
      messages: groqMessages,
      config: {
        temperature: 0.2, 
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
