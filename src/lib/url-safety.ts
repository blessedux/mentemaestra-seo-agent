const MAX_HTML_BYTES = 600_000;
const FETCH_TIMEOUT_MS = 12_000;

function isPrivateHostname(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0") return true;

  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (!m) return false;
  const oct = m.slice(1, 5).map((x) => Number(x));
  if (oct.some((n) => n > 255)) return true;
  const [a, b] = oct;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

/**
 * Restricts server-side fetches to public http(s) URLs to reduce SSRF risk.
 * This is not a complete SSRF defense; run behind auth in production.
 */
export function assertPublicHttpUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("Invalid URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }
  if (isPrivateHostname(url.hostname)) {
    throw new Error("Private or local hosts are not allowed");
  }
  if (url.username || url.password) {
    throw new Error("Credentials in URL are not allowed");
  }
  return url;
}

export async function fetchHtmlLimited(url: URL): Promise<{
  finalUrl: string;
  status: number;
  contentType: string | null;
  html: string;
}> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "MenteMaestraSEOAgent/0.1 (+https://mentemaestra.cl)",
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
    const buf = new Uint8Array(await res.arrayBuffer());
    const slice = buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
    const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);
    return {
      finalUrl: res.url,
      status: res.status,
      contentType: res.headers.get("content-type"),
      html,
    };
  } finally {
    clearTimeout(t);
  }
}
