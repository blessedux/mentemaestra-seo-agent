import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";

import { isLlmConfigured } from "@/lib/llm-config";
import { getSeoAgentModel } from "@/lib/model";
import { SEO_AGENT_SYSTEM } from "@/lib/seo-agent/system-prompt";
import { seoAgentTools } from "@/lib/seo-agent/tools";

export const maxDuration = 60;

const LLM_MISSING_BODY = {
  code: "LLM_NOT_CONFIGURED" as const,
  error:
    "No OPENROUTER_API_KEY or OPENAI_API_KEY in process.env. Prefer OPENROUTER_API_KEY (defaults to a :free model). Add mentemaestra-seo-agent/.env.local or frontend/.env.local, then restart `next dev`.",
};

export async function POST(req: Request) {
  let body: { messages: UIMessage[] };
  try {
    body = (await req.json()) as { messages: UIMessage[] };
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages)) {
    return new Response("Expected messages array", { status: 400 });
  }

  if (!isLlmConfigured()) {
    return NextResponse.json(LLM_MISSING_BODY, { status: 503 });
  }

  try {
    const modelMessages = await convertToModelMessages(messages, {
      tools: seoAgentTools,
    });

    const result = streamText({
      model: getSeoAgentModel(),
      system: SEO_AGENT_SYSTEM,
      messages: modelMessages,
      tools: seoAgentTools,
      temperature: 0.25,
      maxOutputTokens: 2_048,
      maxRetries: 0,
      stopWhen: stepCountIs(12),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const isConfig = /OPENAI_API_KEY|OPENROUTER_API_KEY|No LLM configured/.test(
      message,
    );
    if (isConfig) {
      return NextResponse.json({ ...LLM_MISSING_BODY, detail: message }, { status: 503 });
    }
    console.error("[api/chat]", err);
    return NextResponse.json({ code: "CHAT_ERROR", error: message }, { status: 500 });
  }
}
