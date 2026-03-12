/**
 * Returns all available HuggingFace API keys.
 * Tries HF_API_KEY_1, _2, _3, then falls back to HF_API_KEY.
 */
export function getHFKeys() {
  const keys = [
    process.env.HF_API_KEY_1,
    process.env.HF_API_KEY_2,
    process.env.HF_API_KEY_3,
    process.env.HF_API_KEY, // legacy fallback
  ].filter(Boolean);

  if (keys.length === 0) throw new Error('No HuggingFace API keys configured');
  return keys;
}

/**
 * Calls fn(key) with each key in turn.
 * If a call returns 429, tries the next key.
 * Returns the last response if all keys are exhausted.
 */
export async function withHFRotation(fn) {
  const keys = getHFKeys();
  let lastResponse;
  for (const key of keys) {
    const response = await fn(key);
    if (response.status !== 429) return response;
    lastResponse = response;
  }
  return lastResponse; // all exhausted, return 429 response
}