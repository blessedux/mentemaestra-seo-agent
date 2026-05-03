# MenteMaestra SEO Agent

Standalone [Next.js](https://nextjs.org) app built with the [Vercel AI SDK](https://ai-sdk.dev): an SEO copilot that combines **on-page signal extraction**, a **structured workstream map**, **prioritized recommendations**, and **guided implementation steps** in chat.

This folder is designed so you can **copy it to a new GitHub repository** as an independent product (see [docs/PUBLISHING.md](./docs/PUBLISHING.md)).

## Features

- **Streaming chat** via `streamText` + `toUIMessageStreamResponse` and `useChat` (`@ai-sdk/react`).
- **`analyze_public_page` tool**: server-side fetch with basic SSRF guards; extracts title, meta description, canonical, robots, H1 count/text, Open Graph, `lang`, charset, viewport.
- **`seo_workstream_framework` tool**: returns the MenteMaestra-style pillar map (technical, on-page, CWV, measurement, authority) for roadmap conversations.
- **Multi-step tool use** via `stopWhen: stepCountIs(12)` so the model can call tools and continue in one turn.

## Quick start

```bash
cd mentemaestra-seo-agent
cp .env.example .env.local
# Set OPENROUTER_API_KEY (recommended). Default chat model is a :free OpenRouter model.

npm install
npm run dev
```

In this monorepo, **`OPENROUTER_API_KEY`** is often already in **`frontend/.env.local`**. Env files are merged in `next.config.mjs` — **restart** the SEO agent dev server after changes. [http://localhost:3040/api/health](http://localhost:3040/api/health) shows `primary: "openrouter"`, `openRouterModel`, and `ok: true` when configured.

Open [http://localhost:3040](http://localhost:3040).

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | **Recommended** | Primary provider; default model is `nvidia/nemotron-3-super-120b-a12b:free` |
| `OPENAI_API_KEY` | Fallback | Used only if `OPENROUTER_API_KEY` is unset |
| `SEO_AGENT_MODEL` | No | OpenRouter or OpenAI model id; OpenRouter default is the free Nemotron id above |
| `OPENROUTER_HTTP_REFERER` | No | Referer header for OpenRouter |
| `OPENROUTER_APP_TITLE` | No | `X-Title` for OpenRouter |

## Deploy (Vercel)

1. Push the extracted repo to GitHub and import the project in Vercel.
2. Set the same environment variables in the Vercel project settings.
3. Ensure the deployment region and any **outbound fetch** policies allow the agent to request user-supplied URLs (or add authentication and rate limits before production).

## Security notes

- URL fetching is intended for **public** pages only; private IP ranges and `localhost` are blocked in code, but **URL fetch from a shared server is never fully SSRF-proof** without additional network controls.
- Add **auth**, **rate limiting**, and **logging** before exposing broadly on the internet.

## Docs

- [Publishing as its own repo](./docs/PUBLISHING.md)
- [Architecture](./docs/ARCHITECTURE.md)

## License

MIT — see [LICENSE](./LICENSE). Dependencies (including `ai` and provider packages) remain under their respective licenses.
