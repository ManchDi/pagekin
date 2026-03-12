import { GoogleGenAI } from '@google/genai';

/**
 * Returns an array of GoogleGenAI instances from all available key env vars.
 * Tries GEMINI_API_KEY_1, _2, _3, then falls back to GEMINI_API_KEY.
 */
export function getGeminiClients() {
  const keys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY, // legacy fallback
  ].filter(Boolean);

  if (keys.length === 0) throw new Error('No Gemini API keys configured');
  return keys.map(key => new GoogleGenAI({ apiKey: key }));
}

/**
 * Calls fn(client) with each client in turn.
 * If a call throws a 429, tries the next key.
 * Throws the last error if all keys are exhausted.
 */
export async function withGeminiRotation(fn) {
  const clients = getGeminiClients();
  let lastError;
  for (const client of clients) {
    try {
      return await fn(client);
    } catch (error) {
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        lastError = error;
        continue; // try next key
      }
      throw error; // non-quota error, rethrow immediately
    }
  }
  // All keys exhausted
  const err = new Error('All API keys quota exceeded');
  err.status = 429;
  throw err;
}