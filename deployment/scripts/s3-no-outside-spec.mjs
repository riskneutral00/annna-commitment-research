// S3 — no spec from outside the commit (deployment/SPEC.md §1, SCENARIOS.md S3):
// the text the reviewer read and the text gate-coverage.mjs enforced must be
// provably the same text. Static, over workflows and config — no submodule, no
// checkout of another repository, no fetch in a workflow step.
//
// Stated as no-fetch, not "no network route": egress absence is not provable on
// a shared runner, so this checks what is DECLARED, which is the half that is
// checkable. A workflow that fetches spec text is caught; a compromised runner
// is not, and no static check could claim otherwise.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS = ".github/workflows";
const FETCHES = [
  [/^\s*repository:\s*\S+/m, "a checkout step naming another repository"],
  [/\b(curl|wget)\s/, "a curl/wget fetch"],
  [/\bgit\s+clone\b/, "a git clone"],
  [/\bgh\s+(repo\s+clone|api)\b/, "a gh repo clone / gh api call"],
];

const findings = [];
if (existsSync(".gitmodules")) {
  findings.push(`.gitmodules exists — a submodule is spec content from outside this commit`);
}
for (const name of existsSync(WORKFLOWS) ? readdirSync(WORKFLOWS) : []) {
  if (!/\.ya?ml$/.test(name)) continue;
  const text = readFileSync(join(WORKFLOWS, name), "utf8");
  for (const [re, what] of FETCHES) {
    if (re.test(text)) findings.push(`${WORKFLOWS}/${name} — ${what}`);
  }
}

if (findings.length) {
  console.log(`\nS3 FAIL — spec content can enter from outside the checked-out commit:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(`\nS3 OK — no submodule, and no workflow fetches from outside the commit`);
