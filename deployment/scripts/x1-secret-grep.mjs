// X1 — the grep gate (security/SPEC.md §7, security/SCENARIOS.md X1): a planted
// client-exposed secret turns the check red. Client-exposed means the build
// inlines it into the bundle by naming convention — the NEXT_PUBLIC_ class —
// so the leak happens at build time and no runtime control can undo it.
//
// Markdown is out of scope: the corpus names these prefixes in prose (this
// scenario's own text does), and a gate that reddens on its own specification
// is a gate nobody keeps. This file is excluded for the same reason.
import { spawnSync } from "node:child_process";

const PREFIXES = ["NEXT_PUBLIC_", "VITE_", "PUBLIC_"];
const SECRETISH = ["SECRET", "KEY", "TOKEN", "PASSWORD", "PASSWD", "PRIVATE", "CREDENTIAL"];
const PATTERN = `(${PREFIXES.join("|")})[A-Z0-9_]*(${SECRETISH.join("|")})`;

// git grep skips binaries and honours pathspec exclusions; exit 1 means no match.
const hit = spawnSync(
  "git",
  ["grep", "-nE", PATTERN, "--", ":!*.md", ":!deployment/scripts/x1-secret-grep.mjs"],
  { encoding: "utf8" },
);
const findings = hit.stdout.split("\n").filter(Boolean);

if (findings.length) {
  console.log(`\nX1 FAIL — a client-exposed secret is in the tree. The bundle inlines these by name:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(`\nX1 OK — no client-exposed secret identifier (${PREFIXES.join(", ")} × ${SECRETISH.length} secret words)`);
