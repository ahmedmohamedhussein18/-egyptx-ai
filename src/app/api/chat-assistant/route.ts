import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Check if the user is asking about expenses
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';
    
    let expenseContext = '';
    if (lastUserMessage.includes('expense') || lastUserMessage.includes('spend') || lastUserMessage.includes('cost') || lastUserMessage.includes('money')) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: expenses } = await supabase.from('trip_expenses').select('*').eq('user_id', user.id);
        if (expenses && expenses.length > 0) {
          const totalEGP = expenses.filter(e => e.currency === 'EGP').reduce((sum, e) => sum + Number(e.amount), 0);
          const totalUSD = expenses.filter(e => e.currency === 'USD').reduce((sum, e) => sum + Number(e.amount), 0);
          const totalEUR = expenses.filter(e => e.currency === 'EUR').reduce((sum, e) => sum + Number(e.amount), 0);
          const totalGBP = expenses.filter(e => e.currency === 'GBP').reduce((sum, e) => sum + Number(e.amount), 0);
          
          let summaries = [];
          if (totalEGP > 0) summaries.push(`${totalEGP.toLocaleString()} EGP`);
          if (totalUSD > 0) summaries.push(`${totalUSD.toLocaleString()} USD`);
          if (totalEUR > 0) summaries.push(`${totalEUR.toLocaleString()} EUR`);
          if (totalGBP > 0) summaries.push(`${totalGBP.toLocaleString()} GBP`);
          
          expenseContext = `[SYSTEM CONTEXT: The user has recorded expenses. Totals: ${summaries.join(', ')}. Provide this exact info if they ask about their spending. Answer warmly but factually.]\n\n`;
        } else {
          expenseContext = `[SYSTEM CONTEXT: The user asks about spending, but they have 0 expenses recorded in their trip_expenses table yet. Tell them to start tracking their expenses on the Trip Expenses page.]\n\n`;
        }
      } else {
        expenseContext = `[SYSTEM CONTEXT: The user asks about spending, but is not logged in. Tell them they need to log in to track expenses.]\n\n`;
      }
    }

    const systemInstruction = `You are "EgyptX AI", a friendly, knowledgeable Egypt tourism assistant. 
Your goal is to give helpful, realistic, and concise answers (typically 2-4 sentences) about Egyptian destinations, itinerary advice, crowd levels (you can invent plausible crowd status), safety tips, and general travel advice. 
Keep your tone warm and expert, like a knowledgeable local guide. Do not use complex formatting; plain text with occasional emojis is best.`;

    const groqMessages = [
      { role: 'system', content: systemInstruction + "\n\n" + expenseContext },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    const response = await generateContentWithFallback({
      messages: groqMessages,
      config: {
        temperature: 0.7,
        max_tokens: 1024,
      }
    });

    const replyText = response?.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request right now.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Chat Assistant API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
