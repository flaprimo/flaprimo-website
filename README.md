# flaprimo-website

My personal blog — [flavioprimo.xyz](https://flavioprimo.xyz). Static site built
with [Astro](https://astro.build), deployed to Cloudflare Workers.

Requires Node 22.12 or newer (`.node-version` pins 22.16.0).

## Commands

```sh
npm install
npm run dev        # dev server on http://localhost:4321
npm run build      # static build into dist/
npm run preview    # serve the built site
npm test           # types, build, and checks against the output
npm run deploy     # build and publish to Cloudflare
```

Use `npm run preview` rather than `npm run dev` when checking anything
image-related: the dev server serves images through an on-demand endpoint, so
only the preview server shows the real optimised output and final asset URLs.

## Layout

```
src/
  config.ts           site metadata, nav and social links
  content.config.ts   content collection schemas
  content/
    blog/             one directory per post, containing index.md
    photography/      one directory per gallery, containing index.md + .jpg
  pages/              routes
  components/         .astro components
  layouts/            BaseLayout.astro
  lib/                excerpt and photo helpers
  styles/             global.css
  assets/             images imported by components (optimised)
public/               served verbatim: _headers, _redirects, manifest, logo
scripts/              build verification (see Testing)
```

## Adding content

The directory name becomes the URL, so `src/content/blog/my-post/` is served at
`/blog/my-post/`. Renaming a directory changes a live URL — add a rule to
`public/_redirects` if you do.

**A blog post** is `src/content/blog/<slug>/index.md`:

```markdown
---
title: My Post
date: "2026-08-19T00:00:00.000Z"
category: "Notes"
tags: ["one", "two"]
---

Body text. Images live beside the markdown and are referenced relatively
(`![alt](./screenshot.png)`), which is what lets astro:assets optimise them.
```

**A gallery** is `src/content/photography/<slug>/index.md` plus the `.jpg` files
in the same directory. It takes the same frontmatter with one addition:

```markdown
cover: "./DSC_0020.jpg"
```

Every `.jpg` in the directory is picked up automatically, sorted by filename,
and gets its own page at `/photography/<slug>/<filename>/`. No index to update.

Tag code fences with a language (` ```c `, ` ```cmake `, ` ```sh `) — untagged
fences render unhighlighted, and `npm test` fails on ones that should have a
tag. Avoid backslash escapes inside fences: Markdown does not process them
there, so they render literally.

## Testing

```sh
npm test
```

Runs, in order: type check, build, then three checks against `dist/`. Each check
can also be run alone, but they read `dist/`, so build first.

| Command                   | Catches                                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`           | type errors in `.astro` and `.ts`                                                                                                 |
| `npm run check:build`     | broken internal links, missing assets, wrong trailing slashes, added or dropped routes, invalid `_redirects` rules, sitemap drift |
| `npm run check:highlight` | code fences that silently fell back to plaintext, backslash escapes inside fences                                                 |
| `npm run check:worker`    | the deploy config, by running the real `workerd` runtime against `dist/`                                                          |

These exist because the failures that matter here are all **silent**. A renamed
content directory still builds cleanly, just without those pages. An unknown
language tag still renders a nicely styled code block, just with no colour. A
`_redirects` rule with a domain in the source position is simply ignored by
Cloudflare. And if `not_found_handling` is ever wrong, every unmatched URL
returns 200 instead of 404. None of these surface as build errors.

`check:worker` needs `bash` and downloads the Workers runtime on first run.

## Deploying

Cloudflare Workers Static Assets, configured in `wrangler.jsonc`. No Astro
adapter is needed — `@astrojs/cloudflare` is only for on-demand rendering.

Deploys run from Workers Builds on push. To publish from a laptop instead:

```sh
npx wrangler login
npm run deploy
```

Local deploys upload the full ~262 MB. Prefer Workers Builds; Cloudflare has
open issues about asset-upload flakiness at roughly this file count (~3,700).

### Settings that are not in this repo

- **Build cache must be enabled** (Settings → Build → Build cache). It is off by
  default. Cloudflare caches `node_modules/.astro`, where Astro keeps its
  ~209 MB image cache. Without it every deploy re-runs ~2,760 image transforms
  against a hard 20-minute build timeout. The cache is purged 7 days after its
  last read, so infrequent deploys go cold.
- **Do not add Cache Rules on the custom domain.** They can be served before
  `_redirects` is applied.
- The domain's nameservers must be on Cloudflare. Workers, unlike Pages, cannot
  serve a domain hosted elsewhere.

### What this repo already handles

- `wrangler.jsonc` — `not_found_handling: "404-page"` is set explicitly. The
  default is `"none"`, which silently drops `dist/404.html`. Never set
  `"single-page-application"`: it serves `/` with a 200 for every unmatched URL.
  Never set `run_worker_first`: it makes every request billable.
- `public/_headers` — the platform default is `max-age=0, must-revalidate` on
  everything. `/_astro/*` is content-hashed, so it is marked `immutable`.
- `public/_redirects` — path-based only. **Cloudflare has no domain-level
  redirects**, unlike Netlify: a URL in the source position is parsed as a path
  and silently never matches.
- `.node-version` — Cloudflare ignores `engines` in `package.json`.
- `trailingSlash: "always"` in `astro.config.mjs` matches how Workers serves
  directory indexes, so internal links never take a redirect hop.

### Migrating from Pages

Only relevant during the one-time cutover.

1. Point Workers Builds at this repo. Build command `npm run build`; the output
   directory comes from `wrangler.jsonc`.
2. Enable the build cache, then run two builds and confirm the second is much
   faster — that verifies the Astro cache is actually being restored.
3. Validate on the `workers.dev` URL before touching DNS. Check trailing-slash
   redirects, the five legacy redirects, `_headers` values, and that a bad URL
   returns 404 rather than 200.
4. Swap the custom domain at low traffic. **There is a brief downtime window**:
   a Pages custom domain is a proxied CNAME, and a Worker Custom Domain cannot
   be created over an existing CNAME, so the Pages domain must be removed first.
5. Keep the Pages project for a few weeks — rollback means repeating the DNS
   swap. Then `npx wrangler pages project delete`.

**Known regression:** Pages answers `/about` with a **308** (permanent);
Workers answers with a **307** (temporary), and this is not configurable. Only
external inbound links missing a trailing slash take that path — internal links
all carry slashes, and every page emits a canonical `<link>` — but it is a real
downgrade of the SEO signal on those links.

## Implementation notes

- **Zero client-side JavaScript by default.** The only scripts are the navbar
  burger, the click-to-load Disqus embed, and keyboard navigation on photo
  pages. All are small enough that Astro inlines them; no JS bundle is emitted.
- **Images** go through `astro:assets`, replacing `gatsby-plugin-image` and
  `gatsby-plugin-sharp`. ~870 photos become ~2,760 derivatives. The first build
  takes ~25s; later builds reuse the cache and take ~3s.
- **Syntax highlighting** is Astro's built-in Shiki, and smart punctuation comes
  from the default Markdown processor. Neither needs a plugin — Astro 7 replaced
  remark/rehype with a Rust pipeline that handles smart punctuation natively.
- **Social icons** are inlined at build time from `simple-icons`. LinkedIn is
  the exception: it was removed from that package at the brand owner's request,
  so its glyph is inlined from Font Awesome Free in
  `src/components/social-icons.ts`.
- **All 901 URLs match** the previous Gatsby site exactly, so no redirects were
  needed for the migration. `npm run check:build` enforces this.
