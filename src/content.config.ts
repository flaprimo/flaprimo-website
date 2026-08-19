import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Shared frontmatter across both collections. Mirrors what
 * gatsby-transformer-remark used to infer from the same markdown files.
 */
const common = {
  title: z.string(),
  date: z.coerce.date(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
};

const blog = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/blog" }),
  schema: z.object(common),
});

const photography = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/photography" }),
  // `image()` resolves the relative `cover:` path against the markdown file and
  // hands back ImageMetadata, the astro:assets equivalent of childImageSharp.
  schema: ({ image }) => z.object({ ...common, cover: image() }),
});

export const collections = { blog, photography };
