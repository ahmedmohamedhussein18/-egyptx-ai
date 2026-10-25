/**
 * Server-side real-time web search.
 * Providers (first configured wins): Tavily (TAVILY_API_KEY), Serper (SERPER_API_KEY),
 * Google Custom Search (GOOGLE_CSE_API_KEY + GOOGLE_CSE_CX).
 * Keys are read from the server environment only and are never logged or returned.
 */

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export function isWebSearchConfigured(): boolean {
  return Boolean(
    process.env.TAVILY_API_KEY ||
      process.env.SERPER_API_KEY ||
      (process.env.GOOGLE_CSE_API_KEY && process.env.GOOGLE_CSE_CX)
  );
}

async function fetchWithTimeout(url: string, init: RequestInit, ms = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function webSearch(query: string, language = 'en', limit = 5): Promise<WebSearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    if (process.env.TAVILY_API_KEY) {
      const res = await fetchWithTimeout('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
        },
        body: JSON.stringify({ query: q, max_results: limit, search_depth: 'basic' }),
      });
      if (res.ok) {
        const data = await res.json();
        return (data.results || []).slice(0, limit).map((r: any) => ({
          title: String(r.title || ''),
          url: String(r.url || ''),
          snippet: String(r.content || '').slice(0, 700),
        }));
      }
    } else if (process.env.SERPER_API_KEY) {
      const res = await fetchWithTimeout('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.SERPER_API_KEY,
        },
        body: JSON.stringify({ q, num: limit, hl: language === 'ar' ? 'ar' : 'en' }),
      });
      if (res.ok) {
        const data = await res.json();
        return (data.organic || []).slice(0, limit).map((r: any) => ({
          title: String(r.title || ''),
          url: String(r.link || ''),
          snippet: String(r.snippet || '').slice(0, 700),
        }));
      }
    } else if (process.env.GOOGLE_CSE_API_KEY && process.env.GOOGLE_CSE_CX) {
      const params = new URLSearchParams({
        key: process.env.GOOGLE_CSE_API_KEY,
        cx: process.env.GOOGLE_CSE_CX,
        q,
        num: String(Math.min(limit, 10)),
        hl: language === 'ar' ? 'ar' : 'en',
      });
      const res = await fetchWithTimeout(`https://www.googleapis.com/customsearch/v1?${params}`, {});
      if (res.ok) {
        const data = await res.json();
        return (data.items || []).slice(0, limit).map((r: any) => ({
          title: String(r.title || ''),
          url: String(r.link || ''),
          snippet: String(r.snippet || '').slice(0, 700),
        }));
      }
    }
  } catch (err: any) {
    console.warn('[WebSearch] failed:', err?.name || 'error');
  }
  return [];
}
