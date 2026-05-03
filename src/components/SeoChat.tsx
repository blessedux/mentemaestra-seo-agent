"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useState } from "react";
import { AgentPreloader } from "@/components/AgentPreloader";

function JsonPreview({ value }: { value: unknown }) {
  return (
    <pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 font-mono text-xs text-zinc-400">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function assistantHasRenderableContent(messages: UIMessage[]): boolean {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant") return false;
  for (const part of last.parts) {
    if (part.type === "text" && (part.text?.trim()?.length ?? 0) > 0) {
      return true;
    }
    if (
      part.type.startsWith("tool-") &&
      "state" in part &&
      (part.state === "output-available" || part.state === "output-error")
    ) {
      return true;
    }
  }
  return false;
}

export function SeoChat() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const [llmReady, setLlmReady] = useState<boolean | null>(null);

  const lastMessage = messages[messages.length - 1];
  const lastMessageId = lastMessage?.id;

  const showMainPreloader = useMemo(() => {
    if (lastMessage?.role === "assistant") return false;
    if (status === "submitted") return true;
    if (status === "streaming" && !assistantHasRenderableContent(messages)) {
      return true;
    }
    return false;
  }, [status, messages, lastMessage?.role]);

  /** Full turn preloader: stays until the stream ends (SEO opportunities + prose done). */
  const showAssistantTurnPreloader =
    lastMessage?.role === "assistant" &&
    (status === "streaming" || status === "submitted");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then((r) => r.json() as Promise<{ ok: boolean }>)
      .then((d) => {
        if (!cancelled) setLlmReady(Boolean(d.ok));
      })
      .catch(() => {
        if (!cancelled) setLlmReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl flex-col">
        <header className="mb-8 flex items-baseline justify-between gap-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
              MenteMaestra · SEO
            </p>
            <h1 className="text-2xl font-semibold text-zinc-50">SEO Agent</h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              On-page signals, an SEO workstream framework, priorities, and
              implementation steps. Paste a public URL for a live HTML header
              pass.
            </p>
            {llmReady === false && (
              <div
                className="mt-4 rounded-xl border border-amber-900/40 bg-amber-900/10 p-4 text-sm text-amber-200"
                role="status"
              >
                <strong className="font-medium text-amber-100">
                  LLM not configured.
                </strong>{" "}
                Set{" "}
                <code className="rounded bg-black/40 px-1">OPENROUTER_API_KEY</code>{" "}
                (default model <code className="rounded bg-black/40 px-1">:free</code>
                ) or <code className="rounded bg-black/40 px-1">OPENAI_API_KEY</code> in{" "}
                <code className="rounded bg-black/40 px-1">
                  mentemaestra-seo-agent/.env.local
                </code>{" "}
                or <code className="rounded bg-black/40 px-1">frontend/.env.local</code>
                , then <strong>restart</strong>{" "}
                <code className="rounded bg-black/40 px-1">npm run dev</code>.{" "}
                <a className="underline decoration-amber-500/60 underline-offset-2" href="/api/health">
                  /api/health
                </a>
                .
              </div>
            )}
          </div>
          <p className="shrink-0 text-xs text-zinc-500">
            {llmReady === null ? "…" : llmReady ? "LLM ready" : "LLM pending"}
          </p>
        </header>

        <section className="mb-6">
          <h2 className="mb-3 text-xs uppercase tracking-[0.14em] text-zinc-500">
            Conversation
          </h2>
          <div className="flex flex-1 flex-col gap-3">
            {messages.length === 0 ? (
              <p className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-400">
                Type a request below (for example: audit a URL or prioritize SEO
                improvements).
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl border px-4 py-3 ${
                    message.role === "user"
                      ? "ml-6 border-zinc-800 bg-zinc-900/50 sm:ml-12"
                      : "mr-2 border-zinc-800 bg-zinc-950/60 sm:mr-6"
                  }`}
                >
                  <p className="mb-2 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    {message.role === "user" ? "You" : "Agent"}
                  </p>
                  <div className="space-y-2 text-sm leading-relaxed text-zinc-200">
                    {message.role === "assistant" &&
                      message.id === lastMessageId &&
                      showAssistantTurnPreloader && (
                        <div
                          className="mb-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 text-foreground"
                          role="status"
                          aria-live="polite"
                          aria-busy="true"
                        >
                          <AgentPreloader
                            variant="mentemaestra"
                            showProgress
                            title="Mentemaestra"
                            subtitle="Generating SEO opportunities — snapshot, workstreams, and recommendations."
                          />
                        </div>
                      )}

                    {message.parts.map((part, index) => {
                      const hideInlineToolLoader =
                        message.role === "assistant" &&
                        message.id === lastMessageId &&
                        showAssistantTurnPreloader;

                      if (part.type === "text") {
                        return (
                          <p key={index} className="whitespace-pre-wrap">
                            {part.text}
                          </p>
                        );
                      }

                      if (part.type === "tool-analyze_public_page") {
                        const id = part.toolCallId;
                        const url =
                          (part.input as { url?: string } | undefined)?.url ??
                          "";
                        switch (part.state) {
                          case "input-streaming":
                            if (hideInlineToolLoader) return null;
                            return (
                              <div key={id}>
                                <AgentPreloader
                                  variant="compact"
                                  title="Analyzing domain"
                                  subtitle="Reading URL…"
                                />
                              </div>
                            );
                          case "input-available":
                            if (hideInlineToolLoader) return null;
                            return (
                              <div key={id}>
                                <AgentPreloader
                                  variant="compact"
                                  title="Analyzing domain"
                                  subtitle={
                                    url
                                      ? `Fetching ${url}`
                                      : "Downloading page…"
                                  }
                                />
                              </div>
                            );
                          case "output-available":
                            return (
                              <div key={id}>
                                <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                                  On-page snapshot
                                </p>
                                <JsonPreview value={part.output} />
                              </div>
                            );
                          case "output-error":
                            return (
                              <div key={id} className="text-red-400">
                                {part.errorText}
                              </div>
                            );
                          default:
                            return null;
                        }
                      }

                      if (part.type === "tool-seo_workstream_framework") {
                        const id = part.toolCallId;
                        switch (part.state) {
                          case "input-streaming":
                            if (hideInlineToolLoader) return null;
                            return (
                              <div key={id}>
                                <AgentPreloader
                                  variant="compact"
                                  title="SEO workstreams"
                                  subtitle="Loading framework…"
                                />
                              </div>
                            );
                          case "input-available":
                            if (hideInlineToolLoader) return null;
                            return (
                              <div key={id}>
                                <AgentPreloader
                                  variant="compact"
                                  title="SEO workstreams"
                                  subtitle="Resolving pillars…"
                                />
                              </div>
                            );
                          case "output-available":
                            return (
                              <div key={id}>
                                <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                                  SEO workstreams
                                </p>
                                <JsonPreview value={part.output} />
                              </div>
                            );
                          case "output-error":
                            return (
                              <div key={id} className="text-red-400">
                                {part.errorText}
                              </div>
                            );
                          default:
                            return null;
                        }
                      }

                      return null;
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {showMainPreloader && (
            <div
              className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 text-foreground"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <AgentPreloader
                variant="mentemaestra"
                showProgress
                title="Mentemaestra"
                subtitle="Crawl, snapshot, and on-page signals for your domain."
              />
            </div>
          )}
        </section>

        {error && (
          <div className="mb-4 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-200">
            <span className="block">
              {error.message ||
                "Request failed (503 if the API key is missing — see the notice above)."}
            </span>
            <button
              type="button"
              className="mt-2 text-xs uppercase tracking-[0.12em] text-red-300 underline underline-offset-2"
              onClick={() => regenerate()}
            >
              Retry
            </button>
          </div>
        )}

        <section className="mt-auto border-t border-zinc-900 pt-6">
          <h2 className="mb-3 text-xs uppercase tracking-[0.14em] text-zinc-500">
            Message
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim() || status !== "ready") return;
              sendMessage({ text: input });
              setInput("");
            }}
            className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
          >
            <input
              className="min-h-[44px] flex-1 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none ring-primary placeholder:text-zinc-500 focus:ring-2 focus:ring-primary/40"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
              placeholder="e.g. Audit https://example.com for snippet and on-page"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={status !== "ready" || !input.trim()}
                className="min-h-[44px] rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-95 disabled:opacity-40"
              >
                Send
              </button>
              {(status === "streaming" || status === "submitted") && (
                <button
                  type="button"
                  className="min-h-[44px] rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900/70"
                  onClick={() => stop()}
                >
                  Stop
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
