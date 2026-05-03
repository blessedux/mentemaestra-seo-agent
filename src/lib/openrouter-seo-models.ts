/**
 * Default OpenRouter chat model for the SEO agent (`:free` tier).
 * Override with `SEO_AGENT_MODEL` (any OpenRouter model id you have access to).
 *
 * Other free-tier examples: `meta-llama/llama-3.2-3b-instruct:free`,
 * `google/gemma-2-9b-it:free`, `mistralai/mistral-7b-instruct:free`.
 */
export const DEFAULT_OPENROUTER_SEO_MODEL =
  "nvidia/nemotron-3-super-120b-a12b:free" as const;

export function openRouterSeoModelIdFromEnv(): string {
  return process.env.SEO_AGENT_MODEL?.trim() || DEFAULT_OPENROUTER_SEO_MODEL;
}
