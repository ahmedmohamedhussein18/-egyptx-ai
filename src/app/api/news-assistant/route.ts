import { NextResponse } from 'next/server';
import egyptNews from '@/data/egypt-news';

interface NewsItem {
  title: string;
  source: string;
  date: string;
  link: string;
}

const isArabicText = (s: string) => /[\u0600-\u06FF]/.test(s);

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? decodeEntities(m[1]) : '';
}

const GENERIC_NEWS = /أخبار|اخبار|الأخبار|الاخبار|أحدث|احدث|اليوم|news|latest|today|headlines|breaking/i;

function buildFeedUrl(query: string, arabic: boolean): string {
  const cleaned = query
    .replace(/[؟?!.،,]/g, ' ')
    .replace(/ما هي|ما هى|ايه|إيه|هي|أخبار|اخبار|الأخبار|الاخبار|أحدث|احدث|اليوم|what is|what are|the|latest|news|today|tell me|about/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  if (arabic) {
    const q = cleaned ? `${cleaned} مصر` : 'Egypt OR مصر';
    return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ar&gl=EG&ceid=EG:ar`;
  }
  const q = cleaned ? `${cleaned} Egypt` : 'Egypt tourism monuments news';
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
}

async function fetchRss(url: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EgyptXNews/1.0)' },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
    return items.slice(0, 8).map((it) => {
      let title = pick(it, 'title');
      let source = pick(it, 'source');
      const idx = title.lastIndexOf(' - ');
      if (idx > 0) {
        if (!source) source = title.slice(idx + 3);
        title = title.slice(0, idx);
      }
      const pub = pick(it, 'pubDate');
      let date = pub;
      const d = new Date(pub);
      if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0];
      return { title, source: source || 'Google News', date, link: pick(it, 'link') };
    }).filter((n) => n.title);
  } catch {
    return [];
  }
}

async function fetchNews(query: string, arabic: boolean): Promise<NewsItem[]> {
  const primary = await fetchRss(buildFeedUrl(query, arabic));
  if (primary.length > 0) return primary;
  const fallbackUrl = arabic
    ? 'https://news.google.com/rss/search?q=Egypt+tourism+monuments+news&hl=en-US&gl=US&ceid=US:en'
    : 'https://news.google.com/rss/search?q=Egypt+OR+%D9%85%D8%B5%D8%B1&hl=ar&gl=EG&ceid=EG:ar';
  return fetchRss(fallbackUrl);
}

function formatItems(items: NewsItem[], arabic: boolean): string {
  return items
    .map((n, i) =>
      arabic
        ? `${i + 1}. ${n.title}\nالمصدر: ${n.source}\nالتاريخ: ${n.date}`
        : `${i + 1}. ${n.title}\nSource: ${n.source}\nDate: ${n.date}`
    )
    .join('\n\n');
}

function buildSystemPrompt(arabic: boolean, today: string, context: string): string {
  return `Act as a lightning-fast, highly accurate news wire. Today's date is ${today}. Use ONLY the LIVE NEWS FEED below (real Google News Egypt headlines) plus well-known verified facts. Output only verified, factual news concisely. For EACH news item state the source name (${arabic ? 'المصدر' : 'Source'}) and date (${arabic ? 'التاريخ' : 'Date'}). NEVER hallucinate and never invent items not in the feed. Do not use Markdown symbols (no asterisks or hashes); use plain text with line breaks.

CRITICAL RULE: You MUST answer in the EXACT SAME LANGUAGE as the user's prompt. If the user speaks English, reply in English. If Arabic, reply in Arabic.

If the user asks about the opening date of the Grand Egyptian Museum (المتحف المصري الكبير), state that the official full opening date is November 1, 2025.

--- LIVE NEWS FEED ---
${context}`;
}

type Msg = { role: 'system' | 'user' | 'assistant'; content: string };

async function callChat(
  url: string,
  key: string,
  model: string,
  messages: Msg[],
  timeoutMs: number
): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 900 }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`${model} ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string' || !text.trim()) throw new Error('empty');
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/\*\*/g, '').trim();
}

async function synthesize(messages: Msg[]): Promise<string | null> {
  const orKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const oaKey = process.env.OPENAI_API_KEY;
  const OR = 'https://openrouter.ai/api/v1/chat/completions';
  const GQ = 'https://api.groq.com/openai/v1/chat/completions';
  const OA = 'https://api.openai.com/v1/chat/completions';

  const tiers: Array<() => Promise<string>> = [];
  if (orKey) {
    tiers.push(() => callChat(OR, orKey, 'perplexity/sonar', messages, 4000));
    tiers.push(() => callChat(OR, orKey, 'openai/gpt-4o-mini:online', messages, 4000));
  }
  if (groqKey) {
    tiers.push(() => callChat(GQ, groqKey, 'openai/gpt-oss-120b', messages, 8000));
    tiers.push(() => callChat(GQ, groqKey, 'llama-3.3-70b-versatile', messages, 6000));
  }
  if (oaKey) tiers.push(() => callChat(OA, oaKey, 'gpt-4o-mini', messages, 8000));
  if (orKey) tiers.push(() => callChat(OR, orKey, 'openai/gpt-4o-mini', messages, 8000));

  for (const t of tiers) {
    try {
      return await t();
    } catch {
      // try next tier
    }
  }
  return null;
}

export async function POST(req: Request) {
  let arabic = true;
  let items: NewsItem[] = [];
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

    arabic = isArabicText(userMessage);
    const isGeneric = GENERIC_NEWS.test(userMessage) && userMessage.trim().length < 40;
    items = await fetchNews(isGeneric ? '' : userMessage, arabic);

    const today = new Date().toISOString().split('T')[0];
    let context = items.length > 0 ? formatItems(items, arabic) : '';
    if (!context && egyptNews && egyptNews.length > 0) {
      context = egyptNews
        .slice(0, 4)
        .map((n) => `- ${n.title} (${n.date}): ${n.description}`)
        .join('\n');
    }

    const history: Msg[] = Array.isArray(messages)
      ? messages.slice(-6).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: String(m.content ?? ''),
        }))
      : [{ role: 'user', content: userMessage }];

    const reply = await synthesize([
      { role: 'system', content: buildSystemPrompt(arabic, today, context) },
      ...history,
    ]);

    if (reply) return NextResponse.json({ reply });

    if (items.length > 0) {
      const header = arabic ? 'أحدث الأخبار من مصر:' : 'Latest news from Egypt:';
      return NextResponse.json({ reply: `${header}\n\n${formatItems(items.slice(0, 5), arabic)}` });
    }
    const fallback = (egyptNews || [])
      .slice(0, 4)
      .map((n, i) =>
        arabic
          ? `${i + 1}. ${n.title}\nالتاريخ: ${n.date}`
          : `${i + 1}. ${n.title}\nDate: ${n.date}`
      )
      .join('\n\n');
    return NextResponse.json({
      reply: `${arabic ? 'آخر المستجدات المتاحة:' : 'Latest available updates:'}\n\n${fallback}`,
    });
  } catch {
    const msg = items.length > 0
      ? formatItems(items.slice(0, 5), arabic)
      : arabic
        ? 'جاري تحديث الأخبار، حاول مرة أخرى بعد لحظات.'
        : 'News is refreshing, please try again in a moment.';
    return NextResponse.json({ reply: msg }, { status: 200 });
  }
}
