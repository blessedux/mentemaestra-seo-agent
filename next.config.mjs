import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env before Next evaluates the rest of the config so API routes see keys.
// In the monorepo, OPENAI_API_KEY often lives in `frontend/.env.local` only.
const envChain = [
  path.join(__dirname, "..", "frontend", ".env"),
  path.join(__dirname, "..", "frontend", ".env.local"),
  path.join(__dirname, ".env"),
  path.join(__dirname, ".env.local"),
];
for (const file of envChain) {
  if (fs.existsSync(file)) {
    dotenv.config({ path: file, override: true });
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Monorepo sibling lockfiles can confuse file tracing; anchor to this package.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
