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
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

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

const msgFile = process.argv[2];
if (!msgFile) {
  console.log(`\nQ3 SKIPPED — no commit message to read. The diff gate classifies the message plus the staged set; it bites in .githooks/commit-msg, where both exist.`);
  process.exit(0);
}

const staged = execFileSync("git", ["diff", "--cached", "--name-only", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const finding = refuses(readFileSync(msgFile, "utf8"), staged);

if (finding) {
  console.log(`\nQ3 FAIL — a swap commit may not change the harness. That is the property the swap proves.`);
  console.log(`  declared: Swap: ${finding.layer}`);
  for (const f of finding.touched) console.log(`  harness edit: ${f}`);
  console.log(`  If the swap genuinely needs a harness change, it is a stub lie — land it as its own spec commit first (SPEC.md §1).`);
  process.exit(1);
}
console.log(`\nQ3 OK — ${TRAILER.test(readFileSync(msgFile, "utf8")) ? "swap commit, no harness edit" : "not a swap commit"}`);
