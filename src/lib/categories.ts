/**
 * Categories come from frontmatter as display strings ("Programming
 * Languages"), so they need a stable URL form. Kept deliberately simple: the
 * existing values are plain ASCII words.
 */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const categoryHref = (
  section: "blog" | "photography",
  category: string,
) => `/${section}/category/${categorySlug(category)}/`;

/** Groups entries by category, returning one entry per distinct category. */
export function groupByCategory<T extends { data: { category: string } }>(
  entries: T[],
): Map<string, { name: string; entries: T[] }> {
  const groups = new Map<string, { name: string; entries: T[] }>();

  for (const entry of entries) {
    const slug = categorySlug(entry.data.category);
    const group = groups.get(slug) ?? {
      name: entry.data.category,
      entries: [],
    };
    group.entries.push(entry);
    groups.set(slug, group);
  }

  return groups;
}
