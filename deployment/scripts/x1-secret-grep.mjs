// X1 — the grep gate (security/SPEC.md §7, security/SCENARIOS.md X1): a planted
// client-exposed secret turns the check red. Client-exposed means the build
// inlines it into the bundle by naming convention — the NEXT_PUBLIC_ class —
// so the leak happens at build time and no runtime control can undo it.
//
// Markdown is out of scope: the corpus names these prefixes in prose (this
// scenario's own text does), and a gate that reddens on its own specification
// is a gate nobody keeps. This file is excluded for the same reason.
//
// SECOND ASSERTION — the env manifest is the enumeration of record
// (deployment/env-manifest.md, security/SPEC.md §7: "a variable absent from
// this file is a defect wherever it appears"). That law had no mechanism at
// all: R1, R5 and R11 all enumerate a live rung's env store and diff it against
// the manifest, and no rung exists to enumerate, so nothing checked anything.
// `MODEL` sat unmanifested until 2026-08-21 while the manifest's own text
// called that a defect — which is the whole argument for the one half of the
// diff that IS runnable today: the tree can be read now (SPEC.md §7a item 8).
//
// It lives here rather than in a new script because both halves are the same
// act — grep the tracked tree for an identifier class and refuse what should
// not be there — and because a new file in this folder is a gate that
// `AGENTS.md`'s count and `deployment/README.md`'s roster would both have to
// name, and those are markdown a code sprint may not write.
//
// A REFERENCE INSIDE A QUOTED STRING IS NOT A READ. `r2-closed-service.mjs`
// carries a marketplace-credential env name inside a selfcheck fixture
// demonstrating its own refusal; that is data, exactly as the same identifier
// in prose is — and it is written here in words rather than quoted, because a
// sibling gate's fixture reproduced in a second file is a second offence to
// that gate. String literals are stripped before the dot form is read, and the
// bracket form — where the name is itself a string — is read first, off the raw
// line, so stripping cannot hide it.
import { spawnSync, execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SELF = "deployment/scripts/x1-secret-grep.mjs";
const MANIFEST = "deployment/env-manifest.md";

const PREFIXES = ["NEXT_PUBLIC_", "VITE_", "PUBLIC_"];
const SECRETISH = ["SECRET", "KEY", "TOKEN", "PASSWORD", "PASSWD", "PRIVATE", "CREDENTIAL"];
const PATTERN = `(${PREFIXES.join("|")})[A-Z0-9_]*(${SECRETISH.join("|")})`;

// A manifest row: the name is the first cell, backticked.
export const manifested = (md) => new Set([...md.matchAll(/^\|\s*`([A-Z][A-Z0-9_]*)`\s*\|/gm)].map((m) => m[1]));

const QUOTED = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
const BRACKET = /process\.env\[\s*["'`]([A-Za-z_$][A-Za-z0-9_$]*)["'`]\s*\]/g;
const DOT = /process\.env\.([A-Za-z_$][A-Za-z0-9_$]*)/g;

// Every env name a line actually READS, ignoring names that are only quoted data.
export function envNamesIn(line) {
  const names = [...line.matchAll(BRACKET)].map((m) => m[1]);
  const code = line.replace(BRACKET, "process.env.KEPT").replace(QUOTED, '""');
  return [...names, ...[...code.matchAll(DOT)].map((m) => m[1])].filter((n) => n !== "KEPT");
}

if (process.argv.includes("--selfcheck")) {
  const cases = [
    ["the manifest parses to its rows", manifested("| `CONVEX_URL` | founder | x | y |\n| `MODEL` | founder | n/a | z |").size === 2],
    ["prose backticks are not rows", manifested("the `MODEL` slug is read by the spike").size === 0],
    ["a dot read is a read", envNamesIn("const m = process.env.MODEL ?? 'x';")[0] === "MODEL"],
    ["a bracket read is a read", envNamesIn('const k = process.env["OPENROUTER_API_KEY"];')[0] === "OPENROUTER_API_KEY"],
    ["a fixture inside a string is not", envNamesIn('["caught", offences("const k = process.env.PLANTED_NAME").length === 1]').length === 0],
    ["two reads on one line are both read", envNamesIn("f(process.env.A, process.env.B)").length === 2],
    ["ordinary code reads nothing", envNamesIn("const summary = summarize(text)").length === 0],
    ["the real manifest is not empty", manifested(readFileSync(MANIFEST, "utf8")).size > 0],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nX1 SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

// git grep skips binaries and honours pathspec exclusions; exit 1 means no match.
const hit = spawnSync("git", ["grep", "-nE", PATTERN, "--", ":!*.md", `:!${SELF}`], { encoding: "utf8" });
const findings = hit.stdout.split("\n").filter(Boolean);

if (findings.length) {
  console.log(`\nX1 FAIL — a client-exposed secret is in the tree. The bundle inlines these by name:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(`\nX1 OK — no client-exposed secret identifier (${PREFIXES.join(", ")} × ${SECRETISH.length} secret words)`);

const known = manifested(readFileSync(MANIFEST, "utf8"));
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean)
  .filter((f) => !f.endsWith(".md") && f !== SELF);

const unmanifested = [];
let reads = 0;
for (const file of tracked) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (!text.includes("process.env")) continue;
  text.split("\n").forEach((line, i) => {
    for (const name of envNamesIn(line)) {
      reads++;
      if (!known.has(name)) unmanifested.push(`${file}:${i + 1} ${name}`);
    }
  });
}

if (unmanifested.length) {
  console.log(`\nENV-MANIFEST FAIL — ${unmanifested.length} variable read(s) absent from ${MANIFEST}:`);
  for (const u of unmanifested) console.log(`  ${u}`);
  console.log(`\n  The manifest is the enumeration of record: a variable absent from it is a defect`);
  console.log(`  wherever it appears (security/SPEC.md §7). Name it there — rung, owner, rotation —`);
  console.log(`  in its own spec commit, ahead of the code that reads it.`);
  process.exit(1);
}
console.log(
  `\nENV-MANIFEST OK — ${reads} env read(s) in tracked non-markdown files, every name among the ${known.size} ${MANIFEST} declares.` +
    `\n  NOT CHECKED: the other half of the diff — what a live rung's env store actually holds. No rung exists to enumerate (SPEC.md §8 DR-8).`,
);
