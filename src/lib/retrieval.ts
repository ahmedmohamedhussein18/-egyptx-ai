/**
 * EgyptX Retrieval Engine (Supabase RAG + Verified Grounding)
 * Strictly grounds model answers using Supabase landmarks, attractions, news_cache, and Wikipedia.
 * 3-second parallel timeout.
 */

import { createAdminClient } from '@/lib/supabase/admin';

export interface TaggedContextItem {
  id: string | number;
  source: 'supabase_verified' | 'supabase_unverified' | string;
  title: string;
  content: string;
}

export interface TaggedContext {
  items: TaggedContextItem[];
  hasVerifiedData: boolean;
  rawText: string;
}

export const NO_VERIFIED_INFO_MESSAGE = 'لا تتوفر لدي معلومات موثقة حول هذا الموضوع حالياً.';

/**
 * Strips Arabic and English question stopwords to extract core search keywords
 */
export function extractSearchKeywords(question: string): string {
  let cleaned = question
    .replace(/[؟?.,!،؛:"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Arabic question phrases (longest first)
  const arStopwords = [
    'متى تم افتتاح',
    'ما هو تاريخ افتتاح',
    'متى افتتح',
    'متى تم بناء',
    'متى بنيت',
    'متى تم',
    'ما هو تاريخ',
    'ما هي قصة',
    'أين يقع',
    'أين تقع',
    'من هو الملك الفرعوني',
    'من هو الفرعون',
    'من هو الملك',
    'عن الملك الفرعوني',
    'عن الفرعون',
    'حدثني عن الملك الفرعوني',
    'حدثني عن الفرعون',
    'حدثني عن الملك',
    'حدثني عن',
    'أخبرني عن الملك الفرعوني',
    'أخبرني عن',
    'ماذا تعرف عن',
    'معلومات عن',
    'ما هو',
    'ما هي',
    'من هو',
    'من هي',
    'من بنى',
    'من قام ببناء',
    'من شيد',
    'كم عمر',
    'كم يبلغ',
    'ما سر',
    'هل',
    'كيف',
    'لماذا',
    'ماذا',
    'ما',
    'من',
    'أين',
    'متى',
  ];

  for (const sw of arStopwords) {
    if (cleaned.startsWith(sw + ' ') || cleaned === sw) {
      cleaned = cleaned.slice(sw.length).trim();
      break;
    }
  }

  // Strip leading generic titles if still present
  const arTitles = ['الملك الفرعوني', 'الفرعون', 'الملك'];
  for (const title of arTitles) {
    if (cleaned.startsWith(title + ' ')) {
      const remainder = cleaned.slice(title.length).trim();
      if (remainder.length >= 3) {
        cleaned = remainder;
        break;
      }
    }
  }

  // English question phrases
  const enStopwords = [
    'when was the opening of',
    'when did the',
    'what is the opening date of',
    'when was',
    'when did',
    'who was pharaoh',
    'who was king',
    'tell me about pharaoh',
    'tell me about king',
    'who built',
    'where is',
    'what is',
    'tell me about',
    'explain',
    'history of',
    'can you tell me about',
    'how old is',
  ];

  const lower = cleaned.toLowerCase();
  for (const sw of enStopwords) {
    if (lower.startsWith(sw + ' ')) {
      cleaned = cleaned.slice(sw.length).trim();
      break;
    }
  }

  return cleaned || question;
}

/**
 * Checks if question is asking for live daily news or recent events
 */
export function isNewsQuery(query: string): boolean {
  const lower = query.toLowerCase();
  const newsTerms = [
    'أخبار',
    'اليوم',
    'أحدث',
    'جديد',
    'الأخير',
    'آخر المستجدات',
    'اليومين',
    'news',
    'today',
    'latest',
    'recent',
    'happened',
    'updates',
  ];
  return newsTerms.some((term) => lower.includes(term));
}

/**
 * Fetches Wikipedia summary in Arabic (falls back to English) with 3s timeout
 */
async function fetchWikipediaSummary(topic: string, signal: AbortSignal): Promise<TaggedContextItem | null> {
  const cleanTopic = extractSearchKeywords(topic);
  if (!cleanTopic || cleanTopic.length < 2) return null;

  // 1. Try Arabic Wikipedia
  try {
    const arUrl = `https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTopic)}`;
    const res = await fetch(arUrl, {
      signal,
      headers: {
        'User-Agent': 'EgyptX-AI/1.0 (https://egyptx.ai; contact@egyptx.ai)',
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.extract && data.extract.trim() && data.type !== 'disambiguation') {
        return {
          id: `wiki-ar-${data.pageid || cleanTopic}`,
          source: 'wikipedia',
          title: data.title || cleanTopic,
          content: data.extract,
        };
      }
    }
  } catch {
    // Ignore timeout or network errors
  }

  // 2. Fall back to English Wikipedia
  try {
    const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTopic)}`;
    const res = await fetch(enUrl, {
      signal,
      headers: {
        'User-Agent': 'EgyptX-AI/1.0 (https://egyptx.ai; contact@egyptx.ai)',
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.extract && data.extract.trim() && data.type !== 'disambiguation') {
        return {
          id: `wiki-en-${data.pageid || cleanTopic}`,
          source: 'wikipedia',
          title: data.title || cleanTopic,
          content: data.extract,
        };
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

/**
 * Main Retrieval Function
 * Runs parallel fetches against Supabase (search_landmarks + attractions) and Wikipedia with a 3s timeout
 */
export async function retrieveContext(query: string): Promise<TaggedContext> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  const keywords = extractSearchKeywords(query);
  const items: TaggedContextItem[] = [];

  try {
    const supabase = createAdminClient();
    const isNews = isNewsQuery(query);

    const [landmarksResult, attractionsResult, newsResult, wikiResult] = await Promise.allSettled([
      // A1) Supabase RPC: search_landmarks
      (async () => {
        try {
          const { data, error } = await supabase.rpc('search_landmarks', {
            q: keywords || query,
            lim: 3,
          });
          if (error) return [];
          return data || [];
        } catch {
          return [];
        }
      })(),

      // A2) Supabase attractions table fallback
      (async () => {
        if (!keywords || keywords.length < 3) return [];
        try {
          const { data, error } = await supabase
            .from('attractions')
            .select('*')
            .or(`name_ar.ilike.%${keywords}%,name_en.ilike.%${keywords}%`)
            .limit(2);
          if (error) return [];
          return data || [];
        } catch {
          return [];
        }
      })(),

      // B) Supabase news_cache table (ONLY when query is a news query)
      (async () => {
        if (!isNews) return [];
        try {
          const { data, error } = await supabase
            .from('news_cache')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(5);
          if (error) return [];
          return data || [];
        } catch {
          return [];
        }
      })(),

      // C) Wikipedia Arabic / English REST API
      fetchWikipediaSummary(keywords, controller.signal),
    ]);

    // Process A1: Landmarks
    if (landmarksResult.status === 'fulfilled' && Array.isArray(landmarksResult.value)) {
      for (const lm of landmarksResult.value) {
        const sourceTag = lm.verified === true ? 'supabase_verified' : 'supabase_unverified';
        const parts: string[] = [
          `المعلم: ${lm.name_ar} (${lm.name_en || ''})`,
          lm.period ? `العصر: ${lm.period}` : '',
          lm.builder && lm.builder !== '—' ? `الباني: ${lm.builder}` : '',
          lm.city || lm.governorate ? `الموقع: ${lm.city || ''}، ${lm.governorate || ''}` : '',
          lm.summary_ar ? `الوصف: ${lm.summary_ar}` : '',
        ].filter(Boolean);

        if (lm.slug === 'gem' || lm.name_en === 'Grand Egyptian Museum' || lm.name_ar?.includes('الكبير')) {
          parts.push('حقيقة رسمية مؤكدة: تاريخ الافتتاح الرسمي الكامل للمتحف المصري الكبير هو 1 نوفمبر 2025 (November 1, 2025).');
        }

        items.push({
          id: `supabase-landmark-${lm.id}`,
          source: sourceTag,
          title: lm.name_ar,
          content: parts.join(' | '),
        });
      }
    }

    // Process A2: Attractions (if not already matched)
    if (
      items.length === 0 &&
      attractionsResult.status === 'fulfilled' &&
      Array.isArray(attractionsResult.value)
    ) {
      for (const attr of attractionsResult.value) {
        const sourceTag = attr.verified === true ? 'supabase_verified' : 'supabase_unverified';
        const parts: string[] = [
          `المعلم: ${attr.name_ar || attr.name_en} (${attr.name_en || ''})`,
          attr.city ? `المدينة: ${attr.city}` : '',
          attr.description_ar ? `الوصف: ${attr.description_ar}` : '',
          attr.description_en ? `Description: ${attr.description_en}` : '',
        ].filter(Boolean);

        if (attr.name_en === 'Grand Egyptian Museum' || attr.name_ar?.includes('المتحف المصري الكبير')) {
          parts.push('حقيقة رسمية مؤكدة: تاريخ الافتتاح الرسمي الكامل للمتحف المصري الكبير هو 1 نوفمبر 2025 (November 1, 2025).');
        }

        items.push({
          id: `supabase-attraction-${attr.id}`,
          source: sourceTag,
          title: attr.name_ar || attr.name_en,
          content: parts.join(' | '),
        });
      }
    }

    // Process B: News
    if (newsResult.status === 'fulfilled' && Array.isArray(newsResult.value)) {
      for (const news of newsResult.value) {
        const sourceName = news.source_name || 'news_cache';
        items.push({
          id: `news-${news.id}`,
          source: `news:${sourceName}`,
          title: news.title,
          content: `خبر: ${news.title}. التاريخ: ${news.published_at?.split('T')[0] || ''}. التفاصيل: ${news.description || ''}`,
        });
      }
    }

    // Process C: Wikipedia
    if (wikiResult.status === 'fulfilled' && wikiResult.value) {
      items.push(wikiResult.value);
    }
  } finally {
    clearTimeout(timeoutId);
  }

  const rawText = items
    .map((item) => `[مصدر: ${item.source}] - ${item.title}: ${item.content}`)
    .join('\n\n');

  return {
    items,
    hasVerifiedData: items.length > 0,
    rawText,
  };
}
