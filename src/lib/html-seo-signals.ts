export type OnPageSeoSignals = {
  finalUrl: string;
  httpStatus: number;
  contentType: string | null;
  title: string | null;
  metaDescription: string | null;
  canonicalHref: string | null;
  robots: string | null;
  h1: string | null;
  h1Count: number;
  ogTitle: string | null;
  ogDescription: string | null;
  lang: string | null;
  charsetMeta: string | null;
  viewportMeta: string | null;
  approximateHtmlChars: number;
  notes: string[];
};

function decodeBasicEntities(s: string): string {
  return s
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContentByName(html: string, name: string): string | null {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const a = new RegExp(
    `<meta\\s+[^>]*name=["']${esc}["'][^>]*content=["']([^"']*)["']`,
    "i",
  ).exec(html);
  if (a?.[1]) return decodeBasicEntities(a[1]);
  const b = new RegExp(
    `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${esc}["']`,
    "i",
  ).exec(html);
  return b?.[1] ? decodeBasicEntities(b[1]) : null;
}

function metaPropertyContent(html: string, prop: string): string | null {
  const esc = prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const a = new RegExp(
    `<meta\\s+[^>]*property=["']${esc}["'][^>]*content=["']([^"']*)["']`,
    "i",
  ).exec(html);
  if (a?.[1]) return decodeBasicEntities(a[1]);
  const b = new RegExp(
    `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*property=["']${esc}["']`,
    "i",
  ).exec(html);
  return b?.[1] ? decodeBasicEntities(b[1]) : null;
}

function firstTagContent(html: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = re.exec(html);
  if (!m?.[1]) return null;
  const inner = m[1].replace(/<[^>]+>/g, " ");
  const t = decodeBasicEntities(inner);
  return t.length ? t : null;
}

function countTagOpens(html: string, tag: string): number {
  const re = new RegExp(`<${tag}\\b`, "gi");
  return (html.match(re) ?? []).length;
}

function canonicalHrefFrom(html: string): string | null {
  const tag = /<link[^>]*rel=["']canonical["'][^>]*>/i.exec(html)?.[0];
  if (!tag) return null;
  const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
  return href ? decodeBasicEntities(href) : null;
}

export function extractOnPageSignals(
  html: string,
  meta: { finalUrl: string; status: number; contentType: string | null },
): OnPageSeoSignals {
  const notes: string[] = [];
  const head = html.slice(0, Math.min(html.length, 400_000));

  const title = firstTagContent(head, "title");
  const metaDesc = metaContentByName(head, "description");
  const canonicalHref = canonicalHrefFrom(head);
  const robots = metaContentByName(head, "robots");

  const h1Count = countTagOpens(head, "h1");
  const h1 = firstTagContent(head, "h1");

  const ogTitle = metaPropertyContent(head, "og:title");
  const ogDescription = metaPropertyContent(head, "og:description");

  const htmlOpen = /<html[^>]*>/i.exec(head)?.[0];
  const lang = htmlOpen
    ? /lang=["']([^"']+)["']/i.exec(htmlOpen)?.[1]?.trim() ?? null
    : null;

  const charsetMeta =
    /<meta[^>]+charset\s*=\s*["']?([^"'>\s]+)/i.exec(head)?.[1]?.trim() ?? null;
  const viewportMeta = metaContentByName(head, "viewport");

  if (!title) notes.push("Missing <title> in sampled HTML.");
  if (!metaDesc) notes.push("Missing meta name=description.");
  if (h1Count === 0) notes.push("No <h1> found in sampled HTML.");
  if (h1Count > 1)
    notes.push("Multiple <h1> tags — usually consolidate to one primary H1.");
  if (!canonicalHref) notes.push("No rel=canonical link found in head sample.");
  if (!viewportMeta)
    notes.push(
      "No viewport meta — critical for mobile UX and Core Web Vitals context.",
    );

  return {
    finalUrl: meta.finalUrl,
    httpStatus: meta.status,
    contentType: meta.contentType,
    title,
    metaDescription: metaDesc,
    canonicalHref,
    robots,
    h1,
    h1Count,
    ogTitle,
    ogDescription,
    lang,
    charsetMeta,
    viewportMeta,
    approximateHtmlChars: html.length,
    notes,
  };
}
