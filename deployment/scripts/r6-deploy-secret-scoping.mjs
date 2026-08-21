// R6 — no deploy secret meets agent-authored code (deployment/SPEC.md §3/§5,
// SCENARIOS.md R6): no deploy or production secret is present in any CI job
// that executes agent-authored code. A prompt-injected builder must have
// nothing worth exfiltrating.
//
// The static half only. R6 also names an env-dump canary proving absence at
// runtime; that needs a job that HOLDS a deploy secret to dump, and no rung
// exists to issue one (SPEC.md §8 DR-8). CI fires now (FD-6 reversed
// 2026-08-08), so what is missing is the secret, not the event.
//
// What "executes agent-authored code" means here: every job except one running
// inside a protected environment. A protected environment has a human required
// reviewer (R8), which is the thing that makes it not-agent-fired.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS = ".github/workflows";
// Provider names accumulate here and are never removed. FD-11 moved hosting to
// Cloudflare, and CLOUDFLARE_API_TOKEN matched nothing in the old list — a host
// swap that forgets this line leaves the gate green while it stops catching the
// one thing it exists to catch. VERCEL stays for the same reason in reverse: a
// leftover token from a former provider is still a deploy secret.
const DEPLOY_SECRET = /secrets\.[A-Z0-9_]*(DEPLOY|PROD|CLOUDFLARE|VERCEL|CLERK_SECRET|RESEND|CONVEX_DEPLOY)[A-Z0-9_]*/g;
// The site of a finding when it sits above `jobs:` rather than inside one job.
const WORKFLOW_LEVEL = "everything above `jobs:`";

// A job is `  name:` at two spaces under `jobs:`; `environment:` anywhere in it
// puts it behind a protected environment. Deliberately a shallow scan, not a
// YAML parse: the corpus has one workflow file and adding a parser dependency
// to read it would be the larger risk.
//
// THE PREAMBLE IS SCANNED TOO (SPEC.md §7a item 6, fixed 2026-08-21). Everything
// above `jobs:` — a workflow-level `env:` block above all else — is inherited by
// every job in the file, and no job-level `environment:` can protect what was
// already handed to all of them. The old scan started at `jobs:`, so a deploy
// secret hoisted to the top of the file was invisible to the gate whose whole
// subject is deploy secrets reachable from agent-authored code. Job-level `env:`
// needed no fix: it already sits inside its job's block.
function unprotectedJobsWithDeploySecrets(yaml) {
  const findings = [];
  const jobsAt = yaml.indexOf("\njobs:");
  const preamble = [...new Set((jobsAt < 0 ? yaml : yaml.slice(0, jobsAt)).match(DEPLOY_SECRET) ?? [])];
  if (preamble.length) findings.push([WORKFLOW_LEVEL, preamble]);
  if (jobsAt < 0) return findings;
  const blocks = yaml.slice(jobsAt).split(/\n(?=  [A-Za-z0-9_-]+:[ \t]*$)/m);
  for (const block of blocks) {
    const name = block.match(/^\s*([A-Za-z0-9_-]+):\s*$/m)?.[1];
    if (!name || name === "jobs") continue;
    const secrets = [...new Set(block.match(DEPLOY_SECRET) ?? [])];
    // JOB-level `environment:` only — exactly four spaces. GitHub honours it
    // nowhere else, and the first version matched any indentation, so an
    // `environment:` decoy inside a step defeated the whole gate. A guard that
    // a bypass can satisfy by being written one level deeper is not a guard.
    if (secrets.length && !/^ {4}environment:/m.test(block)) {
      findings.push([name, secrets]);
    }
  }
  return findings;
}

if (process.argv.includes("--selfcheck")) {
  const bare = "\njobs:\n  build:\n    steps:\n      - run: echo ${{ secrets.VERCEL_TOKEN }}\n";
  const guarded = "\njobs:\n  deploy:\n    environment: production\n    steps:\n      - run: echo ${{ secrets.VERCEL_TOKEN }}\n";
  const clean = "\njobs:\n  check:\n    steps:\n      - run: npm run check\n";
  const cases = [
    ["a bare job holding a deploy secret is caught", unprotectedJobsWithDeploySecrets(bare).length === 1],
    ["the same job behind an environment is not", unprotectedJobsWithDeploySecrets(guarded).length === 0],
    ["a job with no secrets is not", unprotectedJobsWithDeploySecrets(clean).length === 0],
    ["the finding names the job", unprotectedJobsWithDeploySecrets(bare)[0][0] === "build"],
    // The current host's token, asserted by name. Added with FD-11 because the
    // pattern silently matched no Cloudflare secret before it, and a matcher
    // nothing exercises is a matcher nobody notices is wrong.
    [
      "the current host's deploy token is caught",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  build:\n    steps:\n      - run: echo ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    // The bypass §7a item 6 named: hoist the secret above `jobs:`, where every
    // job inherits it and no job-level `environment:` can protect it.
    [
      "a workflow-level env: block is caught",
      unprotectedJobsWithDeploySecrets(
        "name: x\nenv:\n  TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n\njobs:\n  build:\n    steps:\n      - run: npm test\n",
      ).length === 1,
    ],
    [
      "and it is reported at workflow level, not as a job",
      unprotectedJobsWithDeploySecrets("env:\n  T: ${{ secrets.VERCEL_TOKEN }}\njobs:\n  b:\n    steps: []\n")[0][0] === WORKFLOW_LEVEL,
    ],
    [
      "a protected job below it does not launder it",
      unprotectedJobsWithDeploySecrets(
        "env:\n  T: ${{ secrets.PROD_KEY }}\n\njobs:\n  deploy:\n    environment: production\n    steps: []\n",
      ).length === 1,
    ],
    ["a preamble with no secret is not a finding", unprotectedJobsWithDeploySecrets("name: check\non:\n  push:\n" + clean).length === 0],
    // The bypass this gate shipped with: a decoy `environment:` inside a step.
    [
      "a step-level environment: does NOT protect the job",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  build:\n    steps:\n      - name: fake\n        environment: decoy\n      - run: echo ${{ secrets.VERCEL_TOKEN }}\n",
      ).length === 1,
    ],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nR6 SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

const findings = [];
for (const name of existsSync(WORKFLOWS) ? readdirSync(WORKFLOWS) : []) {
  if (!/\.ya?ml$/.test(name)) continue;
  for (const [job, secrets] of unprotectedJobsWithDeploySecrets(readFileSync(join(WORKFLOWS, name), "utf8"))) {
    const where = job === WORKFLOW_LEVEL ? `${WORKFLOW_LEVEL} (inherited by every job)` : `job "${job}"`;
    findings.push(`${WORKFLOWS}/${name} — ${where} runs agent-authored code and holds ${secrets.join(", ")}`);
  }
}

if (findings.length) {
  console.log(`\nR6 FAIL — a deploy or production secret is reachable from agent-authored code:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(`\nR6 OK — no unprotected job holds a deploy/production secret. The env-dump canary is NOT YET RUNNABLE: it needs a job holding a deploy secret to dump, and no rung issues one (SPEC.md §8 DR-8).`);
