import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || !query.trim()) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error('[fetch-image] UNSPLASH_ACCESS_KEY is not defined in environment variables');
    return NextResponse.json({ error: 'Unsplash API key is not configured' }, { status: 500 });
  }

  const headers = {
    Authorization: `Client-ID ${accessKey}`,
    'Accept-Version': 'v1',
  };

  try {
    const cleanQuery = query.trim();
    // Primary query: "{query} Egypt"
    let unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery + ' Egypt')}&per_page=1&orientation=landscape`;
    
    let res = await fetch(unsplashUrl, { headers, next: { revalidate: 86400 } });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[fetch-image] Unsplash API error:', res.status, errText);
      return NextResponse.json(
        { error: 'Unsplash API error', details: errText },
        { status: res.status }
      );
    }

    let data = await res.json();

    // Secondary fallback if no results: "{query}"
    if (!data.results || data.results.length === 0) {
      unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=1&orientation=landscape`;
      res = await fetch(unsplashUrl, { headers, next: { revalidate: 86400 } });
      if (res.ok) {
        data = await res.json();
      }
    }

    // Tertiary fallback if still no results: "Egypt tourism landmark"
    if (!data.results || data.results.length === 0) {
      unsplashUrl = `https://api.unsplash.com/search/photos?query=Egypt%20tourism%20landmark&per_page=5&orientation=landscape`;
      res = await fetch(unsplashUrl, { headers, next: { revalidate: 86400 } });
      if (res.ok) {
        data = await res.json();
      }
    }

    if (data.results && data.results.length > 0 && data.results[0]?.urls?.regular) {
      return NextResponse.json(
        { url: data.results[0].urls.regular },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        }
      );
    }

    console.warn('[fetch-image] No image found for query:', cleanQuery);
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  } catch (err: any) {
    console.error('[fetch-image] Unexpected exception:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch image' }, { status: 500 });
  }
}
