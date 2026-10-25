import { POST as generateItineraryHandler } from '@/app/api/generate-itinerary/route';

export async function POST(req: Request) {
  return generateItineraryHandler(req);
}
