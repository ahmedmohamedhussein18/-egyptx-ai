/**
 * Grounded AI Guide: database retrieval + live web search exposed to the model as a tool.
 * Server-side only. temperature is always 0.0. The model must never answer from memory.
 */

import { getOpenRouterClient, getOpenAIClient } from '@/lib/ai-client';
import { retrieveContext, NO_VERIFIED_INFO_MESSAGE } from '@/lib/retrieval';
import { webSearch, isWebSearchConfigured } from '@/lib/webSearch';

export interface SourceRef {
  title: string;
  url: string;
}

const GEM_RULE =
  "If the user asks about the opening date of the Grand Egyptian Museum (المتحف المصري الكبير), you MUST strictly state that the official full opening date is November 1, 2025. NEVER output or invent dates like February 16, 2023.";

function languageInstruction(language: string): string {
  return `You MUST generate your entire response strictly in this language: ${language}. If the requested language is 'en', output completely in English. If 'ar', output in Arabic.`;
}

function groundingRules(language: string): string {
  return `You are the EgyptX AI Guide, an expert Egyptologist.
1) For every historical question or image analysis you MUST call the web_search tool first, then answer ONLY from the returned search results and the DATABASE CONTEXT (if any).
2) Never guess and never use unverified model memory. If neither source supports a detail, leave it out or say the sources do not state it.
3) Distinguish established facts from scholarly interpretations. Never invent names, dates, numbers or citations.
4) Ancient monuments (e.g. Luxor Temple, Karnak, the Pyramids) must be dated to their actual historical period as stated by the sources; never describe them as modern-era.
5) Give one coherent answer. Do NOT append generic fallback/apology sentences to an answer that already has content.
6) ${GEM_RULE}
7) ${languageInstruction(language)}`;
}

export function noInfoMessage(language: string): string {
  return language === 'ar'
    ? NO_VERIFIED_INFO_MESSAGE
    : 'I do not have verified information on this topic right now.';
}

export function sanitizeGemDate(text: string, language: string): string {
  const ar = language === 'ar' ? '1 نوفمبر 2025' : 'November 1, 2025';
  return text
    .replace(/16\s*فبراير\s*2023/g, ar)
    .replace(/فبراير\s*2023/g, ar)
    .replace(/مارس\s*2023/g, ar)
    .replace(/February\s*16,?\s*2023/gi, 'November 1, 2025')
    .replace(/Feb\s*16,?\s*2023/gi, 'November 1, 2025')
    .replace(/March\s*2023/gi, 'November 1, 2025');
}

function getClient(): { client: any; model: string } | null {
  const or = getOpenRouterClient();
  if (or) return { client: or, model: 'openai/gpt-4o-mini' };
  const oa = getOpenAIClient();
  if (oa) return { client: oa, model: 'gpt-4o-mini' };
  return null;
}

const WEB_SEARCH_TOOL = {
  type: 'function' as const,
  function: {
    name: 'web_search',
    description:
      'Search the live internet for factual information about an Egyptian monument, artifact, person or event. Returns titles, URLs and snippets.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'A focused search query (English or Arabic).' },
      },
      required: ['query'],
    },
  },
};

interface AgentResult {
  text: string;
  sources: SourceRef[];
  grounded: boolean;
}

async function runGroundedAgent(opts: {
  userContent: string;
  language: string;
  dbContext: string;
  json?: boolean;
}): Promise<AgentResult> {
  const searchOn = isWebSearchConfigured();
  const cli = getClient();
  if (!cli || (!searchOn && !opts.dbContext)) {
    return { text: '', sources: [], grounded: false };
  }

  const system = `${groundingRules(opts.language)}${
    opts.dbContext ? `\n\nDATABASE CONTEXT (verified):\n${opts.dbContext}` : ''
  }`;

  const messages: any[] = [
    { role: 'system', content: system },
    { role: 'user', content: opts.userContent },
  ];

  const sources: SourceRef[] = [];
  const seen = new Set<string>();
  let gotSearchResults = false;

  const base = {
    model: cli.model,
    temperature: 0.0,
    max_tokens: 1000,
  };

  if (searchOn) {
    for (let round = 0; round < 3; round++) {
      const resp = await cli.client.chat.completions.create({
        ...base,
        messages,
        tools: [WEB_SEARCH_TOOL],
        tool_choice: round === 0 ? 'required' : 'auto',
      });
      const msg = resp.choices?.[0]?.message;
      if (!msg) break;

      if (msg.tool_calls?.length) {
        messages.push(msg);
        for (const call of msg.tool_calls) {
          let query = '';
          try {
            query = JSON.parse(call.function.arguments || '{}').query || '';
          } catch {
            /* ignore malformed args */
          }
          const results = await webSearch(query, opts.language);
          for (const r of results) {
            if (r.url && !seen.has(r.url)) {
              seen.add(r.url);
              sources.push({ title: r.title, url: r.url });
            }
          }
          if (results.length) gotSearchResults = true;
          messages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: results.length ? JSON.stringify(results) : 'NO_RESULTS',
          });
        }
        continue;
      }

      // Model answered without (further) tool calls
      if (round > 0 || !msg.tool_calls) {
        if (!gotSearchResults && !opts.dbContext) break;
        return { text: (msg.content || '').trim(), sources, grounded: true };
      }
    }
  }

  if (!gotSearchResults && !opts.dbContext) {
    return { text: '', sources, grounded: false };
  }

  // Final synthesis without tools
  messages.push({
    role: 'user',
    content: 'Now write the final answer strictly from the search results and database context above.',
  });
  const final = await cli.client.chat.completions.create({
    ...base,
    messages,
    ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
  });
  return {
    text: (final.choices?.[0]?.message?.content || '').trim(),
    sources,
    grounded: true,
  };
}

async function getDbContext(query: string): Promise<{ text: string; verified: boolean }> {
  try {
    const retrieved = await retrieveContext(query);
    if (retrieved.hasVerifiedData) return { text: retrieved.rawText, verified: true };
  } catch (err) {
    console.warn('[GroundedGuide] DB retrieval warning');
  }
  return { text: '', verified: false };
}

/** Text question -> grounded answer. */
export async function answerGroundedQuestion(question: string, language: string) {
  const db = await getDbContext(question);
  const result = await runGroundedAgent({
    userContent: question,
    language,
    dbContext: db.text,
  });

  if (!result.grounded || !result.text) {
    return { reply: noInfoMessage(language), sources: result.sources, hasVerifiedData: db.verified };
  }
  return {
    reply: sanitizeGemDate(result.text, language),
    sources: result.sources,
    hasVerifiedData: db.verified,
  };
}

export interface VisionIdentity {
  identifiable: boolean;
  name_en: string;
  name_ar: string;
  visible_text: string;
}

/** Stage 1: identify what is in the image (no facts, just identification + OCR). */
export async function identifyImage(imageUrl: string): Promise<VisionIdentity | null> {
  const cli = getClient();
  if (!cli) return null;

  const system = `You are an expert Egyptologist analyzing web uploads.
1) OCR: Read any Arabic or other text in the image first. If it explicitly says 'المتحف المصري الكبير', you MUST identify it as the Grand Egyptian Museum.
2) Never output 'قصر محمد علي باشا' unless the architecture explicitly matches it.
3) Only identify what is clearly recognizable. If uncertain, set "identifiable" to false.
Return ONLY JSON: {"identifiable": boolean, "name_en": string, "name_ar": string, "visible_text": string}. Do not describe history.`;

  try {
    const resp = await cli.client.chat.completions.create({
      model: cli.model,
      temperature: 0.0,
      max_tokens: 300,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identify this image.' },
            { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
          ],
        },
      ],
    });
    const parsed = JSON.parse(resp.choices?.[0]?.message?.content || '{}');
    const visible = String(parsed.visible_text || '');
    const isGemText = visible.includes('المتحف المصري الكبير');
    return {
      identifiable: Boolean(parsed.identifiable) || isGemText,
      name_en: isGemText ? 'Grand Egyptian Museum' : String(parsed.name_en || ''),
      name_ar: isGemText ? 'المتحف المصري الكبير' : String(parsed.name_ar || ''),
      visible_text: visible,
    };
  } catch {
    return null;
  }
}

export interface GroundedVisionData {
  identified_name: string;
  description: string;
  person_or_king: string;
  era: string;
  location: string;
  meaning: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface GroundedVisionResult {
  status: 'ok' | 'uncertain';
  identity?: VisionIdentity;
  data?: GroundedVisionData;
  sources: SourceRef[];
  verified: boolean;
}

/** Stage 2+3: identify -> DB + live web search (tool) -> synthesize strictly from sources. */
export async function analyzeImageGrounded(
  imageUrl: string,
  language: string,
  userPrompt?: string
): Promise<GroundedVisionResult> {
  const identity = await identifyImage(imageUrl);
  if (!identity || !identity.identifiable || !(identity.name_en || identity.name_ar)) {
    return { status: 'uncertain', sources: [], verified: false };
  }

  const db = await getDbContext(`${identity.name_en} ${identity.name_ar}`.trim());
  const unknown = language === 'ar' ? 'غير مذكور في المصادر' : 'Not stated in sources';

  const userContent = `Identified subject: "${identity.name_en}" / "${identity.name_ar}". Text visible in image: "${identity.visible_text}".
${userPrompt ? `User question: ${userPrompt}\n` : ''}Search the web for this subject, then return ONLY a JSON object:
{"identified_name": string, "description": "2-4 sentences from sources", "person_or_king": string, "era": string, "location": string, "meaning": string, "confidence": "high"|"medium"|"low"}
Use "${unknown}" for any field the sources do not support. "era" must match the sources exactly.`;

  const result = await runGroundedAgent({
    userContent,
    language,
    dbContext: db.text,
    json: true,
  });

  if (!result.grounded || !result.text) {
    return { status: 'uncertain', identity, sources: result.sources, verified: db.verified };
  }

  try {
    const parsed = JSON.parse(result.text.replace(/```json/gi, '').replace(/```/g, '').trim());
    const clean = (v: any) => sanitizeGemDate(String(v || unknown), language);
    return {
      status: 'ok',
      identity,
      sources: result.sources,
      verified: db.verified,
      data: {
        identified_name: String(parsed.identified_name || (language === 'ar' ? identity.name_ar : identity.name_en)),
        description: clean(parsed.description),
        person_or_king: clean(parsed.person_or_king),
        era: clean(parsed.era),
        location: clean(parsed.location),
        meaning: clean(parsed.meaning),
        confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'low',
      },
    };
  } catch {
    return { status: 'uncertain', identity, sources: result.sources, verified: db.verified };
  }
}
