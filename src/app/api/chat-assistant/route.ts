import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Format history for the Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are "EgyptX AI", a friendly, knowledgeable Egypt tourism assistant. 
Your goal is to give helpful, realistic, and concise answers (typically 2-4 sentences) about Egyptian destinations, itinerary advice, crowd levels (you can invent plausible crowd status), safety tips, and general travel advice. 
Keep your tone warm and expert, like a knowledgeable local guide. Do not use complex formatting; plain text with occasional emojis is best.`;

    const response = await generateContentWithFallback({
      contents: contents,
      config: {
        systemInstruction,
      }
    });

    const replyText = response.text || "I'm sorry, I couldn't process that request right now.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Chat Assistant API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
