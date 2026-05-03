# Architecture

## Stack

- **Next.js 15** (App Router): UI + API route.
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`): streaming, tools, chat transport.
- **Zod 4**: tool `inputSchema` definitions.

## Environment

`next.config.mjs` loads dotenv files in order (each overrides the previous): `../frontend/.env`, `../frontend/.env.local`, then this package’s `.env` / `.env.local`. That way a monorepo `OPENROUTER_API_KEY` in `frontend/.env.local` is visible to this app **after a dev-server restart**. Production (e.g. Vercel) should set env vars on the project instead.

**LLM:** OpenRouter is preferred when `OPENROUTER_API_KEY` is set. Default OpenRouter model is **`nvidia/nemotron-3-super-120b-a12b:free`** (`SEO_AGENT_MODEL` overrides).

## Request path

1. `src/components/SeoChat.tsx` — client `useChat` with `DefaultChatTransport` posting to `/api/chat`.
2. `src/app/api/chat/route.ts` — parses `UIMessage[]`, `convertToModelMessages` (with the same tool definitions), `streamText` with `seoAgentTools`, returns `toUIMessageStreamResponse()`.
3. `src/lib/model.ts` — resolves OpenRouter vs OpenAI from env.
4. `src/lib/seo-agent/tools.ts` — tool implementations; on-page analysis uses `src/lib/url-safety.ts` and `src/lib/html-seo-signals.ts`.

## Why `stopWhen: stepCountIs(12)`?

In AI SDK v6, `streamText` defaults to stopping after **one** model step (`stepCountIs(1)`). With tools, the model often needs a second (or third) step after tool results. Raising the step budget allows **analyze → reason → optional second tool → final answer** in one user turn.

## Extension points

- **Search Console / GA4 / PageSpeed**: add tools that call your APIs with OAuth or service accounts; keep secrets server-only.
- **Persistence**: store `messages` in Postgres or Vercel KV keyed by session id from `useChat` transport `body`.
- **Auth**: gate `POST /api/chat` with session/JWT and pass `userId` via `DefaultChatTransport` `body` or headers.
