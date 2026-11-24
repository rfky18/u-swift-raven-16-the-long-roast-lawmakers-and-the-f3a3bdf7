import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

const ENTRY =
  "The lawmaker who would jail you for training AI on copyrighted text paid a consultant $40,000 to turn his speech into a PDF, and got back a photo of his screen.";

// Gate: the contest scorer accepts UTF-8 text of 1-320 characters only.
// Fail loudly before writing anything if the line ever drifts out of gate.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 320) {
  throw new Error(`entry length ${chars.length} outside 1-320 characters`);
}
if (ENTRY.trim() === "" || ENTRY.includes("\n")) {
  throw new Error("entry must be a single non-blank line");
}

const rawDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outDir = isAbsolute(rawDir) ? rawDir : resolve(rawDir);
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, ENTRY, "utf8");

// Self-check: re-read what was written and confirm it is byte-identical
// to the intended line, with no trailing newline added.
const written = readFileSync(outFile, "utf8");
if (written !== ENTRY) {
  throw new Error("self-check failed: written entry differs from intended line");
}
