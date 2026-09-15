import { GoogleGenAI } from '@google/genai';

const MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

const TIMEOUT_MS = 20000;

export async function generateContentWithFallback(params: {
  contents: any[];
  config?: any;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    console.log(`[Gemini Helper] Trying model: ${model}`);
    
    let timerId: NodeJS.Timeout;
    
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
          reject(new Error(`Timeout of ${TIMEOUT_MS}ms exceeded for model ${model}`));
        }, TIMEOUT_MS);
      });

      const generatePromise = ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      // Race between the actual API call and the timeout
      const response = await Promise.race([generatePromise, timeoutPromise]) as any;
      
      clearTimeout(timerId!);
      console.log(`[Gemini Helper] Success with model: ${model}`);
      return response;
    } catch (error: any) {
      clearTimeout(timerId!);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Gemini Helper] Model ${model} failed: [${errorMessage}], trying next...`);
      
      // If it's the last model in the list, throw the error
      if (i === MODELS.length - 1) {
        console.error('[Gemini Helper] All fallback models exhausted. Failing request.');
        throw new Error(`All Gemini models failed to generate content. Last error: ${errorMessage}`);
      }
    }
  }
}
