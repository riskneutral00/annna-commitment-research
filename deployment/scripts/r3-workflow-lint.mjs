// R3 — the model key is confined (deployment/SPEC.md §3, SCENARIOS.md R3): the
// model-provider secret is referenced only by the protected qualification
// environment. A workflow lint fails the build if any other lane references
// that secret or that environment.
//
// Static on purpose: key absence is proven by reading the workflows, never by a
// job grepping its own env — a job that can print the secret has already lost.
//
// Ceiling, stated: the check is FILE-granular, not job-granular. A workflow
// that references the model secret must declare the qualification environment
// somewhere in the file; it cannot prove the reference and the environment sit
// in the same job. Splitting the model lane into its own workflow file makes
// the two identical, which is the shape SPEC §3 describes anyway.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS = ".github/workflows";
const MODEL_SECRET = /OPENROUTER|MODEL_API_KEY|MODEL_KEY/;
const QUALIFICATION = /^\s*environment:\s*\n?\s*(name:\s*)?qualification\b/m;

const findings = [];
for (const name of existsSync(WORKFLOWS) ? readdirSync(WORKFLOWS) : []) {
  if (!/\.ya?ml$/.test(name)) continue;
  const text = readFileSync(join(WORKFLOWS, name), "utf8");
  const hits = text.split("\n").filter((l) => MODEL_SECRET.test(l) && !/^\s*#/.test(l));
  if (hits.length && !QUALIFICATION.test(text)) {
    findings.push(
      `${WORKFLOWS}/${name} — references the model secret but declares no qualification environment:\n      ${hits.join("\n      ")}`,
    );
  }
}

if (findings.length) {
  console.log(`\nR3 FAIL — the model key is referenced outside the qualification lane:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(`\nR3 OK — no workflow lane references the model key outside a qualification environment`);
