import { z } from "zod";

import { extractOnPageSignals } from "@/lib/html-seo-signals";
import { assertPublicHttpUrl, fetchHtmlLimited } from "@/lib/url-safety";

const frameworkDoc = `## SEO workstreams (use to organize recommendations)

### Technical & crawl
Indexability (robots, canonicals, status codes), sitemaps, redirects, hreflang, JS rendering risks, structured data validity.

### On-page & IA
Title/meta, H1/H2 outline, internal links, anchor text, thin/duplicate content, E-E-A-T signals where relevant.

### Performance & CWV
LCP/INP/CLS at field + lab; prioritize fixes that move real users.

### Measurement
GA4 events, conversions, Search Console coverage & queries, experiments.

### Authority & discovery (when in scope)
Brand SERP, backlinks, PR — only when the user asks or it clearly blocks goals.
`;

export const seoAgentTools = {
  analyze_public_page: {
    description:
      "Fetch a public http(s) page and extract on-page SEO signals (title, meta description, canonical, robots, H1, Open Graph, lang, viewport). Use when the user provides a URL to audit. Refuses private/local hosts.",
    inputSchema: z.object({
      url: z.string().describe("Absolute URL, e.g. https://example.com/pricing"),
    }),
    execute: async ({ url }: { url: string }) => {
      const safe = assertPublicHttpUrl(url);
      const { finalUrl, status, contentType, html } = await fetchHtmlLimited(safe);
      const signals = extractOnPageSignals(html, {
        finalUrl,
        status,
        contentType,
      });
      return signals;
    },
  },

  seo_workstream_framework: {
    description:
      "Return the canonical MenteMaestra SEO workstream map (pillars + what belongs in each). Call when planning a full audit, a remediation roadmap, or aligning tasks with stakeholders.",
    inputSchema: z.object({
      focus: z
        .enum(["all", "technical", "onpage", "performance", "measurement"])
        .optional()
        .describe("Optional slice; default all pillars."),
    }),
    execute: async ({ focus }: { focus?: "all" | "technical" | "onpage" | "performance" | "measurement" }) => {
      const f = focus ?? "all";
      if (f === "all") return { focus: f, markdown: frameworkDoc };

      const needle =
        f === "technical"
          ? "Technical"
          : f === "onpage"
            ? "On-page"
            : f === "performance"
              ? "Performance"
              : "Measurement";

      const blocks = frameworkDoc.split(/(?=\n### )/);
      const picked = blocks.find((b) => b.includes(needle));
      return { focus: f, markdown: picked?.trim() || frameworkDoc };
    },
  },
} as const;
