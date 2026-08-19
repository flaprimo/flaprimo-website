// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://flavioprimo.xyz",

  // Gatsby 5 emitted trailing-slash URLs; keep them so existing links,
  // sitemaps and inbound SEO stay valid.
  trailingSlash: "always",
  build: { format: "directory" },

  integrations: [
    sitemap({
      // Individual photo pages (/photography/<gallery>/<photo>/) are ~869 thin,
      // near-duplicate pages that would otherwise be 96% of the sitemap and
      // drown out the real content. They stay crawlable and linkable via the
      // gallery pages — they're just not advertised here.
      filter: (page) =>
        !/\/photography\/[^/]+\/[^/]+\/$/.test(new URL(page).pathname),
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
      theme: "github-dark",
      wrap: true,
    },
  },
});
