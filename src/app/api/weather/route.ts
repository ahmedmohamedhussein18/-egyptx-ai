import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Fix Next.js static prerendering error on request.url

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    // Check if we have an API key
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.warn("Weather API key is missing");
      return NextResponse.json({ error: "Weather data temporarily unavailable" }, { status: 500 });
    }

    let url = '';
    
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else {
      return NextResponse.json({ error: "Missing city or coordinates" }, { status: 400 });
    }

    const response = await fetch(url, { next: { revalidate: 600 } });
    
    if (!response.ok) {
      throw new Error(`OpenWeather API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.weather || data.weather.length === 0 || !data.main) {
      throw new Error("Invalid format received from OpenWeather API");
    }

    // Return only the fields we need
    return NextResponse.json({
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      icon: data.weather[0].icon,
    });
    
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: "Weather data temporarily unavailable" }, { status: 500 });
  }
}
