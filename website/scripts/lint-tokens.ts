// Pre-build Design System Compliance Linter:
// Scans website/src/ (excluding website/src/design-system/) and rejects any literal hex colors,
// rgb/hsl/oklch/color-mix functions, built-in Tailwind palette classes, arbitrary radii/shadows/opacities/blurs,
// or numeric opacity/duration utilities.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src", import.meta.url));
const skip = [join(root, "design-system")];
const palette =
  "(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";

const rules: Array<[RegExp, string]> = [
  [/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b(?![\w-])/, "Literal hex color value"],
  [/\b(?:rgba?|hsla?|oklch|oklab|color-mix)\(/, "Literal color function"],
  [
    new RegExp(
      `\\b(?:bg|text|border|from|via|to|ring|fill|stroke|shadow|outline|decoration|accent|caret|divide)-${palette}-\\d{2,3}\\b`
    ),
    "Tailwind built-in palette class",
  ],
  [/\b(?:bg|text|border|from|via|to|ring|fill|stroke)-(?:white|black)\b/, "white/black literal color class"],
  [
    /\b(?:bg|text|border|from|via|to|ring|fill|stroke|shadow)-[\w-]+\/\d{1,3}\b/,
    "Color opacity modifier (define alpha token in designSystem.ts instead)",
  ],
  [
    /\b(?:rounded(?:-[trbl]{1,2})?|opacity|shadow|blur|backdrop-blur|duration|ease)-\[/,
    "Arbitrary shape / opacity / shadow / blur / motion value",
  ],
  [/\bopacity-\d{1,3}\b/, "Numeric opacity class (use opacity-(--ds-opacity-*))"],
  [/\b(?:duration|delay)-\d{2,4}\b/, "Numeric duration/delay class (use duration-(--ds-duration-*))"],
  [
    /\b(?:drop-)?shadow-(?:xs|xl|2xl|inner)\b(?!-)/,
    "Tailwind built-in shadow class (use designSystem shadow: none/sm/md/lg/glow/glow-strong/ring)",
  ],
];

const problems: string[] = [];

function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (skip.some((s) => p.startsWith(s))) continue;
    if (statSync(p).isDirectory()) {
      walk(p);
    } else if (/\.(tsx?|css|html|mdx?)$/.test(name)) {
      checkFile(p);
    }
  }
}

function checkFile(file: string): void {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes("ds-allow")) return;
    for (const [re, reason] of rules) {
      const m = re.exec(line);
      if (m) {
        problems.push(`${relative(process.cwd(), file)}:${i + 1}  ${reason}: ${m[0]}`);
      }
    }
  });
}

walk(root);

if (problems.length > 0) {
  console.error(`Design System lint failed (${problems.length} hardcoded visual values found):\n` + problems.join("\n"));
  process.exit(1);
}

console.log("Design System check passed: zero hardcoded colors, shadows, shapes, or glow parameters in website/src/.");
