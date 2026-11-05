import { NextRequest, NextResponse } from 'next/server';

interface TransitStep {
  instruction: string;
  distance: string;
  duration: string;
  travelMode: string;
  transitDetails?: {
    lineName: string;
    lineShortName: string;
    vehicleType: string;
    departureStop: string;
    arrivalStop: string;
    numStops: number;
    headsign: string;
    lineColor?: string;
  };
}

interface ModeRouteResult {
  available: boolean;
  distance?: string;
  duration?: string;
  durationValue?: number;
  summary?: string;
  departureTime?: string;
  arrivalTime?: string;
  steps?: TransitStep[];
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, language = 'en' } = body;

    // Validation
    if (!origin || typeof origin.lat !== 'number' || typeof origin.lng !== 'number') {
      return NextResponse.json(
        { error: 'Valid origin coordinates (lat, lng) are required.' },
        { status: 400 }
      );
    }

    if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
      return NextResponse.json(
        { error: 'A destination name or address is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GOOGLE_MAPS_API_KEY is not configured on the server. Please add GOOGLE_MAPS_API_KEY to .env.local.',
          requiresKey: true
        },
        { status: 503 }
      );
    }

    const originStr = `${origin.lat},${origin.lng}`;
    const cleanDest = destination.trim();

    // Helper function to query Google Directions API for a mode
    const fetchDirectionsForMode = async (mode: 'transit' | 'driving' | 'walking'): Promise<ModeRouteResult> => {
      const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
      url.searchParams.set('origin', originStr);
      url.searchParams.set('destination', cleanDest);
      url.searchParams.set('mode', mode);
      url.searchParams.set('language', language);
      url.searchParams.set('region', 'eg'); // Bias to Egypt
      url.searchParams.set('key', apiKey);

      const res = await fetch(url.toString());
      if (!res.ok) {
        return { available: false, error: `Google API responded with status ${res.status}` };
      }

      const data = await res.json();

      if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
        return {
          available: false,
          error: data.error_message || data.status || 'No route found for this mode'
        };
      }

      const route = data.routes[0];
      const leg = route.legs?.[0];

      if (!leg) {
        return { available: false, error: 'No route leg returned' };
      }

      // Parse step instructions
      const steps: TransitStep[] = (leg.steps || []).map((s: any) => {
        // Strip HTML tags for clean text display
        const cleanInstruction = (s.html_instructions || '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();

        const stepObj: TransitStep = {
          instruction: cleanInstruction,
          distance: s.distance?.text || '',
          duration: s.duration?.text || '',
          travelMode: s.travel_mode || ''
        };

        if (s.travel_mode === 'TRANSIT' && s.transit_details) {
          const td = s.transit_details;
          stepObj.transitDetails = {
            lineName: td.line?.name || '',
            lineShortName: td.line?.short_name || '',
            vehicleType: td.line?.vehicle?.name || td.line?.vehicle?.type || 'Transit',
            departureStop: td.departure_stop?.name || '',
            arrivalStop: td.arrival_stop?.name || '',
            numStops: td.num_stops || 1,
            headsign: td.headsign || '',
            lineColor: td.line?.color ? `#${td.line.color}` : undefined
          };
        }

        return stepObj;
      });

      return {
        available: true,
        distance: leg.distance?.text,
        duration: leg.duration?.text,
        durationValue: leg.duration?.value,
        summary: route.summary || leg.start_address,
        departureTime: leg.departure_time?.text,
        arrivalTime: leg.arrival_time?.text,
        steps
      };
    };

    // Query 3 modes in parallel (Transit, Driving, Walking)
    const [transitRoute, drivingRoute, walkingRoute] = await Promise.all([
      fetchDirectionsForMode('transit'),
      fetchDirectionsForMode('driving'),
      fetchDirectionsForMode('walking')
    ]);

    // Construct live Google Maps deep link for immediate turn-by-turn navigation
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(cleanDest)}`;

    return NextResponse.json({
      success: true,
      origin: {
        lat: origin.lat,
        lng: origin.lng
      },
      destination: cleanDest,
      modes: {
        transit: transitRoute,
        driving: drivingRoute,
        walking: walkingRoute
      },
      googleMapsUrl
    });

  } catch (error: any) {
    console.error('Smart Navigator API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process navigation request' },
      { status: 500 }
    );
  }
}
