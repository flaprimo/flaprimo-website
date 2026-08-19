/**
 * Verifies that every code fence in the built site was actually syntax
 * highlighted by Shiki, and that no fence silently fell back to plaintext.
 *
 * Run `npm run build` first, then `npm run check:highlight`.
 *
 * Shiki fails soft: an unknown or missing language tag still renders a styled
 * <pre>, just with no coloured tokens. So "it looks fine" is not evidence —
 * this asserts on `data-language` and on the presence of coloured spans.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

/**
 * Fences that are intentionally untagged: a directory tree and a block of
 * terminal output, neither of which has a useful grammar.
 */
const ALLOWED_PLAINTEXT = {
  "cmake-tutorial-for-novices": 1,
  "how-to-install-virtualbox-on-ubuntu-having-uefi-secure-boot-enabled": 1,
};

const PRE_RE =
  /<pre class="astro-code[^"]*"[^>]*data-language="([^"]+)"[^>]*>([\s\S]*?)<\/pre>/g;

/**
 * With a Shiki theme pair, a token carries the light colour inline and the
 * dark one as a custom property:
 *
 *   <span style="color:#D73A49;--shiki-dark:#F97583">
 *
 * Both halves are checked, because losing the dark value would silently leave
 * code blocks unreadable in dark mode while still looking fine in light.
 */
const COLOUR_RE = /style="[^"]*\bcolor:#[0-9A-Fa-f]{3,8}/g;
const DARK_COLOUR_RE = /--shiki-dark:#[0-9A-Fa-f]{3,8}/g;

const dist = "dist/blog";
if (!existsSync(dist)) {
  console.error("dist/blog not found — run `npm run build` first.");
  process.exit(1);
}

let failures = 0;
let checked = 0;
let plaintext = 0;

for (const slug of readdirSync(dist).sort()) {
  const file = `${dist}/${slug}/index.html`;
  if (!existsSync(file)) continue;

  const html = readFileSync(file, "utf8");
  const blocks = [...html.matchAll(PRE_RE)];
  if (blocks.length === 0) continue;

  let plaintextHere = 0;

  for (const [index, [, language, body]] of blocks.entries()) {
    checked += 1;

    if (language === "plaintext") {
      plaintextHere += 1;
      plaintext += 1;
      continue;
    }

    const colours = (body.match(COLOUR_RE) ?? []).length;
    if (colours === 0) {
      console.error(
        `FAIL ${slug} block ${index + 1}: data-language="${language}" but no coloured tokens — grammar probably not bundled.`,
      );
      failures += 1;
      continue;
    }

    const darkColours = (body.match(DARK_COLOUR_RE) ?? []).length;
    if (darkColours === 0) {
      console.error(
        `FAIL ${slug} block ${index + 1}: light colours present but no --shiki-dark values — code would be unreadable in dark mode.`,
      );
      failures += 1;
    }
  }

  const allowed = ALLOWED_PLAINTEXT[slug] ?? 0;
  if (plaintextHere > allowed) {
    console.error(
      `FAIL ${slug}: ${plaintextHere} untagged fence(s), expected ${allowed}. Add a language tag, or update ALLOWED_PLAINTEXT.`,
    );
    failures += 1;
  }
}

// Escaped punctuation inside a fence renders literally, since Markdown does
// not process backslash escapes there. Catch it before it ships again.
for (const slug of readdirSync("src/content/blog").sort()) {
  const file = `src/content/blog/${slug}/index.md`;
  if (!existsSync(file)) continue;

  let inside = false;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (line.startsWith("```")) {
        inside = !inside;
        return;
      }
      if (inside && /\\[_#*`~[\]()>+\-.!]/.test(line)) {
        console.error(
          `FAIL ${slug}:${i + 1}: backslash escape inside a code fence renders literally — ${line.trim().slice(0, 60)}`,
        );
        failures += 1;
      }
    });
}

console.log(
  `\n${checked} code blocks checked — ${checked - plaintext} highlighted, ${plaintext} intentionally plaintext.`,
);

if (failures > 0) {
  console.error(`${failures} failure(s).`);
  process.exit(1);
}
console.log("All code blocks highlighted as expected.");
