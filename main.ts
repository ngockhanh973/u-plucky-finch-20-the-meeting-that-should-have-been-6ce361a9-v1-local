// The Meeting That Should Have Been an Email
// One-line joke entry: writes the single line to /output/entry.txt.
//
// The line is kept as one constant so the gate checks below can verify it
// before anything is written: 1-200 characters, exactly one line, and not
// only whitespace. The file is written with no trailing newline, so the
// character count on disk is exactly the length of the line itself.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const LINE =
  "The email that could have replaced this meeting was sent during this meeting, by someone in this meeting, to everyone in this meeting.";

const MAX_CHARS = 200;

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== LINE) {
    throw new Error("round-trip check failed: file content differs from LINE");
  }
  console.log(`wrote ${LINE.length} characters to ${outPath}`);
}

main();
