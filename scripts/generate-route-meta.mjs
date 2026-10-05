/**
 * Post-build step: bakes per-route metadata into static HTML files.
 *
 * The site is a client-rendered SPA, so share crawlers (Facebook, WhatsApp,
 * X, iMessage, Slack — none of which execute JavaScript) only ever see the
 * HTML that ships. This script writes dist/<route>/index.html for every
 * route in src/lib/pageMeta.js with that route's title, description,
 * canonical, and OG/Twitter tags substituted into the built index.html.
 *
 * Most static hosts serve these automatically (dist/donate/index.html is
 * served for /donate). Hosts without directory-index fallback should also
 * add a rewrite rule to serve the matching file — see REDESIGN_PLAN.md.
 *
 * Run automatically after `npm run build` (see package.json).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_NAME,
  SITE_TAGLINE,
  ORIGIN,
  DEFAULT_IMAGE,
  IMAGE_ALT,
  DEFAULT_DESCRIPTION,
  PAGE_META,
} from "../src/lib/pageMeta.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const builtHtml = readFileSync(join(dist, "index.html"), "utf8");

/** Escape a value for safe interpolation into a double-quoted attribute. */
const esc = (v) =>
  String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/**
 * Whitespace-tolerant substitutions for the built HTML. Vite reflows
 * multi-attribute tags onto several lines, so each rule matches the tag
 * by its identifying attribute, then swaps only the value of the
 * attribute that carries the metadata.
 */
function metaReplacements({ title, description, path }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const url = `${ORIGIN}${path}`;
  const imageUrl = `${ORIGIN}${DEFAULT_IMAGE}`;
  const swap = (value) => (_match, head, tail) => `${head}${esc(value)}${tail}`;
  return [
    [/<title>[\s\S]*?<\/title>/, () => `<title>${esc(fullTitle)}</title>`],
    [/([\s\S]*name="description"[\s\S]*?content=")[^"]*(")/, swap(description)],
    [/([\s\S]*property="og:title"[\s\S]*?content=")[^"]*(")/, swap(fullTitle)],
    [/([\s\S]*property="og:description"[\s\S]*?content=")[^"]*(")/, swap(description)],
    [/([\s\S]*property="og:url"[\s\S]*?content=")[^"]*(")/, swap(url)],
    [/([\s\S]*property="og:image"[\s\S]*?content=")[^"]*(")/, swap(imageUrl)],
    [/([\s\S]*property="og:image:alt"[\s\S]*?content=")[^"]*(")/, swap(IMAGE_ALT)],
    [/([\s\S]*name="twitter:title"[\s\S]*?content=")[^"]*(")/, swap(fullTitle)],
    [/([\s\S]*name="twitter:description"[\s\S]*?content=")[^"]*(")/, swap(description)],
    [/([\s\S]*name="twitter:image"[\s\S]*?content=")[^"]*(")/, swap(imageUrl)],
    [/([\s\S]*rel="canonical"[\s\S]*?href=")[^"]*(")/, swap(url)],
  ];
}

let written = 0;
for (const [path, meta] of Object.entries(PAGE_META)) {
  let html = builtHtml;
  for (const [pattern, replace] of metaReplacements({ ...meta, path })) {
    if (!pattern.test(html)) {
      throw new Error(`generate-route-meta: pattern not found for ${path}: ${pattern}`);
    }
    html = html.replace(pattern, replace);
  }
  const outDir = join(dist, path.replace(/^\//, "").replace(/\/$/, "") || ".");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  written += 1;
  console.log(`  ${path} → ${join(outDir, "index.html").replace(root + "\\", "")}`);
}

console.log(`generate-route-meta: wrote per-route metadata for ${written} routes.`);
