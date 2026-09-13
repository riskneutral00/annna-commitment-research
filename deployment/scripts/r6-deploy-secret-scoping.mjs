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
// What "executes agent-authored code" means here. The first version read it as
// "every job except one running inside a protected environment", and a job
// declaring `environment:` was taken as not-agent-fired because a protected
// environment has a human required reviewer (R8). That reading is what SPEC.md
// §3's builder credential floor corrected 2026-09-13: **an environment name is
// a configuration fact, never evidence of isolation** — a job running this
// repository's own test scripts passed under any label, recognized or
// invented. So the subject here is what the job HOLDS and what it RUNS, not
// what it calls itself: a job holding a deploy secret is refused when it
// executes this repository's code, whatever environment it declares. The
// declared reviewer stands and nothing here removes it (INTERFACES.md §3).
//
// THE BOUND, AND IT DOES NOT SHRINK: this is a static read of workflow text.
// It cannot prove a named GitHub environment is really protected — that a real
// required reviewer sits on it is the environment's own setting, invisible to
// the tree — and it cannot prove a running job lacks the secret, which is R6's
// env-dump canary. Both are owed at BUILD.md Step 2 (§8 DR-8), where a rung
// first issues a deploy secret. No deployment architecture is ruled here
// either: a lane that only publishes a prebuilt artifact satisfies the floor,
// and so does any other shape that does not run this tree's code.
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

// Forms that execute code from THIS repository inside a job. Named rather than
// inferred from `run:` at large, because `run:` at large is not repository
// code — `npx wrangler pages deploy dist` publishes a built artifact and runs
// nothing the agent authored. The residual bound is that the list is syntactic:
// a repository script reached under a spelling no pattern here carries is a
// blind spot, the same class as R3's named-pattern bound (SPEC.md §7a item 18).
const REPOSITORY_EXECUTION = [
  [
    /\b(?:npm|pnpm|yarn)\s+(?:(?:--[A-Za-z0-9][\w-]*(?:=[^\s]+|\s+(?!-)\S+)?|-{1,2}[A-Za-z][\w-]*)\s+)*(?:ci|install|i|test|t|run)\b/,
    "a package-manager lifecycle or repository script",
  ],
  [/\b(?:vitest|jest|mocha)\b/, "a test runner over this tree"],
  [/\b(?:node|bash|sh|python3?)\s+\.?\/?[\w./-]+\.(?:mjs|cjs|js|ts|sh|py)\b/, "an interpreter on a repository file"],
  [/uses:\s*\.\//, "a local composite action from this repository"],
];

// A plain environment name the scan can actually read. Quoted or bare.
const PLAIN_NAME = /^["']?[A-Za-z0-9][\w .-]*["']?$/;

// JOB-level `environment:` only — exactly four spaces. GitHub honours it
// nowhere else, and the first version matched any indentation, so an
// `environment:` decoy inside a step defeated the whole gate. A guard that a
// bypass can satisfy by being written one level deeper is not a guard.
//
// Two declaration forms are supported: the scalar `environment: production` and
// the block form whose `name:` is a plain scalar. Anything else — an
// expression the text does not resolve, a flow mapping, an anchor, a block with
// no `name:` — FAILS CLOSED and is reported. The scan cannot say what such a
// declaration resolves to, and a gate that reads an unreadable declaration as
// satisfied is a gate whose bypass is a syntax choice.
function jobEnvironment(block) {
  const m = block.match(/^ {4}environment:(.*)$/m);
  if (!m) return { kind: "none" };
  const inline = m[1].trim();
  if (inline) {
    return PLAIN_NAME.test(inline)
      ? { kind: "named", name: inline.replace(/["']/g, "") }
      : { kind: "unsupported", raw: inline };
  }
  const nested = block.slice(m.index + m[0].length).split(/\n(?= {0,4}\S)/)[0];
  const name = nested.match(/^ {6,}name:(.*)$/m)?.[1].trim();
  if (name === undefined) return { kind: "unsupported", raw: "a block form with no `name:`" };
  return PLAIN_NAME.test(name)
    ? { kind: "named", name: name.replace(/["']/g, "") }
    : { kind: "unsupported", raw: name };
}

// A job is `  name:` at two spaces under `jobs:`. Deliberately a shallow scan,
// not a YAML parse: the corpus has one workflow file and adding a parser
// dependency to read it would be the larger risk.
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
  if (preamble.length) findings.push([WORKFLOW_LEVEL, preamble, "is inherited by every job, and no job-level `environment:` below can protect it"]);
  if (jobsAt < 0) return findings;
  const blocks = yaml.slice(jobsAt).split(/\n(?=  [A-Za-z0-9_-]+:[ \t]*$)/m);
  for (const block of blocks) {
    const name = block.match(/^\s*([A-Za-z0-9_-]+):\s*$/m)?.[1];
    if (!name || name === "jobs") continue;
    const secrets = [...new Set(block.match(DEPLOY_SECRET) ?? [])];
    if (!secrets.length) continue;
    const env = jobEnvironment(block);
    const executes = REPOSITORY_EXECUTION.find(([re]) => re.test(block));
    if (executes) {
      const label = env.kind === "named" ? ` inside environment "${env.name}"` : "";
      findings.push([name, secrets, `runs ${executes[1]}${label} — a name is not isolation`]);
    } else if (env.kind === "none") {
      findings.push([name, secrets, "declares no job-level `environment:`"]);
    } else if (env.kind === "unsupported") {
      findings.push([name, secrets, `declares an \`environment:\` this static scan cannot resolve (${env.raw})`]);
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
    // Renamed with the 2026-09-13 correction: what clears this job is that it
    // runs none of this repository's code, not that it carries a label.
    ["a job running no repository code under a named environment is not", unprotectedJobsWithDeploySecrets(guarded).length === 0],
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
    // The demonstrated defect SPEC.md §3's builder credential floor names
    // (AP-07, 2026-09-13): the pinned mechanism returned zero findings for all
    // six cases below. A repository-test job holding a deploy token passed
    // under an invented label, under a recognized one, and under the block
    // form; an environment the text cannot resolve passed; so did a block form
    // with no `name:`; so did a local composite action, which is this tree's
    // code by definition. Each is now a finding.
    [
      "an INVENTED environment does not clear a repository-test job",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: totally-made-up\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm run check\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "nor does a RECOGNIZED one",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: production\n    steps:\n      - run: npm test\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "nor does the block form",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment:\n      name: production\n      url: ${{ steps.publish.outputs.page-url }}\n    steps:\n      - run: npx vitest run\n        env:\n          T: ${{ secrets.PROD_KEY }}\n",
      ).length === 1,
    ],
    [
      "an arbitrary environment does not clear npm --prefix engine test",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: totally-made-up\n    steps:\n      - run: npm --prefix engine test\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "a recognized environment does not clear npm --prefix engine test",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: production\n    steps:\n      - run: npm --prefix engine test\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "an arbitrary environment does not clear npm --prefix harness test",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: totally-made-up\n    steps:\n      - run: npm --prefix harness test\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "a recognized environment does not clear npm --prefix harness test",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: production\n    steps:\n      - run: npm --prefix harness test\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "an arbitrary environment does not clear npm --prefix engine ci",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: totally-made-up\n    steps:\n      - run: npm --prefix engine ci\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "a recognized environment does not clear npm --prefix engine ci",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    environment: production\n    steps:\n      - run: npm --prefix engine ci\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "the finding says the name is not isolation",
      /a name is not isolation/.test(
        unprotectedJobsWithDeploySecrets(
          "\njobs:\n  test:\n    environment: production\n    steps:\n      - run: npm test\n        env:\n          T: ${{ secrets.PROD_KEY }}\n",
        )[0]?.[2] ?? "",
      ),
    ],
    // Fail closed: an environment this scan cannot read is not a protection it
    // may credit. Both forms below run no repository code, so the ONLY reason
    // they are findings is the unreadable declaration.
    [
      "an expression environment fails closed",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  deploy:\n    environment: ${{ inputs.target }}\n    steps:\n      - uses: actions/download-artifact@v4\n      - run: npx wrangler pages deploy dist\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "a block form with no name: fails closed",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  deploy:\n    environment:\n      url: ${{ steps.publish.outputs.page-url }}\n    steps:\n      - run: npx wrangler pages deploy dist\n        env:\n          T: ${{ secrets.VERCEL_TOKEN }}\n",
      ).length === 1,
    ],
    [
      "a local composite action is this repository's code",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  deploy:\n    environment: production\n    steps:\n      - uses: ./.github/actions/publish\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 1,
    ],
    // A protected sibling launders nothing: the unprotected job is its own
    // block and its own finding, which is the sibling-decoy shape.
    [
      "a protected sibling does not launder an unprotected test job",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  test:\n    steps:\n      - run: npm run check\n        env:\n          T: ${{ secrets.CONVEX_DEPLOY_KEY }}\n  deploy:\n    environment: production\n    steps: []\n",
      )[0]?.[0] === "test",
    ],
    // The positive controls, and the reason no deployment architecture is
    // ruled here: an artifact-only lane passes under either supported form,
    // and so would any other shape that runs none of this tree's code. Passing
    // is a statement about the workflow text and about nothing else.
    [
      "an artifact-only deploy under a scalar environment passes",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  deploy:\n    environment: production\n    steps:\n      - uses: actions/download-artifact@v4\n      - run: npx wrangler pages deploy dist\n        env:\n          T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n",
      ).length === 0,
    ],
    [
      "and under the block form",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  deploy:\n    environment:\n      name: production\n      url: ${{ steps.publish.outputs.page-url }}\n    steps:\n      - uses: actions/download-artifact@v4\n      - run: npx wrangler pages deploy dist\n        env:\n          T: ${{ secrets.PROD_KEY }}\n",
      ).length === 0,
    ],
    [
      "an unprivileged job running the whole suite passes",
      unprotectedJobsWithDeploySecrets(
        "\njobs:\n  check:\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm run check\n",
      ).length === 0,
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
  for (const [job, secrets, why] of unprotectedJobsWithDeploySecrets(readFileSync(join(WORKFLOWS, name), "utf8"))) {
    const where = job === WORKFLOW_LEVEL ? WORKFLOW_LEVEL : `job "${job}"`;
    findings.push(`${WORKFLOWS}/${name} — ${where} holds ${secrets.join(", ")} and ${why}`);
  }
}

if (findings.length) {
  console.log(`\nR6 FAIL — a deploy or production secret is reachable from agent-authored code:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(
  `\nR6 OK — no job holding a deploy/production secret runs this repository's code, and every such job declares an environment this scan can read.` +
    `\n  WHAT THIS DOES NOT SAY: a static read of workflow text cannot prove a named GitHub environment is actually protected — that a real required reviewer sits on it is the environment's own setting, invisible to the tree (SPEC.md §3, "an environment name is a configuration fact, never evidence of isolation").` +
    `\n  The env-dump canary is NOT YET RUNNABLE: it needs a job holding a deploy secret to dump, and no rung issues one. Both are owed at BUILD.md Step 2 (SPEC.md §8 DR-8).`,
);
