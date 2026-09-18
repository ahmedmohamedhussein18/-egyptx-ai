import Groq from 'groq-sdk';

const MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b"
];

const TIMEOUT_MS = 20000;

export async function generateContentWithFallback(params: {
  messages: any[];
  config?: any;
}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  const groq = new Groq({ apiKey });

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    console.log(`[Groq Helper] Trying model: ${model}`);
    
    let timerId: NodeJS.Timeout;
    
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
          reject(new Error(`Timeout of ${TIMEOUT_MS}ms exceeded for model ${model}`));
        }, TIMEOUT_MS);
      });

      const completionPromise = groq.chat.completions.create({
        model,
        messages: params.messages,
        ...params.config
      });

      // Race between the actual API call and the timeout
      const response = await Promise.race([completionPromise, timeoutPromise]) as any;
      
      clearTimeout(timerId!);
      console.log(`[Groq Helper] Success with model: ${model}`);
      return response;
    } catch (error: any) {
      clearTimeout(timerId!);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Groq Helper] Model ${model} failed: [${errorMessage}], trying next...`);
      
      // If it's the last model in the list, throw the error
      if (i === MODELS.length - 1) {
        console.error('[Groq Helper] All fallback models exhausted. Failing request.');
        throw new Error(`All Groq models failed. Last error: ${errorMessage}`);
      }
    }
  }
}
