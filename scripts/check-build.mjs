/**
 * Validates the built site in dist/:
 *
 *   1. every internal link resolves to a page that exists
 *   2. every image/asset reference resolves to a real file
 *   3. links respect `trailingSlash: "always"` (a bare /blog costs a redirect
 *      hop in production, and 404s in dev)
 *   4. the route list matches what the content actually contains, so a
 *      renamed or dropped directory can't silently delete pages
 *   5. `_redirects` rules are valid for Cloudflare, and `_headers` shipped
 *   6. the sitemap lists every real page and no individual photo pages
 *
 * Run `npm run build` first, then `npm run check:build`.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const DIST = "dist";
const CONTENT = "src/content";

if (!existsSync(DIST)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(1);
}

const failures = [];
const fail = (msg) => failures.push(msg);

/** Recursively collect files under a directory. */
function walk(dir, filter) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path, filter));
    else if (filter(path)) out.push(path);
  }
  return out;
}

const pages = walk(DIST, (p) => p.endsWith(".html"));

// ---------------------------------------------------------------- routes ---

const expected = new Set(["/"]);
for (const p of ["about", "cookie-policy", "blog", "photography"]) {
  expected.add(`/${p}/`);
}
for (const slug of readdirSync(`${CONTENT}/blog`)) {
  if (existsSync(`${CONTENT}/blog/${slug}/index.md`))
    expected.add(`/blog/${slug}/`);
}
for (const gallery of readdirSync(`${CONTENT}/photography`)) {
  const dir = `${CONTENT}/photography/${gallery}`;
  if (!existsSync(`${dir}/index.md`)) continue;
  expected.add(`/photography/${gallery}/`);
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".jpg")) {
      expected.add(`/photography/${gallery}/${file.replace(/\.jpg$/, "")}/`);
    }
  }
}

const built = new Set(
  pages
    .filter((p) => p.endsWith("index.html"))
    .map((p) => p.slice(DIST.length).replace(/index\.html$/, "")),
);

for (const route of expected) {
  if (!built.has(route)) fail(`route missing from build: ${route}`);
}
for (const route of built) {
  if (!expected.has(route)) fail(`unexpected route in build: ${route}`);
}

if (!existsSync(`${DIST}/404.html`)) fail("404.html missing from build");

// ------------------------------------------------------------ references ---

/** Does a site-absolute URL path resolve to something in dist/? */
function resolves(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const target = join(DIST, clean);
  if (existsSync(target)) {
    return statSync(target).isDirectory()
      ? existsSync(join(target, "index.html"))
      : true;
  }
  return existsSync(join(DIST, clean, "index.html"));
}

const ATTR_RE = /(?:href|src)="([^"]+)"/g;
const SRCSET_RE = /srcset="([^"]+)"/g;

let linksChecked = 0;

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const from = page.slice(DIST.length);

  const refs = [...html.matchAll(ATTR_RE)].map((m) => m[1]);

  for (const [, srcset] of html.matchAll(SRCSET_RE)) {
    for (const candidate of srcset.split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) refs.push(url);
    }
  }

  for (const ref of refs) {
    // Skip anything that leaves the site or isn't a fetchable path.
    if (/^(https?:)?\/\//.test(ref)) continue;
    if (/^(mailto:|tel:|data:|#)/.test(ref)) continue;

    // Resolve relative refs against the page's own directory.
    const urlPath = ref.startsWith("/")
      ? ref
      : "/" + resolve(dirname(from), ref).slice(resolve("/").length);

    linksChecked += 1;

    if (!resolves(urlPath)) {
      fail(`${from} -> broken reference: ${ref}`);
      continue;
    }

    // A link to a page (not a file) must keep its trailing slash.
    const bare = urlPath.split(/[?#]/)[0];
    const isPage = built.has(bare);
    // A dot in the last segment means it's a file, not a route.
    const looksLikeFile = bare.split("/").pop().includes(".");
    if (!isPage && !looksLikeFile && !urlPath.endsWith("/")) {
      fail(`${from} -> missing trailing slash: ${ref}`);
    }
  }
}

// ------------------------------------------------------------ cloudflare ---

// These files are parsed by Cloudflare, not by Astro, so a malformed rule is
// silently ignored at runtime rather than failing the build. Validate here.
// (`check:worker` covers the serving behaviour itself.)

if (!existsSync(`${DIST}/_redirects`)) {
  fail("_redirects missing from build — legacy URLs would 404");
} else {
  const lines = readFileSync(`${DIST}/_redirects`, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  let dynamic = 0;
  for (const line of lines) {
    const [source, destination, code] = line.split(/\s+/);

    // Cloudflare has no domain-level redirects; a URL in the source position
    // is parsed as a path and silently never matches.
    if (/^https?:/i.test(source)) {
      fail(
        `_redirects: domain in source is unsupported on Cloudflare: ${line}`,
      );
    }
    if (!source.startsWith("/") && !/^https?:/i.test(source)) {
      fail(`_redirects: source must be a path: ${line}`);
    }
    if (!destination) fail(`_redirects: missing destination: ${line}`);
    if (code && !/^(30[1238]|200)$/.test(code)) {
      fail(`_redirects: unsupported status code: ${line}`);
    }
    if (source.includes("*")) dynamic += 1;
    if ((source.match(/\*/g) ?? []).length > 1) {
      fail(`_redirects: only one splat per rule is supported: ${line}`);
    }
  }

  // Cloudflare caps these at 2000 static / 100 dynamic.
  if (dynamic > 100) fail(`_redirects: ${dynamic} dynamic rules, max is 100`);
  if (lines.length - dynamic > 2000) fail("_redirects: over 2000 static rules");
}

if (!existsSync(`${DIST}/_headers`)) {
  fail("_headers missing from build — assets would revalidate on every visit");
}

// --------------------------------------------------------------- sitemap ---

// The sitemap deliberately omits individual photo pages. Assert both halves:
// every real page is listed, and no photo page leaks back in.
const sitemapFile = `${DIST}/sitemap-0.xml`;
if (!existsSync(sitemapFile)) {
  fail("sitemap-0.xml missing from build");
} else {
  const xml = readFileSync(sitemapFile, "utf8");
  const listed = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    ),
  );

  const isPhotoPage = (route) => /^\/photography\/[^/]+\/[^/]+\/$/.test(route);

  for (const route of listed) {
    if (isPhotoPage(route)) fail(`photo page leaked into sitemap: ${route}`);
  }
  for (const route of expected) {
    if (!isPhotoPage(route) && !listed.has(route)) {
      fail(`page missing from sitemap: ${route}`);
    }
  }
  console.log(
    `\nsitemap lists ${listed.size} of ${expected.size} routes (photo pages filtered out).`,
  );
}

// --------------------------------------------------------------- reports ---

console.log(
  `\n${built.size} routes, ${linksChecked} references checked across ${pages.length} pages.`,
);

if (failures.length > 0) {
  // Collapse duplicates: one broken nav link repeats on all 901 pages.
  const counts = new Map();
  for (const f of failures) {
    const key = f.replace(/^[^ ]+ -> /, "");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const [msg, count] of [...counts].sort((a, b) => b[1] - a[1])) {
    console.error(`FAIL ${msg}${count > 1 ? `  (on ${count} pages)` : ""}`);
  }
  console.error(`\n${counts.size} distinct failure(s).`);
  process.exit(1);
}

console.log("All routes and references OK.");
