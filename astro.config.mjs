// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://flavioprimo.xyz",

  // Gatsby 5 emitted trailing-slash URLs; keep them so existing links,
  // sitemaps and inbound SEO stay valid.
  trailingSlash: "always",
  build: { format: "directory" },

  // Astro 7 defaults to "jsx", which drops whitespace between elements — so a
  // link on its own line loses the space before it and renders as "fromCefriel".
  // The classic boolean mode collapses runs of whitespace without deleting
  // significant ones, which is what prose with inline links needs.
  compressHTML: true,

  integrations: [
    sitemap({
      // Individual photo pages (/photography/<gallery>/<photo>/) are ~869 thin,
      // near-duplicate pages that would otherwise be 96% of the sitemap and
      // drown out the real content. They stay crawlable and linkable via the
      // gallery pages — they're just not advertised here.
      //
      // The lookahead matters: /photography/category/<name>/ has the same shape
      // as a photo page and would otherwise be excluded too.
      filter: (page) =>
        !/^\/photography\/(?!category\/)[^/]+\/[^/]+\/$/.test(
          new URL(page).pathname,
        ),
    }),
  ],

  image: {
    // Opt in to Astro's responsive images: <Image> gets a srcset plus the
    // matching CSS, which is what gatsby-plugin-image used to hand-roll.
    layout: "constrained",
    responsiveStyles: true,
  },

  markdown: {
    // Astro 7 highlights with Shiki out of the box, replacing prismjs +
    // gatsby-remark-prismjs. Smart punctuation (gatsby-remark-smartypants)
    // is also built in and on by default, so neither needs configuring.
    shikiConfig: {
      // A theme pair: Shiki inlines the light colours and emits the dark ones
      // as --shiki-dark custom properties, which global.css swaps under .dark.
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },

  // Tailwind 4 ships as a Vite plugin; the old @astrojs/tailwind integration
  // only supports Tailwind 3 and Astro <=5.
  vite: {
    plugins: [tailwindcss()],
  },
});
