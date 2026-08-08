// S2 — the path-class check (deployment/SPEC.md §1, SCENARIOS.md S2): a commit
// whose changed paths span spec and code is refused. The spec change lands
// first; the code then builds to a spec someone already read. This is the one
// property the deleted vendored read-only tree was buying.
//
// Spec is decided by EXTENSION, not directory, deliberately: layer code will
// live beside its specs (harness/*.ts next to harness/SPEC.md), so a directory
// rule would be wrong the day the first .ts lands. `.md` is spec; everything
// else is code.
//
// It reads the STAGED set, so its home is .githooks/pre-commit. Run anywhere
// else there is usually nothing staged, and it says so rather than passing
// quietly — the reactive-push-check pattern.
import { execFileSync } from "node:child_process";

const staged = execFileSync("git", ["diff", "--cached", "--name-only", "-z"], {
  encoding: "utf8",
  maxBuffer: 1 << 28,
})
  .split("\0")
  .filter(Boolean);

if (!staged.length) {
  console.log(
    `\nS2 SKIPPED — nothing staged. The path-class check classifies the staged set; it bites in .githooks/pre-commit, where there always is one.`,
  );
  process.exit(0);
}

const spec = staged.filter((f) => f.endsWith(".md"));
const code = staged.filter((f) => !f.endsWith(".md"));

if (spec.length && code.length) {
  console.log(`\nS2 FAIL — spec and code in one commit. Land the spec first, then build to it.`);
  console.log(`  spec (${spec.length}): ${spec.join(", ")}`);
  console.log(`  code (${code.length}): ${code.join(", ")}`);
  process.exit(1);
}
console.log(`\nS2 OK — ${spec.length ? "spec" : "code"} only, ${staged.length} staged path(s)`);
