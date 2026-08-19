/**
 * Approximates gatsby-transformer-remark's default `excerpt` field: plain
 * text, pruned to 140 characters on a word boundary with an ellipsis.
 */
export function excerpt(markdown: string, length = 140): string {
  const text = markdown
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, " ")
    // inline code
    .replace(/`[^`]*`/g, " ")
    // images, then links: drop the target, keep the label
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // raw html tags
    .replace(/<[^>]+>/g, " ")
    // headings, blockquotes, list markers
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    // emphasis and strikethrough markers
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= length) return text;

  const cut = text.slice(0, length);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}
