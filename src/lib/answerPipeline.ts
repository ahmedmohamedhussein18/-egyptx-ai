import {
  VERIFIED_EGYPT_HERITAGE_KB,
  OUT_OF_SCOPE_AR,
  OUT_OF_SCOPE_EN,
  isClearlyOutOfScope,
  isItineraryOrWeatherQuery,
  fetchEgyptLiveWeather,
  fetchTrustedWikipediaAndRAG,
  generateWithSmartFallback,
} from './egypt-rag';
import { TaggedContext } from './retrieval';

export const STRICT_AI_GUIDE_RULES = `You are the EgyptX AI Guide — the user's closest, warmest Egyptian best friend ("صاحبي الجدع وحبيبي") and expert Egyptian historian & tour planner.
Answer accurately using the verified Egyptian heritage database and Wikipedia grounding.
If asked about the Grand Egyptian Museum (المتحف المصري الكبير), state that its official opening is November 1, 2025.
If the user asks an out-of-scope question outside Egyptian history, monuments, or tourism, politely reply: "${OUT_OF_SCOPE_AR}" (or in English if asked in English).`;

export const EGYPTX_GUIDE_SYSTEM_PROMPT = `${STRICT_AI_GUIDE_RULES}

${VERIFIED_EGYPT_HERITAGE_KB}`;

export interface Claim {
  id: number;
  text: string;
  source: string;
}

export interface ClaimVerification {
  id: number;
  verdict: 'supported' | 'unsupported' | 'uncertain';
  note?: string;
}

export interface PipelineResult {
  reply: string;
  context: TaggedContext;
  claims: Claim[];
  supportedClaims: Claim[];
  stream?: ReadableStream<Uint8Array>;
}

export async function executeThreeStagePipeline(
  query: string,
  options?: { stream?: boolean }
): Promise<PipelineResult> {
  const isArabic = /[\u0600-\u06FF]/.test(query);

  if (isClearlyOutOfScope(query)) {
    const refusal = isArabic ? OUT_OF_SCOPE_AR : OUT_OF_SCOPE_EN;
    const emptyCtx: TaggedContext = { items: [], hasVerifiedData: true, rawText: '' };
    if (options?.stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(refusal));
          controller.close();
        },
      });
      return { reply: refusal, context: emptyCtx, claims: [], supportedClaims: [], stream: readableStream };
    }
    return { reply: refusal, context: emptyCtx, claims: [], supportedClaims: [] };
  }

  const [wikiAndDbContext, weatherContext] = await Promise.all([
    fetchTrustedWikipediaAndRAG(query),
    isItineraryOrWeatherQuery(query) ? fetchEgyptLiveWeather(query) : Promise.resolve(''),
  ]);

  let systemPrompt = EGYPTX_GUIDE_SYSTEM_PROMPT;
  if (weatherContext) {
    systemPrompt += `\n\n--- LIVE EGYPT WEATHER ---\n${weatherContext}`;
  }
  if (wikiAndDbContext) {
    systemPrompt += `\n\n--- LIVE WIKIPEDIA & VERIFIED RAG ---\n${wikiAndDbContext}`;
  }

  const reply = await generateWithSmartFallback({
    systemPrompt,
    messages: [{ role: 'user', content: query }],
    temperature: 0.4,
  });

  const ctx: TaggedContext = {
    items: [{ id: 'verified', source: 'supabase_verified', title: 'EgyptX Heritage RAG', content: wikiAndDbContext }],
    hasVerifiedData: true,
    rawText: wikiAndDbContext,
  };

  if (options?.stream) {
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(reply));
        controller.close();
      },
    });
    return {
      reply,
      context: ctx,
      claims: [],
      supportedClaims: [],
      stream: readableStream,
    };
  }

  return {
    reply,
    context: ctx,
    claims: [],
    supportedClaims: [],
  };
}
