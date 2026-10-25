import { NextResponse } from 'next/server';
import { createUniversalChatCompletion } from '@/lib/ai-client';
import egyptNews from '@/data/egypt-news';

async function fetchLiveNewsData(): Promise<string> {
  const apiKey = process.env.NEWS_API_KEY;
  const blocks: string[] = [];

  if (apiKey) {
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        'Egypt tourism OR New Capital'
      )}&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.articles) && data.articles.length > 0) {
          const formatted = data.articles.slice(0, 5).map((a: any) => {
            const dateStr = a.publishedAt ? ` (${a.publishedAt.split('T')[0]})` : '';
            const source = a.source?.name ? ` [${a.source.name}]` : '';
            return `- ${a.title}${source}${dateStr}: ${a.description || a.content || ''}`;
          });
          blocks.push(`[LIVE NEWS WIRE]:\n${formatted.join('\n')}`);
        }
      }
    } catch (err) {
      console.warn('[News Assistant] NewsAPI fetch warning:', err);
    }
  }

  if (egyptNews && egyptNews.length > 0) {
    const curated = egyptNews
      .slice(0, 3)
      .map((n) => `- ${n.title} (${n.date}): ${n.description}`)
      .join('\n');
    blocks.push(`[CURATED NATIONAL DEVELOPMENTS]:\n${curated}`);
  }

  return blocks.join('\n\n');
}

const SYSTEM_PROMPT = `You are the EgyptX Live News Reporter. Use the injected real-time news data to deliver accurate, concise summaries regarding Egypt's latest events, tourism developments, and national mega-projects. Never hallucinate or guess. If the user asks about the opening date of the Grand Egyptian Museum (المتحف المصري الكبير), you MUST strictly state that the official full opening date is November 1, 2025. NEVER invent or mention dates like February 16, 2023.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, query } = body;

    let userMessage = '';
    if (Array.isArray(messages) && messages.length > 0) {
      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      userMessage = lastUser?.content || '';
    } else if (typeof query === 'string') {
      userMessage = query;
    }

    if (!userMessage || !userMessage.trim()) {
      return NextResponse.json({ error: 'User message is required' }, { status: 400 });
    }

    const liveNews = await fetchLiveNewsData();
    const fullSystemInstruction = `${SYSTEM_PROMPT}\n\n--- INJECTED REAL-TIME NEWS (NewsAPI) ---\n${liveNews}`;

    const formattedMessages = [
      { role: 'system' as const, content: fullSystemInstruction },
      ...(Array.isArray(messages)
        ? messages.map((m: any) => ({
            role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
            content: m.content,
          }))
        : [{ role: 'user' as const, content: userMessage }]),
    ];

    const reply = await createUniversalChatCompletion({
      model: 'openai/gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.0,
      max_tokens: 1000,
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('News Assistant API Error:', error);
    return NextResponse.json(
      { reply: 'Unable to retrieve verified daily news at this moment. Please check back shortly.' },
      { status: 200 }
    );
  }
}
