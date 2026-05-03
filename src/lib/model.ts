import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

import {
  DEFAULT_OPENROUTER_SEO_MODEL,
  openRouterSeoModelIdFromEnv,
} from "@/lib/openrouter-seo-models";

function openRouterProvider() {
  const referer =
    process.env.OPENROUTER_HTTP_REFERER?.trim() ?? "http://localhost:3040";
  const title =
    process.env.OPENROUTER_APP_TITLE?.trim() ?? "MenteMaestra SEO Agent";
  return createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
    headers: {
      "HTTP-Referer": referer,
      "X-Title": title,
    },
  });
}

/**
 * Chat model for `streamText`. **OpenRouter is the primary source** (default:
 * a `:free` model). Falls back to OpenAI only when OpenRouter is not configured.
 * Uses `.chat()` on OpenRouter for Chat Completions + streaming compatibility.
 */
export function getSeoAgentModel(): LanguageModel {
  const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (openrouterKey) {
    const modelId = openRouterSeoModelIdFromEnv();
    return openRouterProvider().chat(modelId);
  }

  if (openaiKey) {
    const modelId =
      process.env.SEO_AGENT_MODEL?.trim() ?? "gpt-4o-mini";
    return createOpenAI({ apiKey: openaiKey })(modelId);
  }

  throw new Error(
    "No LLM configured. Set OPENROUTER_API_KEY (recommended; defaults to a free model) or OPENAI_API_KEY — see .env.example.",
  );
}

export { DEFAULT_OPENROUTER_SEO_MODEL };
