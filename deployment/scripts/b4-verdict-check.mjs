// B4 — author ≠ approver, and the verdict is the human's (deployment/SPEC.md
// §4, SCENARIOS.md B4). The author is the agent session; the approver is the
// human; a change an agent authored and no human read cannot be the final state
// of main.
//
// This REPORTS and never refuses, deliberately. A gate that blocked committing
// until the previous commit was reviewed would deadlock the first commit and
// every solo session after it. What it buys is that WHETHER a verdict was cast
// is visible; WHO cast it is not checkable with one human and no bot identities,
// and no script here can change that (SPEC.md §4).
//
//   git notes --ref=verdict add -m "attempted to falsify; nothing found" <sha>
//   git log --notes=verdict
import { execFileSync } from "node:child_process";

const REF = "verdict";
// A bare "looks fine" is not a structured verdict (SCENARIOS.md B4). The shape
// is named findings, or the explicit falsification sentence. This is the one
// property of the CONTENT a script can honestly check.
const FALSIFIED = /attempted to falsify/i;
const TOO_THIN = 40;

const range = process.argv.find((a) => a.startsWith("--since="))?.slice(8);

function notesFor(sha) {
  try {
    return execFileSync("git", ["notes", `--ref=${REF}`, "show", sha], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

if (process.argv.includes("--selfcheck")) {
  const ok = (t) => t !== null && (FALSIFIED.test(t) || t.trim().length >= TOO_THIN);
  const cases = [
    ["no note is not a verdict", !ok(null)],
    ['"looks fine" is not a verdict', !ok("looks fine\n")],
    ["the falsification sentence is", ok("attempted to falsify; nothing found\n")],
    ["named findings are", ok("S2 classifies extensionless files as code; LICENSE would be code. Accepted.\n")],
  ];
  const failed = cases.filter(([, c]) => !c);
  if (failed.length) {
    console.log(`\nB4 SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

const commits = execFileSync("git", ["log", "--format=%H%x00%s", range ? `${range}..HEAD` : "HEAD"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean)
  .map((l) => l.split("\0"));

// A verdict COVERS its own commit and every commit back to the previous
// verdict (SPEC.md §4) — how a reviewer signing off on a run actually works,
// and the only reading under which a batch sign-off is representable. Counting
// per-commit would report 1/24 for a founder who read and signed the whole run,
// which misdescribes what happened. Per-commit is still available: cast one on
// each and each covers only itself.
const uncast = [];
const thin = [];
let covered = 0;
let coveringNote = null;
for (const [sha, subject] of commits) {
  const note = notesFor(sha);
  if (note !== null) coveringNote = note;
  if (coveringNote === null) {
    uncast.push([sha, subject]);
  } else if (!FALSIFIED.test(coveringNote) && coveringNote.trim().length < TOO_THIN) {
    thin.push([sha, subject]);
  } else {
    covered++;
  }
}

console.log(`\nB4 — ${covered}/${commits.length} commit(s) covered by a structured verdict.`);
if (thin.length) {
  console.log(`\n  Cast but not structured — a bare "looks fine" is not a verdict (SCENARIOS.md B4):`);
  for (const [sha, s] of thin) console.log(`    ${sha.slice(0, 7)}  ${s}`);
}
if (uncast.length) {
  console.log(`\n  No verdict (${uncast.length}):`);
  for (const [sha, s] of uncast.slice(0, 20)) console.log(`    ${sha.slice(0, 7)}  ${s}`);
  if (uncast.length > 20) console.log(`    … and ${uncast.length - 20} more`);
  console.log(`\n  Cast one:  git notes --ref=${REF} add -m "attempted to falsify; nothing found" <sha>`);
  console.log(`  Read them: git log --notes=${REF}`);
}
console.log(`\nB4 is a [DRILL] and this never refuses a commit — only the human can close it (SPEC.md §4).`);
