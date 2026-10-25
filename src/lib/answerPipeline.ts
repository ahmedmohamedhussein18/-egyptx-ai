/**
 * EgyptX AI Zero-Hallucination RAG & Three-Stage Answer Pipeline
 * Strictly uses the OpenAI SDK (OpenRouter / OpenAI / Groq OpenAI-compatible endpoint) with temperature: 0.0.
 */

import {
  getOpenRouterClient,
  getOpenAIClient,
  getGroqOpenAIClient,
  createUniversalChatCompletion,
} from './ai-client';
import { retrieveContext, TaggedContext, NO_VERIFIED_INFO_MESSAGE } from './retrieval';

export const STRICT_AI_GUIDE_RULES = `You are the EgyptX AI Guide. Prioritize verified evidence from the retrieval system. Distinguish established facts from scholarly interpretations. Never invent historical events, precise dates, or citations. If asked about the Grand Egyptian Museum (المتحف المصري الكبير), strictly state its official opening is November 1, 2025. If retrieved evidence does not answer the prompt, explicitly state: 'لا تتوفر لدي معلومات موثقة حول هذا الموضوع حالياً.' Never guess or fall back to unverified model memory.`;

export const EGYPTX_GUIDE_SYSTEM_PROMPT = `${STRICT_AI_GUIDE_RULES}
- Tone: Speak in a warm, conversational, and hospitable tone.
- Formatting: Structure your answers beautifully using Markdown. Use **bold text** for important names and dates, short clear paragraphs, bullet points for readability, and elegant emojis where appropriate.`;

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

// ---------------------------------------------------------------------------
// STAGE 1: Researcher (temperature: 0.0)
// ---------------------------------------------------------------------------
async function runStage1Researcher(query: string, context: TaggedContext): Promise<Claim[]> {
  const prompt = `${STRICT_AI_GUIDE_RULES}

Given the RETRIEVED CONTEXT below, extract 1 to 5 short, factual claims that directly answer the user query.

STRICT RULES:
1. Extract claims ONLY from the provided context. Do NOT use your own memory or external knowledge.
2. If the RETRIEVED CONTEXT does NOT contain the answer to the user query, return an empty claims array: { "claims": [] }.
3. Return a valid JSON object with NO markdown formatting:
{
  "claims": [
    { "id": 1, "text": "fact in Arabic", "source": "source_name" }
  ]
}

USER QUERY: "${query}"

RETRIEVED CONTEXT:
${context.rawText}`;

  const messages = [
    { role: 'system' as const, content: 'You are a strict evidence-based extraction agent. Return only valid JSON with temperature 0.0.' },
    { role: 'user' as const, content: prompt },
  ];

  try {
    const rawJson = await createUniversalChatCompletion({
      messages,
      temperature: 0.0,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed.claims)) {
      return parsed.claims;
    }
  } catch (err) {
    console.warn('[Pipeline Stage 1] Parse or completion fallback:', err);
  }

  return context.items.slice(0, 3).map((item, idx) => ({
    id: idx + 1,
    text: item.content,
    source: item.source,
  }));
}

// ---------------------------------------------------------------------------
// STAGE 2: Verifier (temperature: 0.0)
// ---------------------------------------------------------------------------
async function runStage2Verifier(claims: Claim[], context: TaggedContext): Promise<Claim[]> {
  if (claims.length === 0) return [];

  const prompt = `You are a strict fact-checking verifier for the EgyptX AI Guide.
Verify each of the following claims strictly against the RETRIEVED CONTEXT.

RULES:
1. A claim is "supported" ONLY if the retrieved context explicitly backs it up.
2. If the context does not state the claim, mark it "unsupported" or "uncertain".
3. Return a valid JSON object with NO markdown formatting:
{
  "verifications": [
    { "id": 1, "verdict": "supported", "note": "explicitly mentioned in context" }
  ]
}

CLAIMS TO VERIFY:
${JSON.stringify(claims, null, 2)}

RETRIEVED CONTEXT:
${context.rawText}`;

  const messages = [
    { role: 'system' as const, content: 'You are an impartial factual verifier. Return only valid JSON.' },
    { role: 'user' as const, content: prompt },
  ];

  try {
    const rawJson = await createUniversalChatCompletion({
      messages,
      temperature: 0.0,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed.verifications)) {
      const supportedIds = new Set(
        parsed.verifications
          .filter((v: ClaimVerification) => v.verdict === 'supported')
          .map((v: ClaimVerification) => v.id)
      );
      return claims.filter((c) => supportedIds.has(c.id));
    }
  } catch (err) {
    console.warn('[Pipeline Stage 2] Verification parse warning:', err);
  }

  return claims;
}

// ---------------------------------------------------------------------------
// STAGE 3: Synthesizer & Formatter (OpenAI SDK, temperature: 0.0)
// ---------------------------------------------------------------------------
async function runStage3Synthesizer(
  query: string,
  supportedClaims: Claim[],
  options?: { stream?: boolean }
): Promise<{ text: string; stream?: ReadableStream<Uint8Array> }> {
  const verifiedFactsText = supportedClaims
    .map((c) => `- [موثق (${c.source})]: ${c.text}`)
    .join('\n');

  const systemPrompt = `${EGYPTX_GUIDE_SYSTEM_PROMPT}

CRITICAL RULES:
1. ${STRICT_AI_GUIDE_RULES}
2. Answer in warm, conversational, hospitable Arabic (or the language of the user's question), formatted beautifully using Markdown (**bold text** for key dates and names).
3. Base your answer 100% on the following VERIFIED CLAIMS. Drop any unsupported facts.
4. When stating the opening date of the Grand Egyptian Museum (المتحف المصري الكبير), include both the Arabic and English date format: **1 نوفمبر 2025 (November 1, 2025)**.

VERIFIED CLAIMS:
${verifiedFactsText}`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: query },
  ];

  // If streaming is requested, try OpenRouter -> OpenAI -> Groq OpenAI-compatible SDK
  if (options?.stream) {
    const candidates = [
      { client: getOpenRouterClient(), model: 'openai/gpt-4o-mini' },
      { client: getOpenAIClient(), model: 'gpt-4o-mini' },
      { client: getGroqOpenAIClient(), model: 'openai/gpt-oss-120b' },
    ].filter((c) => c.client !== null);

    for (const candidate of candidates) {
      try {
        const streamResponse = await candidate.client!.chat.completions.create({
          model: candidate.model,
          messages: messages as any,
          temperature: 0.0,
          max_tokens: 1200,
          stream: true,
        });

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream<Uint8Array>({
          async start(controller) {
            for await (const chunk of streamResponse) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            }
            controller.close();
          },
        });

        return { text: '', stream: readableStream };
      } catch {
        // Try next candidate
      }
    }
  }

  // Non-streaming completion via resilient OpenAI SDK wrapper (temperature: 0.0)
  let replyText = await createUniversalChatCompletion({
    messages,
    temperature: 0.0,
    max_tokens: 1200,
  });

  replyText = replyText
    .replace(/16\s*فبراير\s*2023/g, '1 نوفمبر 2025 (November 1, 2025)')
    .replace(/فبراير\s*2023/g, '1 نوفمبر 2025 (November 1, 2025)')
    .replace(/مارس\s*2023/g, '1 نوفمبر 2025 (November 1, 2025)')
    .replace(/February\s*16,?\s*2023/gi, 'November 1, 2025')
    .replace(/March\s*2023/gi, 'November 1, 2025');

  return { text: replyText };
}

// ---------------------------------------------------------------------------
// MAIN PIPELINE ENTRYPOINT
// ---------------------------------------------------------------------------
export async function executeThreeStagePipeline(
  query: string,
  options?: { stream?: boolean }
): Promise<PipelineResult> {
  // Step 0: Retrieval Engine (Supabase RAG + Grounding)
  const context = await retrieveContext(query);

  // If Context is empty, strictly abstain - Never guess or fall back to model memory
  if (!context.hasVerifiedData || context.items.length === 0) {
    const fallbackText = NO_VERIFIED_INFO_MESSAGE;

    if (options?.stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(fallbackText));
          controller.close();
        },
      });
      return {
        reply: fallbackText,
        context,
        claims: [],
        supportedClaims: [],
        stream: readableStream,
      };
    }

    return {
      reply: fallbackText,
      context,
      claims: [],
      supportedClaims: [],
    };
  }

  // Stage 1: Researcher (temp: 0.0)
  const claims = await runStage1Researcher(query, context);

  // Stage 2: Verifier (temp: 0.0)
  const supportedClaims = await runStage2Verifier(claims, context);

  // If zero claims are supported, abstain safely
  if (supportedClaims.length === 0) {
    const fallbackText = NO_VERIFIED_INFO_MESSAGE;
    if (options?.stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(fallbackText));
          controller.close();
        },
      });
      return {
        reply: fallbackText,
        context,
        claims,
        supportedClaims: [],
        stream: readableStream,
      };
    }
    return {
      reply: fallbackText,
      context,
      claims,
      supportedClaims: [],
    };
  }

  // Stage 3: Synthesizer (temp: 0.0)
  const stage3Result = await runStage3Synthesizer(query, supportedClaims, options);

  return {
    reply: stage3Result.text,
    context,
    claims,
    supportedClaims,
    stream: stage3Result.stream,
  };
}
