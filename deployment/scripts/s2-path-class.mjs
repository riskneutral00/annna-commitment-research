// S2 — the path-class check (deployment/SPEC.md §1, SCENARIOS.md S2): a commit
// whose changed paths span spec and code is refused. The spec change lands
// first; the code then builds to a spec someone already read. This is the one
// property the deleted vendored read-only tree was buying.
//
// Spec is decided by CLASS, not directory, deliberately: layer code will
// live beside its specs (harness/*.ts next to harness/SPEC.md), so a directory
// rule would be wrong the day the first .ts lands. `.md` is spec — and so is
// `.github/workflows/**` (F-37, 2026-08-31: SPEC.md §7 put the CI workflow
// definitions on the floor because a weakened workflow rides in with the code
// it stops catching — the exact ride commit c49c1d2 landed while this
// classifier read the workflow as code); everything else is code.
//
// IT CLASSIFIES THE RESULTING COMMIT, NOT THE INDEX (SPEC.md §7a item 1, fixed
// 2026-08-21). Under `git commit --amend` the staged set is only the NEW paths
// while the commit that lands carries HEAD's as well: commit the spec alone,
// then amend the code in, and a mixed commit landed with S2 printing OK. Git
// hands a hook no amend flag and no environment variable differs — probed, all
// seven GIT_* vars are identical — so the evidence is the `git commit`
// invocation that spawned the hook, read off the process ancestry. Where `ps`
// is unavailable the read fails closed to the old staged-set behaviour, and
// the CI range pass below catches what the hook missed.
//
// Three modes:
//   (no args)        the pending commit — the staged set, unioned with HEAD's
//                    paths when amending. Its home is .githooks/pre-commit.
//   --commit <rev>   one landed commit, diffed against its first parent.
//   --range <a>..<b> every commit in a pushed range. CI's mode: nothing is
//                    staged there, so the hook mode alone made "CI is the
//                    second reader" false for exactly this gate (§7a item 2).
import { execFileSync } from "node:child_process";
import assert from "node:assert";
import { pathToFileURL } from "node:url";

const git = (args, opts) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28, ...opts });
const zsplit = (s) => s.split("\0").filter(Boolean);

export const isSpec = (f) => f.endsWith(".md") || f.startsWith(".github/workflows/");
export const classify = (paths) => ({
  spec: paths.filter(isSpec),
  code: paths.filter((f) => !isSpec(f)),
});

// An `--amend` anywhere in a `git commit` invocation above this process.
export const isAmend = (commands) =>
  commands.some((c) => /(^|\/)git\b/.test(c) && /\bcommit\b/.test(c) && /(^|\s)--amend(\s|$)/.test(c));

// The command lines of this process's ancestors, nearest first. One `ps` call
// and an in-memory walk: a call per generation would be eight spawns per commit.
function ancestorCommands() {
  let table;
  try {
    table = execFileSync("ps", ["-Ao", "pid=,ppid=,args="], { encoding: "utf8", maxBuffer: 1 << 24 });
  } catch {
    return [];
  }
  const parent = new Map();
  const args = new Map();
  for (const line of table.split("\n")) {
    const m = line.match(/^\s*(\d+)\s+(\d+)\s+(.*)$/);
    if (!m) continue;
    parent.set(+m[1], +m[2]);
    args.set(+m[1], m[3]);
  }
  const out = [];
  for (let pid = process.ppid, hops = 0; pid > 1 && hops < 8; pid = parent.get(pid) ?? 0, hops++) {
    if (args.has(pid)) out.push(args.get(pid));
  }
  return out;
}

// A commit's first parent, or the empty tree for a root commit. Computed rather
// than hardcoded because the empty-tree hash differs under SHA-256.
function parentOf(rev) {
  try {
    return git(["rev-parse", "--verify", "-q", `${rev}^`], { stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return git(["hash-object", "-t", "tree", "--stdin"], { input: "" }).trim();
  }
}

export const commitPaths = (rev) => zsplit(git(["diff", "--name-only", "-z", parentOf(rev), rev]));

// What the commit about to be created will contain. Amending replaces HEAD, so
// the resulting commit's diff is against HEAD's parent, not against HEAD.
export function pendingPaths() {
  const amend = isAmend(ancestorCommands());
  const args = ["diff", "--cached", "--name-only", "-z"];
  if (amend) args.push(parentOf("HEAD"));
  return { paths: zsplit(git(args)), amend };
}

function report(label, paths) {
  const { spec, code } = classify(paths);
  if (!spec.length || !code.length) return 0;
  console.log(`\nS2 FAIL — spec and code in one commit. Land the spec first, then build to it.`);
  console.log(`  ${label}`);
  console.log(`  spec (${spec.length}): ${spec.join(", ")}`);
  console.log(`  code (${code.length}): ${code.join(", ")}`);
  return 1;
}

function selfcheck() {
  // The floor classes, asserted from both sides (SPEC.md §1 + §7's F-37 half).
  assert.deepStrictEqual(classify(["a/SPEC.md", "b/x.ts"]), { spec: ["a/SPEC.md"], code: ["b/x.ts"] }, "md is spec, ts is code");
  const wf = classify([".github/workflows/check.yml", "deployment/scripts/x.mjs"]);
  assert.deepStrictEqual(wf, { spec: [".github/workflows/check.yml"], code: ["deployment/scripts/x.mjs"] }, "a workflow file is FLOOR — the .yml+.mjs pair is a mixed commit now, which is the c49c1d2 ride this widening refuses");
  assert.strictEqual(isSpec(".github/workflows/anything.yaml"), true, "yaml too");
  assert.strictEqual(isSpec("harness/src/seams.ts"), false, "layer code stays code");
  assert.strictEqual(isSpec("workflows/check.yml"), false, "only the .github/workflows/ prefix is the floor, not any workflows/ directory");
  // The amend detector's canaries, unchanged.
  assert.strictEqual(isAmend(["/usr/bin/git commit --amend -m x"]), true);
  assert.strictEqual(isAmend(["git commit -m plain"]), false);
  console.log("S2 SELFCHECK OK — spec/code classes hold, the workflow floor and the amend detector fire");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--selfcheck")) {
    selfcheck();
    process.exit(0);
  }
  const flag = (name) => {
    const i = process.argv.indexOf(name);
    return i >= 0 ? process.argv[i + 1] : process.argv.find((a) => a.startsWith(`${name}=`))?.slice(name.length + 1);
  };
  const range = flag("--range");
  const commit = flag("--commit");
  let bad = 0;

  if (range || commit) {
    const revs = commit ? [commit] : git(["rev-list", "--reverse", range]).split("\n").filter(Boolean);
    for (const rev of revs) {
      const subject = git(["log", "-1", "--format=%s", rev]).trim();
      bad += report(`commit ${rev.slice(0, 9)} — ${subject}`, commitPaths(rev));
    }
    if (!bad) console.log(`\nS2 OK — ${revs.length} commit(s) classified, each spec-only or code-only`);
  } else {
    const { paths, amend } = pendingPaths();
    if (!paths.length) {
      console.log(
        `\nS2 SKIPPED — nothing staged. The path-class check classifies the commit about to be created; it bites in .githooks/pre-commit, where there is one.`,
      );
      process.exit(0);
    }
    bad = report(
      amend ? `the resulting commit (git commit --amend — HEAD's paths land in it too)` : `the staged set`,
      paths,
    );
    if (!bad) {
      const { spec } = classify(paths);
      console.log(
        `\nS2 OK — ${spec.length ? "spec" : "code"} only, ${paths.length} path(s) in the ${amend ? "amended" : "pending"} commit`,
      );
    }
  }
  process.exit(bad ? 1 : 0);
}
