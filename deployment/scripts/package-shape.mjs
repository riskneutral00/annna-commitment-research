// Package-shape latch (AGENTS.md "Package shape"): every package carries the five
// files a builder is told to expect. The shape is green today by discipline
// alone — nothing stops the eighth package landing without INTERFACES.md, and a
// missing seam file is invisible until someone builds against the seam that
// isn't there.
//
// A package is DISCOVERED, not listed: any tracked `<dir>/SPEC.md` makes <dir> a
// package. A hardcoded roster would pass a new package by omitting it — the exact
// failure this exists to stop.
import { execFileSync } from "node:child_process";

const REQUIRED = ["README.md", "SPEC.md", "INTERFACES.md", "SCENARIOS.md", "BUILD.md"];
// AGENTS.md "Package shape", Deviations: model/ is graded rather than built, so
// its acceptance file is EVALS.md. Substitution, not exemption — it still needs
// an acceptance file, just a differently named one.
const SUBSTITUTE = { model: { "SCENARIOS.md": "EVALS.md" } };

const expected = (pkg) => REQUIRED.map((f) => SUBSTITUTE[pkg]?.[f] ?? f);
const missing = (pkg, present) => expected(pkg).filter((f) => !present.has(f));

if (process.argv.includes("--selfcheck")) {
  const full = new Set(REQUIRED);
  const without = (f) => new Set(REQUIRED.filter((r) => r !== f));
  const modelShape = new Set([...without("SCENARIOS.md"), "EVALS.md"]);
  const cases = [
    ["a complete package passes", missing("engine", full).length === 0],
    ["a package without INTERFACES.md fails on it", missing("engine", without("INTERFACES.md"))[0] === "INTERFACES.md"],
    ["model/ satisfies acceptance with EVALS.md", missing("model", modelShape).length === 0],
    ["model/ still needs SPEC.md", missing("model", new Set(["README.md", "INTERFACES.md", "EVALS.md", "BUILD.md"]))[0] === "SPEC.md"],
    ["SCENARIOS.md does not satisfy model/", missing("model", full).includes("EVALS.md")],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nSHAPE SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

const tops = new Map();
for (const f of execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean)) {
  const parts = f.split("/");
  if (parts.length !== 2) continue; // a package's own top-level files, nothing nested
  if (!tops.has(parts[0])) tops.set(parts[0], new Set());
  tops.get(parts[0]).add(parts[1]);
}

const packages = [...tops].filter(([, files]) => files.has("SPEC.md")).sort();
const short = packages.map(([dir, files]) => [dir, missing(dir, files)]).filter(([, m]) => m.length);

if (short.length) {
  console.log(`\nSHAPE FAIL — a package is missing files AGENTS.md tells every builder to expect:`);
  for (const [dir, m] of short) console.log(`  ${dir}/ — no ${m.join(", ")}`);
  console.log(`  A deliberate deviation belongs in SUBSTITUTE here and in AGENTS.md "Package shape", not in silence.`);
  process.exit(1);
}
console.log(`\nSHAPE OK — ${packages.length} packages, each carrying the full file set (${packages.map(([d]) => d).join(", ")})`);
