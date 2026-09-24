import { NextResponse } from 'next/server';
import egyptNews from '@/data/egypt-news';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let filteredNews = egyptNews;

  if (category && category !== 'All') {
    filteredNews = egyptNews.filter(news => news.category.toLowerCase() === category.toLowerCase());
  }

  // Ensure it's sorted or just returned as is (already curated)
  return NextResponse.json({ articles: filteredNews });
}
