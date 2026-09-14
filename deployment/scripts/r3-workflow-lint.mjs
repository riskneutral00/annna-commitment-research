// R3 — the model key is confined (deployment/SPEC.md §3, SCENARIOS.md R3): the
// model-provider secret is referenced only by the protected qualification
// environment. A workflow lint fails the build if any other lane references
// that secret or that environment.
//
// Static on purpose: key absence is proven by reading the workflows, never by a
// job grepping its own env — a job that can print the secret has already lost.
//
// The check is JOB-granular, and was file-granular until 2026-09-13
// (`SPEC.md §7a` item 18): a lane is a CI job class (`SPEC.md §2`), so a file
// carrying one qualification job AND one unrelated job that referenced the
// model secret passed while its OK line reported confinement. The reference and
// the qualification environment must now sit in the SAME job. A reference in
// the preamble is inherited by every job and no sibling qualification job
// protects it — the inheritance R6's preamble scan closed at item 6 — and a
// workflow-level `environment:` is not protection either: GitHub honours
// `environment` at job depth only, which is the depth R6 reads too.
//
// Residual bound, stated: the lint is syntactic. It reads workflow text for the
// named model-secret patterns and for the environment forms below, so a key
// reached under a name this pattern does not carry is still a blind spot, and a
// declared environment name is a configuration fact, never proof the
// environment is protected (§3's builder credential floor).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS = ".github/workflows";
const MODEL_SECRET = /OPENROUTER|MODEL_API_KEY|MODEL_KEY/;
// The site of a finding when it sits above `jobs:` rather than inside one job.
const WORKFLOW_LEVEL = "everything above `jobs:`";
// ...and when it sits in a root-level key written after the `jobs:` block.
const BELOW_JOBS =
  "a root-level `env:` or other key below `jobs:` (inherited by every job — no job-level environment protects it)";
const QUALIFICATION = "qualification";

const secretLines = (text) =>
  text.split("\n").filter((l) => MODEL_SECRET.test(l) && !/^\s*#/.test(l)).map((l) => l.trim());

// A job's `environment:` at EXACTLY four spaces — the job-block convention
// `r6-deploy-secret-scoping.mjs` already uses, and the depth GitHub honours.
// Matching any indentation is what lets an `environment: qualification` decoy
// inside a step launder the job, so a deeper match is refused, not read.
//
// Two supported forms: the scalar (`environment: qualification`) and the block
// name (`environment:` then `  name: qualification` among its own children).
// Anything else — an expression the text cannot resolve, a block with no
// `name:` — is reported as unsupported rather than guessed at, and an
// unsupported form is not qualification (§7a item 18).
function jobEnvironment(block) {
  const m = block.match(/^ {4}environment:(.*)$/m);
  if (!m) return { state: "none" };
  const withoutComment = (value) => {
    let quote;
    for (let i = 0; i < value.length; i += 1) {
      const char = value[i];
      if (quote) {
        if (char === quote && value[i - 1] !== "\\") quote = undefined;
      } else if (char === "\"" || char === "'") {
        quote = char;
      } else if (char === "#" && (i === 0 || /\s/.test(value[i - 1]))) {
        return value.slice(0, i).trim();
      }
    }
    return value.trim();
  };
  const normalized = (value) => {
    const trimmed = withoutComment(value);
    const quote = trimmed[0];
    return (quote === trimmed.at(-1) && (quote === "\"" || quote === "'"))
      ? trimmed.slice(1, -1)
      : trimmed;
  };
  const named = (value) =>
    value.includes("${{")
      ? { state: "unsupported", detail: `environment: ${value} — an expression this lint cannot resolve` }
      : { state: value === QUALIFICATION ? "qualification" : "other", name: value };
  const scalar = normalized(m[1]);
  if (scalar) return named(scalar);
  // Block form: only the lines that are this block's own children, so a `name:`
  // further down the job cannot be read as the environment's.
  const children = [];
  for (const line of block.slice(m.index + m[0].length).split("\n").slice(1)) {
    if (!line.trim()) continue;
    if (!/^ {6}\S/.test(line)) break;
    children.push(line);
  }
  const name = children.map((l) => l.match(/^ {6}name:(.*)$/)?.[1]).find((v) => v !== undefined);
  if (name === undefined) {
    return { state: "unsupported", detail: "a block `environment:` with no `name:` of its own" };
  }
  return named(normalized(name));
}

// One pure function, so the selfcheck below and the real walk read the same
// mechanism rather than two that can drift apart.
function modelKeyOutsideQualification(yaml) {
  const findings = [];
  const lines = yaml.split("\n");
  const jobsLine = lines.findIndex((line) => /^jobs:[ \t]*(?:#.*)?$/.test(line));
  const preamble = secretLines(jobsLine < 0 ? yaml : lines.slice(0, jobsLine).join("\n"));
  if (preamble.length) {
    findings.push([`${WORKFLOW_LEVEL} (inherited by every job — no job-level environment protects it)`, preamble]);
  }
  if (jobsLine < 0) return findings;

  const jobLines = lines.slice(jobsLine + 1);
  const rootBoundary = jobLines.findIndex((line) => /^[A-Za-z0-9_-]+:[ \t]*(?:#.*)?$/.test(line));
  const jobsBody = rootBoundary < 0 ? jobLines : jobLines.slice(0, rootBoundary);
  const trailingWorkflow = rootBoundary < 0 ? [] : jobLines.slice(rootBoundary);
  const headers = [];
  for (let i = 0; i < jobsBody.length; i += 1) {
    const name = jobsBody[i].match(/^  ([A-Za-z0-9_-]+):[ \t]*(?:#.*)?$/)?.[1];
    if (name) headers.push({ name, start: i });
  }

  for (let i = 0; i < headers.length; i += 1) {
    const { name, start } = headers[i];
    const end = headers[i + 1]?.start ?? jobsBody.length;
    const block = jobsBody.slice(start, end).join("\n");
    const hits = secretLines(block);
    if (!hits.length) continue;
    const env = jobEnvironment(block);
    if (env.state === "qualification") continue;
    const why =
      env.state === "none"
        ? "declares no environment"
        : env.state === "unsupported"
          ? `declares ${env.detail}`
          : `declares environment "${env.name}", not ${QUALIFICATION}`;
    findings.push([`job "${name}" ${why}`, hits]);
  }

  const scannedLines = new Set(headers.flatMap(({ start }, index) => {
    const end = headers[index + 1]?.start ?? jobsBody.length;
    return Array.from({ length: end - start }, (_, offset) => start + offset);
  }));
  const unscannedHits = jobsBody
    .filter((line, index) => !scannedLines.has(index))
    .filter((line) => MODEL_SECRET.test(line) && !/^\s*#/.test(line))
    .map((line) => line.trim());
  if (unscannedHits.length) {
    findings.push([
      "the jobs mapping uses an indentation this lint does not parse",
      unscannedHits,
    ]);
  }

  const trailingHits = secretLines(trailingWorkflow.join("\n"));
  if (trailingHits.length) findings.push([BELOW_JOBS, trailingHits]);
  return findings;
}

if (process.argv.includes("--selfcheck")) {
  const qualified = '\njobs:\n  qualify:\n    environment: qualification\n    steps:\n      - run: echo ${{ secrets.OPENROUTER_API_KEY }}\n';
  const cases = [
    ["a qualification job holding the model key is not a finding", modelKeyOutsideQualification(qualified).length === 0],
    [
      "the block `environment:` / `name:` form reads the same as the scalar",
      modelKeyOutsideQualification(
        '\njobs:\n  qualify:\n    environment:\n      name: qualification\n      deployment-branch-policy: true\n    steps:\n      - run: echo ${{ secrets.MODEL_API_KEY }}\n',
      ).length === 0,
    ],
    [
      "quoted and commented scalar qualification reads the same as bare",
      modelKeyOutsideQualification(
        '\njobs:\n  qualify:\n    environment: "qualification" # lane\n    steps:\n      - run: echo ${{ secrets.MODEL_KEY }}\n',
      ).length === 0,
    ],
    [
      "quoted and commented block qualification survives blank lines",
      modelKeyOutsideQualification(
        '\njobs:\n  qualify:\n    environment:\n\n      name: "qualification" # lane\n      deployment-branch-policy: true\n    steps:\n      - run: echo ${{ secrets.MODEL_API_KEY }}\n',
      ).length === 0,
    ],
    ["a job with no model-key reference is not a finding", modelKeyOutsideQualification("\njobs:\n  check:\n    steps:\n      - run: npm run check\n").length === 0],
    // The bypass item 18 named: one qualification job laundering a sibling.
    [
      "a sibling qualification job does not protect an unrelated job",
      modelKeyOutsideQualification(qualified + "  unrelated:\n    steps:\n      - run: echo ${{ secrets.OPENROUTER_API_KEY }}\n").length === 1,
    ],
    [
      "and the finding names the unrelated job",
      modelKeyOutsideQualification(qualified + "  unrelated:\n    steps:\n      - run: echo ${{ secrets.OPENROUTER_API_KEY }}\n")[0][0].startsWith('job "unrelated"'),
    ],
    [
      "a commented sibling header is still a separate unrelated job",
      modelKeyOutsideQualification(qualified + "  unrelated: # ordinary lane\n    steps:\n      - run: echo ${{ secrets.OPENROUTER_API_KEY }}\n")[0][0].startsWith('job "unrelated"'),
    ],
    [
      "unsupported job indentation fails closed",
      modelKeyOutsideQualification(
        "\njobs:\n    leak:\n        steps:\n          - run: echo ${{ secrets.OPENROUTER_API_KEY }}\n",
      ).length === 1,
    ],
    // R6's item-6 inheritance, in R3's subject: hoisting the reference above
    // `jobs:` hands it to every job, and no job-level environment takes it back.
    [
      "a preamble reference is caught despite a qualification job below it",
      modelKeyOutsideQualification("env:\n  K: ${{ secrets.OPENROUTER_API_KEY }}\n" + qualified).length === 1,
    ],
    [
      "and it is reported at workflow level, not as a job",
      modelKeyOutsideQualification("env:\n  K: ${{ secrets.OPENROUTER_API_KEY }}\n" + qualified)[0][0].startsWith(WORKFLOW_LEVEL),
    ],
    ["a commented-out reference is not a finding", modelKeyOutsideQualification("# OPENROUTER_API_KEY\njobs:\n  c:\n    steps: []\n").length === 0],
    // Workflow-level `environment:` is not protection — GitHub honours it at job
    // depth only, so inheriting it here would invent a protection that is not there.
    [
      "a workflow-level environment: string does not protect a job",
      modelKeyOutsideQualification("environment: qualification\n" + "\njobs:\n  leak:\n    steps:\n      - run: echo ${{ secrets.MODEL_KEY }}\n").length === 1,
    ],
    // The decoy R6 met too: `environment:` written one level deeper, inside a step.
    [
      "a step-level environment: does NOT qualify the job",
      modelKeyOutsideQualification(
        "\njobs:\n  leak:\n    steps:\n      - name: fake\n        environment: qualification\n      - run: echo ${{ secrets.OPENROUTER_API_KEY }}\n",
      ).length === 1,
    ],
    [
      "a workflow-level secret after jobs is still caught",
      modelKeyOutsideQualification(
        qualified + "\nenv:\n  TOKEN: ${{ secrets.MODEL_KEY }}\n",
      ).length === 1,
    ],
    [
      "and it is reported as below `jobs:`, not above it",
      modelKeyOutsideQualification(qualified + "\nenv:\n  TOKEN: ${{ secrets.MODEL_KEY }}\n")[0][0] === BELOW_JOBS,
    ],
    [
      "another environment name is a finding that says which",
      modelKeyOutsideQualification("\njobs:\n  leak:\n    environment: production\n    steps:\n      - run: echo ${{ secrets.MODEL_KEY }}\n")[0][0].includes('"production"'),
    ],
    // Unsupported forms are refused explicitly rather than read as qualification.
    [
      "an expression environment is refused, not resolved",
      modelKeyOutsideQualification("\njobs:\n  leak:\n    environment: ${{ inputs.env }}\n    steps:\n      - run: echo ${{ secrets.MODEL_KEY }}\n")[0][0].includes("cannot resolve"),
    ],
    [
      "a block environment with no name: is refused",
      modelKeyOutsideQualification("\njobs:\n  leak:\n    environment:\n      deployment-branch-policy: true\n    steps:\n      - run: echo ${{ secrets.MODEL_KEY }}\n")[0][0].includes("no `name:`"),
    ],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nR3 SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

const findings = [];
for (const name of existsSync(WORKFLOWS) ? readdirSync(WORKFLOWS) : []) {
  if (!/\.ya?ml$/.test(name)) continue;
  for (const [where, hits] of modelKeyOutsideQualification(readFileSync(join(WORKFLOWS, name), "utf8"))) {
    findings.push(`${WORKFLOWS}/${name} — ${where}:\n      ${hits.join("\n      ")}`);
  }
}

if (findings.length) {
  console.log(`\nR3 FAIL — the model key is referenced outside the qualification lane:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(`\nR3 OK — no workflow job references the model key outside its own qualification environment. Syntactic bound: this reads declarations, never a running job's env (SPEC.md §7a item 18).`);
