import OpenAI from 'openai';
import Groq from 'groq-sdk';

/**
 * Universal EgyptX AI Client
 * Primary: OpenRouter with OpenAI SDK (openai/gpt-4o-mini)
 * Resilient Fallback: Groq SDK (openai/gpt-oss-120b, qwen/qwen3.8-27b)
 */

export function getOpenRouterClient(): OpenAI | null {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://egyptx-ai.vercel.app',
      'X-Title': 'EgyptX AI',
    },
  });
}

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export function getGroqOpenAIClient(): OpenAI | null {
  const apiKey =
    process.env.GROQ_API_KEY || (process.env as any)['\uFEFFGROQ_API_KEY'];
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}

export function getGroqClient(): Groq | null {
  const apiKey =
    process.env.GROQ_API_KEY || (process.env as any)['\uFEFFGROQ_API_KEY'];
  if (!apiKey) return null;
  return new Groq({ apiKey });
}

export interface ChatCompletionOptions {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: any }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
  model?: string;
}

export async function createUniversalChatCompletion(options: ChatCompletionOptions): Promise<string> {
  const targetModel = options.model || 'openai/gpt-4o-mini';
  const openRouter = getOpenRouterClient();

  const sanitizeGemDate = (text: string) =>
    text
      .replace(/16\s*فبراير\s*2023/g, '1 نوفمبر 2025')
      .replace(/فبراير\s*2023/g, '1 نوفمبر 2025')
      .replace(/مارس\s*2023/g, '1 نوفمبر 2025')
      .replace(/February\s*16,?\s*2023/gi, 'November 1, 2025')
      .replace(/Feb\s*16,?\s*2023/gi, 'November 1, 2025')
      .replace(/March\s*2023/gi, 'November 1, 2025');

  // 1. Primary: OpenRouter (openai/gpt-4o-mini)
  if (openRouter) {
    try {
      const response = await openRouter.chat.completions.create({
        model: targetModel,
        messages: options.messages as any,
        temperature: options.temperature ?? 0.0,
        max_tokens: options.max_tokens ?? 2000,
        ...(options.response_format ? { response_format: options.response_format } : {}),
      });

      const content = response.choices?.[0]?.message?.content;
      if (content) {
        return sanitizeGemDate(content);
      }
    } catch (err: any) {
      console.warn('[AI Client] OpenRouter call failed, attempting resilient fallback:', err?.message || err);
    }
  }

  // 2. Resilient High-Speed Fallback via OpenAI SDK: Groq (openai/gpt-oss-120b)
  const groqOpenAI = getGroqOpenAIClient();
  if (groqOpenAI) {
    try {
      const response = await groqOpenAI.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: options.messages as any,
        temperature: options.temperature ?? 0.0,
        max_tokens: options.max_tokens ?? 2000,
        ...(options.response_format ? { response_format: options.response_format } : {}),
      });

      const content = response.choices?.[0]?.message?.content;
      if (content) {
        return sanitizeGemDate(content);
      }
    } catch (groqErr: any) {
      console.error('[AI Client] Groq fallback error:', groqErr?.message || groqErr);
    }
  }

  throw new Error('All AI service providers are currently unreachable.');
}
