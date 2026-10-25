import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * News Cron Handler
 * Fetches live Egypt tourism & national development news via NewsAPI,
 * upserts into `news_cache`, and purges news older than 7 days.
 * Secured by CRON_SECRET header.
 */
async function handleCron(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');

    // Secure with CRON_SECRET header check
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized: Invalid CRON_SECRET' }, { status: 401 });
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NEWS_API_KEY is not configured in environment' },
        { status: 500 }
      );
    }

    const query = 'Egypt tourism OR New Capital OR Grand Egyptian Museum OR آثار مصر';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&sortBy=publishedAt&pageSize=30&apiKey=${apiKey}`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'EgyptX-NewsCron/1.0' },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[News Cron] NewsAPI fetch failed:', errText);
      return NextResponse.json(
        { error: 'NewsAPI request failed', details: errText },
        { status: 502 }
      );
    }

    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.articles)) {
      return NextResponse.json(
        { error: 'Invalid response from NewsAPI', data },
        { status: 502 }
      );
    }

    const validArticles = data.articles.filter(
      (a: any) => a.title && a.url && a.title !== '[Removed]'
    );

    const rows = validArticles.map((a: any) => ({
      title: a.title.slice(0, 500),
      description: (a.description || a.content || '').slice(0, 2000),
      source_name: a.source?.name || 'NewsAPI',
      url: a.url,
      published_at: a.publishedAt
        ? new Date(a.publishedAt).toISOString()
        : new Date().toISOString(),
      fetched_at: new Date().toISOString(),
    }));

    const supabase = createAdminClient();

    // 1. Upsert articles into news_cache with url as unique constraint
    let upsertedCount = 0;
    if (rows.length > 0) {
      const { data: upsertData, error: upsertErr } = await supabase
        .from('news_cache')
        .upsert(rows, { onConflict: 'url' })
        .select('id');

      if (upsertErr) {
        console.error('[News Cron] Upsert to news_cache failed:', upsertErr);
        return NextResponse.json(
          { error: 'Failed to upsert news into Supabase', details: upsertErr },
          { status: 500 }
        );
      }
      upsertedCount = upsertData?.length || rows.length;
    }

    // 2. Delete rows older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error: purgeErr } = await supabase
      .from('news_cache')
      .delete()
      .lt('published_at', sevenDaysAgo);

    if (purgeErr) {
      console.warn('[News Cron] Purge older news warning:', purgeErr);
    }

    return NextResponse.json({
      success: true,
      upsertedCount,
      purgedOlderThan: sevenDaysAgo,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[News Cron Exception]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Cron Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleCron(req);
}

export async function POST(req: Request) {
  return handleCron(req);
}
