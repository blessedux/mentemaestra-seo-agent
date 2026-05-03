import "server-only";

/** True when OpenRouter or OpenAI key is present (OpenRouter is the intended default). */
export function isLlmConfigured(): boolean {
  return Boolean(
    process.env.OPENROUTER_API_KEY?.trim() ||
      process.env.OPENAI_API_KEY?.trim(),
  );
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}
