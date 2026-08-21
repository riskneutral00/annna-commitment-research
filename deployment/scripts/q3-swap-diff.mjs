// Q3 — the swap diff gate (deployment/SPEC.md §6, SCENARIOS.md Q3): a swap
// commit that also edits harness/ is refused. The only mechanical guard on the
// zero-harness-changes swap law the whole four-layer bet rests on.
//
// A swap commit declares itself with a `Swap: <layer>` trailer (SPEC.md §6).
// The declaration is the swapper's, and SPEC.md states that bound: an
// unlabelled swap is not caught, the same shape as FD-7's --no-verify ceiling.
//
// Its home is .githooks/commit-msg, because the message does not exist yet at
// pre-commit time. Called with the message file path; called without one (from
// `npm run check`) it says so rather than passing quietly.
//
// Like S2 it classifies the RESULTING COMMIT (SPEC.md §7a items 1 and 2, fixed
// 2026-08-21): under `git commit --amend` the harness edits already in HEAD are
// not staged, so a swap trailer amended onto them passed. The paths come from
// s2-path-class.mjs, which owns that reading — one definition, imported. It
// also takes CI's `--commit <rev>` / `--range <a>..<b>`, where nothing is
// staged and no message file exists.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { commitPaths, pendingPaths } from "./s2-path-class.mjs";

// git's own trailer rule: `Token: value` on its own line in the trailer block.
const TRAILER = /^Swap:[ \t]*(\S.*)$/m;

function refuses(message, staged) {
  const swap = message.match(TRAILER);
  if (!swap) return null;
  const touched = staged.filter((f) => f.startsWith("harness/"));
  return touched.length ? { layer: swap[1].trim(), touched } : null;
}

if (process.argv.includes("--selfcheck")) {
  const cases = [
    ["a swap touching harness/ is refused", !!refuses("x\n\nSwap: engine", ["harness/src/loop.ts"])],
    ["a swap touching nothing else is allowed", !refuses("x\n\nSwap: engine", ["engine/adapters/seam.ts"])],
    ["a non-swap may touch harness/", !refuses("ordinary commit", ["harness/src/loop.ts"])],
    ["the trailer must be its own line", !refuses("mentions Swap: engine inline", ["harness/src/loop.ts"])],
    ["harness-prefixed siblings are not harness/", !refuses("x\n\nSwap: engine", ["harness-notes/x.ts"])],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nQ3 SELFCHECK FAIL — the gate does not catch what Q3 says it catches:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

function fail(label, finding) {
  console.log(`\nQ3 FAIL — a swap commit may not change the harness. That is the property the swap proves.`);
  console.log(`  ${label}`);
  console.log(`  declared: Swap: ${finding.layer}`);
  for (const f of finding.touched) console.log(`  harness edit: ${f}`);
  console.log(`  If the swap genuinely needs a harness change, it is a stub lie — land it as its own spec commit first (SPEC.md §1).`);
}

const flag = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : process.argv.find((a) => a.startsWith(`${name}=`))?.slice(name.length + 1);
};
const range = flag("--range");
const commit = flag("--commit");

if (range || commit) {
  const git = (args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28 });
  const revs = commit ? [commit] : git(["rev-list", "--reverse", range]).split("\n").filter(Boolean);
  let bad = 0;
  for (const rev of revs) {
    const finding = refuses(git(["log", "-1", "--format=%B", rev]), commitPaths(rev));
    if (finding) {
      bad++;
      fail(`commit ${rev.slice(0, 9)} — ${git(["log", "-1", "--format=%s", rev]).trim()}`, finding);
    }
  }
  if (bad) process.exit(1);
  console.log(`\nQ3 OK — ${revs.length} commit(s) read, no swap commit changes the harness`);
  process.exit(0);
}

const msgFile = process.argv[2];
if (!msgFile) {
  console.log(`\nQ3 SKIPPED — no commit message to read. The diff gate classifies the message plus the resulting commit's paths; it bites in .githooks/commit-msg, where both exist, and in CI under --range.`);
  process.exit(0);
}

const message = readFileSync(msgFile, "utf8");
const { paths, amend } = pendingPaths();
const finding = refuses(message, paths);

if (finding) {
  fail(amend ? `the resulting commit (git commit --amend — HEAD's paths land in it too)` : `the staged set`, finding);
  process.exit(1);
}
console.log(`\nQ3 OK — ${TRAILER.test(message) ? "swap commit, no harness edit" : "not a swap commit"}`);
