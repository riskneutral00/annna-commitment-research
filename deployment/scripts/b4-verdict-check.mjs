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
//
// IN A FRESH CLONE THE VERDICTS ARE NOT THERE UNTIL YOU FETCH THEM. Notes refs
// live outside refs/heads and no default refspec brings them down, so `git
// clone` gives you every commit and none of its verdicts, and this gate reports
// the whole history uncast. Fetch them once:
//
//   git fetch origin "refs/notes/verdict:refs/notes/verdict"
//
// and to keep them coming with every ordinary fetch:
//
//   git config --add remote.origin.fetch "+refs/notes/verdict:refs/notes/verdict"
//
// The push half is the founder's ritual and pushes `refs/notes/verdict`
// explicitly, for the same reason in the other direction (SPEC.md §7a item 9).
//
// THE PIN. This used to be run as `--since=c802396`, a SHA the 2026-08-08 squash
// left unreachable — so in any fresh clone the gate died on `git log` rather
// than reporting. `npm run verdicts` now names no range and walks the whole of
// HEAD, which is reachable by construction; an explicit `--since` that names an
// unreachable commit falls back to the same full walk with a line saying so,
// rather than failing on a pin that is nobody's defect.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REF = "verdict";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
// A bare "looks fine" is not a structured verdict (SCENARIOS.md B4). The shape
// is named findings, or the complete falsification sentence. This is the one
// property of the CONTENT a script can honestly check.
const COMPLETE_FALSIFICATION = /\battempted to falsify;\s*nothing found\b/i;
const FINDING_CLAUSE =
  /\b(?:classif(?:y|ies|ied)|contradict(?:s|ed|ion)?|defect(?:s|ive)?|drift(?:s|ed)?|fail(?:s|ed|ure)?|find(?:s|ing|ings)?|found|fix(?:es|ed)?|gap(?:s)?|identif(?:y|ies|ied)|inconsisten(?:t|cy)|issue(?:s)?|missing|reject(?:s|ed|ion)?|reproduc(?:e|ed)|regression(?:s)?|unsafe|violat(?:e|es|ed|ion)|wrong)\b/i;
const INCOMPLETE_REVIEW =
  /\b(?:review|falsification pass)\s+(?:aborted|failed to start|did not start|was not run|wasn't run)\b|\b(?:aborted|failed to start|did not start|was not run|wasn't run)\s+(?:review|falsification pass)\b/i;
const SUBJECT_TOKEN = /\b(?:[A-Z]\d+|[A-Z]+-[A-Z0-9]+(?:-[A-Z0-9]+)*|[A-Z]+-?\d+)\b/g;
const TRACKED_PATH_TOKEN = /(?:\.\.?\/)?[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)+/g;
const REVIEW_SUBJECT = /\b(?:audit|falsification pass|inspection|review)\b/i;
const SCENARIO_OR_GATE_IDS = new Set(
  [...readFileSync(path.join(ROOT, "deployment/SCENARIOS.md"), "utf8").matchAll(/^\s*-\s+\*\*([A-Z]\d+|[A-Z]+-\d+)\b/gm)].map(([, id]) => id),
);
const TRACKED_PATHS = new Set(execFileSync("git", ["-C", ROOT, "ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean));

function hasResolvableSubject(text) {
  const ids = text.match(SUBJECT_TOKEN) ?? [];
  if (ids.some((id) => SCENARIO_OR_GATE_IDS.has(id))) return true;
  const paths = text.match(TRACKED_PATH_TOKEN) ?? [];
  return paths.some((pathToken) => TRACKED_PATHS.has(pathToken.replace(/^\.\//, "")));
}

function isStructuredVerdict(text) {
  if (typeof text !== "string") return false;
  const content = text.trim();
  if (INCOMPLETE_REVIEW.test(content)) return false;
  if (COMPLETE_FALSIFICATION.test(content)) return true;
  return FINDING_CLAUSE.test(content) && (hasResolvableSubject(content) || REVIEW_SUBJECT.test(content));
}

function printLimits() {
  console.log(
    "B4 content limit: accepts the complete falsification sentence or finding prose anchored to a known scenario/gate ID, tracked path, or named review subject; bare text, paths, and IDs are unverified.",
  );
  console.log("B4 identity limit: content shape cannot prove who read or cast the verdict.");
}

let range = process.argv.find((a) => a.startsWith("--since="))?.slice(8);

function notesFor(sha) {
  try {
    return execFileSync("git", ["notes", `--ref=${REF}`, "show", sha], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

if (process.argv.includes("--selfcheck")) {
  const cases = [
    ["no note is not a verdict", !isStructuredVerdict(null)],
    ['"looks fine" is not a verdict', !isStructuredVerdict("looks fine\n")],
    ["forty x characters are not a verdict", !isStructuredVerdict("x".repeat(40))],
    ["an aborted falsification is not a verdict", !isStructuredVerdict("attempted to falsify; review aborted")],
    ["an aborted review with missing credentials is not a verdict", !isStructuredVerdict("attempted to falsify; review aborted due to missing credentials")],
    ["a review that failed to start is not a verdict", !isStructuredVerdict("review failed to start; no files were read")],
    ["a bare tracked path is not a verdict", !isStructuredVerdict("deployment/SPEC.md")],
    ["a bare gate ID is not a verdict", !isStructuredVerdict("R6 notes")],
    ["the falsification sentence is", isStructuredVerdict("attempted to falsify; nothing found\n")],
    ["named findings are", isStructuredVerdict("S2 classifies extensionless files as code; LICENSE would be code. Accepted.\n")],
    ["plural findings are", isStructuredVerdict("deployment/SPEC.md findings were independently verified.")],
    ["the root-relative tracked path is", isStructuredVerdict("deployment/SPEC.md has a missing requirement.")],
    ["the ./tracked path is", isStructuredVerdict("./deployment/SPEC.md has a missing requirement.")],
    ["the existing 347f5b8 founder note is", isStructuredVerdict("Verdict (cast by the Fable 5 session on the founder's instruction, 2026-08-21; covers e2eda22 + 347f5b8): attempted to falsify via a four-lens adversarial review (consistency, buildability, floor-attack, production-practice) — 30+ raw findings, each independently verified against the files before landing; the kill list (attacks that died) is recorded in the session memory. Findings that survived became FD-24–FD-27 (founder-ruled, two-option choices with recommendation named) and the mechanical remediation in this commit pair. Full 29-gate chain green at both commits; harness 114 / engine 70 scenarios all BUILD-paired. The founder directed the squash and push.")],
    ["the 2026-08-08 founder note is", isStructuredVerdict("Accepted without independent review. Author's own falsification pass found and fixed four defects; no second reader. Recorded honestly.")],
  ];
  const failed = cases.filter(([, c]) => !c);
  if (failed.length) {
    console.log(`\nB4 SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  printLimits();
  process.exit(0);
}

if (range) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", range, "HEAD"], { stdio: "ignore" });
  } catch {
    console.log(`\nB4 — --since=${range} is not an ancestor of HEAD in this clone; walking the whole history instead.`);
    range = undefined;
  }
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
  } else if (!isStructuredVerdict(coveringNote)) {
    thin.push([sha, subject]);
  } else {
    covered++;
  }
}

console.log(`\nB4 — ${covered}/${commits.length} commit(s) covered by a structured verdict.`);
if (thin.length) {
  console.log(`\n  Cast but not structured — content did not match B4's verdict shape (SCENARIOS.md B4):`);
  for (const [sha, s] of thin) console.log(`    ${sha.slice(0, 7)}  ${s}`);
}
if (uncast.length) {
  console.log(`\n  No verdict (${uncast.length}):`);
  for (const [sha, s] of uncast.slice(0, 20)) console.log(`    ${sha.slice(0, 7)}  ${s}`);
  if (uncast.length > 20) console.log(`    … and ${uncast.length - 20} more`);
  console.log(`\n  Cast one:  git notes --ref=${REF} add -m "attempted to falsify; nothing found" <sha>`);
  console.log(`  Read them: git log --notes=${REF}`);
}
printLimits();
console.log(`\nB4 is a [DRILL] and this never refuses a commit — only the human can close it (SPEC.md §4).`);
