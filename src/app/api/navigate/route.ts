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

// Format meters into readable text (e.g., "350 m" or "3.2 km")
function formatDistance(meters?: number): string {
  if (typeof meters !== 'number' || isNaN(meters)) return '';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// Format Routes API duration string ("1080s" or "45s") into readable text and integer seconds
function formatDuration(durationStr?: string): { text: string; seconds: number } {
  if (!durationStr) return { text: '', seconds: 0 };
  const seconds = parseInt(durationStr.replace('s', ''), 10) || 0;
  if (seconds < 60) return { text: '< 1 min', seconds };
  if (seconds < 3600) {
    const mins = Math.round(seconds / 60);
    return { text: `${mins} min${mins === 1 ? '' : 's'}`, seconds };
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  if (mins === 0) {
    return { text: `${hours} hr${hours === 1 ? '' : 's'}`, seconds };
  }
  return { text: `${hours} hr ${mins} min${mins === 1 ? '' : 's'}`, seconds };
}

// Format ISO 8601 timestamp string into readable 12-hour time (e.g., "10:15 AM")
function formatTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
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

    // Mapping mode to Google Routes API (v2:computeRoutes) TravelMode enum
    const modeMap: Record<'transit' | 'driving' | 'walking', 'TRANSIT' | 'DRIVE' | 'WALK'> = {
      transit: 'TRANSIT',
      driving: 'DRIVE',
      walking: 'WALK'
    };

    // Query Google Routes API (v2:computeRoutes) for a specific travel mode
    const fetchRoutesForMode = async (mode: 'transit' | 'driving' | 'walking'): Promise<ModeRouteResult> => {
      const travelMode = modeMap[mode];
      const apiUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';

      const requestBody: Record<string, any> = {
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng
            }
          }
        },
        destination: {
          address: cleanDest
        },
        travelMode,
        languageCode: language,
        regionCode: 'eg'
      };

      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.description,routes.legs,routes.localizedValues'
          },
          body: JSON.stringify(requestBody)
        });

        const data = await res.json();

        if (!res.ok) {
          const apiErrorMsg = data?.error?.message || data?.error?.status || `Routes API error (HTTP ${res.status})`;
          console.error(`Google Routes API [${mode}] error:`, apiErrorMsg);
          return {
            available: false,
            error: apiErrorMsg
          };
        }

        if (!data.routes || data.routes.length === 0) {
          return {
            available: false,
            error: mode === 'transit' ? 'No direct metro line found' : 'No route found for this mode'
          };
        }

        const route = data.routes[0];
        const leg = route.legs?.[0];

        if (!leg) {
          return { available: false, error: 'No route leg returned' };
        }

        // Distance & duration
        const distanceText =
          route.localizedValues?.distance?.text ||
          leg.localizedValues?.distance?.text ||
          formatDistance(route.distanceMeters ?? leg.distanceMeters);

        const durationInfo = formatDuration(route.duration ?? leg.duration);
        const durationText =
          route.localizedValues?.duration?.text ||
          leg.localizedValues?.duration?.text ||
          durationInfo.text;

        // Parse transit / navigation steps
        let firstTransitDeparture: string | undefined;
        let lastTransitArrival: string | undefined;

        const rawSteps = leg.steps || [];
        const steps: TransitStep[] = rawSteps.map((s: any) => {
          const cleanInstruction = (s.navigationInstruction?.instructions || '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim() || (s.travelMode === 'TRANSIT'
              ? `Take ${s.transitDetails?.transitLine?.name || s.transitDetails?.transitLine?.nameShort || 'Transit line'}`
              : s.travelMode === 'WALK'
              ? 'Walk'
              : 'Drive');

          const stepDistance =
            s.localizedValues?.distance?.text ||
            formatDistance(s.distanceMeters);

          const stepDuration =
            s.localizedValues?.staticDuration?.text ||
            formatDuration(s.staticDuration).text;

          const stepObj: TransitStep = {
            instruction: cleanInstruction,
            distance: stepDistance,
            duration: stepDuration,
            travelMode: s.travelMode === 'TRANSIT' ? 'TRANSIT' : s.travelMode === 'DRIVE' ? 'DRIVING' : 'WALKING'
          };

          if (s.travelMode === 'TRANSIT' && s.transitDetails) {
            const td = s.transitDetails;
            const stopDetails = td.stopDetails;

            if (stopDetails?.departureTime && !firstTransitDeparture) {
              firstTransitDeparture = stopDetails.departureTime;
            }
            if (stopDetails?.arrivalTime) {
              lastTransitArrival = stopDetails.arrivalTime;
            }

            stepObj.transitDetails = {
              lineName: td.transitLine?.name || td.transitLine?.nameShort || '',
              lineShortName: td.transitLine?.nameShort || '',
              vehicleType: td.transitLine?.vehicle?.name?.text || td.transitLine?.vehicle?.type || 'Transit',
              departureStop: stopDetails?.departureStop?.name || '',
              arrivalStop: stopDetails?.arrivalStop?.name || '',
              numStops: td.stopCount || 1,
              headsign: td.headsign || '',
              lineColor: td.transitLine?.color || undefined
            };
          }

          return stepObj;
        });

        return {
          available: true,
          distance: distanceText,
          duration: durationText,
          durationValue: durationInfo.seconds,
          summary: route.description || undefined,
          departureTime: formatTime(firstTransitDeparture),
          arrivalTime: formatTime(lastTransitArrival),
          steps
        };
      } catch (modeErr: any) {
        console.error(`Exception while fetching route for mode [${mode}]:`, modeErr?.message || modeErr);
        return {
          available: false,
          error: modeErr?.message || 'Failed to compute route for this mode'
        };
      }
    };

    // Query 3 modes in parallel (Transit, Driving, Walking)
    const [transitRoute, drivingRoute, walkingRoute] = await Promise.all([
      fetchRoutesForMode('transit'),
      fetchRoutesForMode('driving'),
      fetchRoutesForMode('walking')
    ]);

    // Universal Google Maps deep link for immediate live GPS navigation
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
