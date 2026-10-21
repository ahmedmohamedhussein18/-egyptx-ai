import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/EGP`,
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();

    if (data.result !== 'success') {
      return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
    }

    return NextResponse.json({
      rates: data.conversion_rates,
      lastUpdate: data.time_last_update_utc,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
