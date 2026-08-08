// R2 — the closed service is unreachable below production (deployment/SPEC.md
// §3, SCENARIOS.md R2): no closed-marketplace-service credential and no real
// base URL exists anywhere below production. Static, because the property is an
// ABSENCE — you cannot attempt a call with a credential that does not exist
// (SCENARIOS.md preamble on how [MUST]s over absences are verified).
//
// Markdown is out of scope and this file excludes itself, for the reason
// x1-secret-grep.mjs states: a gate that reddens on its own source, or on the
// spec that describes it, is a gate nobody keeps.
//
// Matching is in JS, not `git grep -E`. See egress-lint.mjs — POSIX ERE has no
// \b, and a selfcheck on a different engine from the real pass proves nothing.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SKIP = /\.(md|jpg|jpeg|png|gif|webp|ico|pdf|zip|lock)$/i;
const SELF = "deployment/scripts/r2-closed-service.mjs";
// Lockfiles are generated dependency manifests, not code anyone wrote a URL
// into. Scanning them turns this gate into a hundred npm-registry lines nobody
// reads, and a gate people learn to scroll past is worse than no gate
// (SPEC.md §0). Dependency provenance is a different problem with a different
// tool; R2 is about a path to the CLOSED SERVICE.
const GENERATED = (f) => f.endsWith("-lock.json") || f.includes("/_generated/");

// The closed marketplace service has no vendor yet, so this matches on SHAPE
// rather than on a name nobody has chosen: an identifier tying a credential to
// the marketplace/store/closed service, and any absolute URL that is not one of
// the hosts the corpus already declares it talks to.
const CREDENTIAL = /\b(MARKETPLACE|STORE|CLOSED_SERVICE|CLOSED_API)_[A-Z0-9_]*(KEY|SECRET|TOKEN|CREDENTIAL|PASSWORD)\b/;
const URL_LITERAL = /https?:\/\/[^\s"'`)]+/g;
const DECLARED_HOSTS = [
  "openrouter.ai", // the model provider, qualification lane only (R3)
  "convex.cloud", // the engine's own deployment (engine/BUILD.md Step 0)
  "convex.dev",
  "github.com", // provenance links in config and workflows
  "schema.org",
  "www.w3.org", // xmlns in svg/html
  "localhost",
];
// `example.com` was on this list as "the corpus's own placeholder" and had to
// come off: the corpus is markdown and markdown is already out of scope, so the
// entry protected nothing and allowed an exfil target that reads as innocuous.
// A declared host earns its place by being one the code genuinely talks to.

function offences(text) {
  const found = [];
  for (const line of text.split("\n")) {
    if (CREDENTIAL.test(line)) found.push(["a closed-service credential identifier", line]);
    for (const url of line.match(URL_LITERAL) ?? []) {
      const host = url.replace(/^https?:\/\//, "").split(/[/:?#]/)[0];
      if (!DECLARED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
        found.push([`an undeclared service URL (${host})`, line]);
      }
    }
  }
  return found;
}

if (process.argv.includes("--selfcheck")) {
  const cases = [
    ["a marketplace credential is caught", offences("const k = process.env.MARKETPLACE_API_SECRET").length === 1],
    ["a store token is caught", offences("STORE_ACCESS_TOKEN=x").length === 1],
    ["an undeclared host is caught", offences('await post("https://closed.vendor.io/v1/orders")').length === 1],
    // `request(` rather than the obvious verb: egress-lint.mjs reads this file
    // and a literal call verb in a fixture is indistinguishable from a call.
    // Fix the fixture, never the gate.
    ["a declared host is not", offences('request("https://openrouter.ai/api/v1")').length === 0],
    ["a declared host's subdomain is not", offences('"https://upbeat-bulldog-541.convex.cloud"').length === 0],
    ["ordinary code is not", offences("const total = price * qty").length === 0],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nR2 SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

const findings = [];
for (const f of execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean)) {
  if (SKIP.test(f) || f === SELF || GENERATED(f)) continue;
  for (const [what, line] of offences(readFileSync(f, "utf8"))) {
    findings.push(`${f} — ${what}: ${line.trim().slice(0, 100)}`);
  }
}

if (findings.length) {
  console.log(`\nR2 FAIL — a path to the closed service exists below production:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(`\nR2 OK — no closed-service credential, and no URL outside the ${DECLARED_HOSTS.length} declared hosts`);
