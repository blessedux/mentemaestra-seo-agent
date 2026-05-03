import { NextResponse } from "next/server";

import { isLlmConfigured, isOpenRouterConfigured } from "@/lib/llm-config";
import { DEFAULT_OPENROUTER_SEO_MODEL, openRouterSeoModelIdFromEnv } from "@/lib/openrouter-seo-models";

export function GET() {
  const openai = Boolean(process.env.OPENAI_API_KEY?.trim());
  const openrouter = Boolean(process.env.OPENROUTER_API_KEY?.trim());
  const usingOpenRouter = isOpenRouterConfigured();
  return NextResponse.json({
    ok: isLlmConfigured(),
    providers: { openai, openrouter },
    primary: usingOpenRouter ? "openrouter" : openai ? "openai" : "none",
    openRouterModel: usingOpenRouter ? openRouterSeoModelIdFromEnv() : null,
    openRouterDefaultFreeModel: DEFAULT_OPENROUTER_SEO_MODEL,
  });
}
