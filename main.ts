// One Word for Your Wi-Fi — make.fun entry
// The entry is a single fixed word: what my Wi-Fi does every single day.
// No input, no network, no randomness, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const WORD = "Gaslighting";

function validateEntry(word: string): void {
  // Gate from the competition rules: 1-20 characters, exactly one word,
  // not only whitespace. The scorer also counts bytes, so the UTF-8 byte
  // length gets the same 20 cap — a multi-byte word must pass both.
  if (word.length < 1 || word.length > 20) {
    throw new Error(`entry must be 1-20 characters, got ${word.length}`);
  }
  if (Buffer.byteLength(word, "utf8") > 20) {
    throw new Error(
      `entry must be at most 20 bytes, got ${Buffer.byteLength(word, "utf8")}`,
    );
  }
  if (word.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/\s/.test(word)) {
    throw new Error("entry must be exactly one word (no whitespace)");
  }
}

function writeEntry(word: string, outDir: string): string {
  const outPath = join(outDir, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, word, "utf8");
  return outPath;
}

function main(): void {
  validateEntry(WORD);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  const outPath = writeEntry(WORD, outDir);
  // Verify the round-trip: what landed on disk must be exactly the word,
  // so a partial or mangled write can never pass silently.
  const written = readFileSync(outPath, "utf8");
  if (written !== WORD) {
    throw new Error(`verification failed: entry.txt holds ${JSON.stringify(written)}`);
  }
  validateEntry(written);
  console.log(`wrote ${WORD.length}-character entry to ${outPath}`);
}

main();
