// R9 — lower rungs unindexed and undoored (deployment/SPEC.md §3, SCENARIOS.md
// R9): non-production rungs serve X-Robots-Tag: noindex and contain no
// reachable debug or auth-bypass flag. Config/grep check — the security X1
// pattern (x1-secret-grep.mjs).
//
// Two halves, and only one is constructible today. The FLAG half runs now, over
// tracked non-markdown files: the spec corpus names these identifiers in prose
// and must not redden its own gate, which is also why `.md` is out of scope —
// a flag that is only ever written about is not a reachable flag. This file is
// excluded for the same reason: it names the patterns it hunts.
// The NOINDEX half needs a rung config to assert against. There is none yet
// (no vercel.json, no next.config.*), so it reports as not-yet-constructible
// instead of passing quietly, and becomes a real assertion at BUILD Step 2 when
// the preview rung exists.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const FLAGS = ["(SKIP|DISABLE|BYPASS)_AUTH", "AUTH_(SKIP|DISABLE|BYPASS)", "DEBUG" + "_MODE", "ALLOW" + "_ANONYMOUS"];
const RUNG_CONFIGS = ["vercel.json", "next.config.js", "next.config.mjs", "next.config.ts"];

// git grep skips binaries and honours pathspec exclusions; exit 1 means no match.
const hit = spawnSync(
  "git",
  ["grep", "-nE", FLAGS.join("|"), "--", ":!*.md", ":!deployment/scripts/r9-noindex-nodebug.mjs"],
  { encoding: "utf8" },
);
const findings = hit.stdout.split("\n").filter(Boolean);

const rung = RUNG_CONFIGS.filter((f) => existsSync(f));
for (const f of rung) {
  if (!/X-Robots-Tag/i.test(readFileSync(f, "utf8"))) {
    findings.push(`${f} — a rung config with no X-Robots-Tag: noindex header`);
  }
}

if (findings.length) {
  console.log(`\nR9 FAIL — a reachable debug/auth-bypass flag, or a rung config without noindex:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(
  rung.length
    ? `\nR9 OK — no debug/auth-bypass flag; ${rung.length} rung config(s) carry noindex`
    : `\nR9 OK — no debug/auth-bypass flag. The noindex half is NOT YET CONSTRUCTIBLE: no rung config exists (BUILD.md Step 2 creates one).`,
);
