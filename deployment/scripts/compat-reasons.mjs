// The COMPAT-vocabulary gate (2026-08-22 strategy review, S3's gate half).
//
// `harness/INTERFACES.md §7.1` is the single home of the closed refusal-reason
// set per kind (FR13) — authored 2026-08-22 as `harness/COMPAT.md`, folded
// there 2026-08-29 — and from its authoring onward widening a reason set is a
// breaking change (RQ-13). Two copies exist that can drift from it: the six
// kinds named in that same file's §1 envelope sentence — two enumerations
// inside one file, which drift no less easily for sharing a file — and
// whatever `reason:` string literals the harness code comes to use as the
// Steps 1–5 suites land.
//
// What it checks:
//   1. §7.1's kind column is exactly the envelope's six kinds — both
//      directions (a seventh kind on either side fails).
//   2. Every kind carries at least one reason.
//   3. Every `reason: "..."` string literal in harness/src (and tests) is a
//      member of §7.1's reason set — the consuming direction.
// What it cannot check yet, printed as the honest bound: the reverse of (3) —
// that every enumerated reason is exercised by some suite. That becomes
// checkable as the Step 1–5 suites land; until then an unexercised reason is
// lawful, an unenumerated reason in code is not.
//
// Usage:
//   node deployment/scripts/compat-reasons.mjs             check
//   node deployment/scripts/compat-reasons.mjs --selfcheck assert-based self-test

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// INTERFACES.md §7.1's table rows: | `kind` | `reason` | collected from |
function compatTable(md) {
  const rows = [];
  for (const m of md.matchAll(/^\| `([a-z-]+)` \| `([a-z-]+)` \|/gm)) rows.push({ kind: m[1], reason: m[2] });
  return rows;
}

// The envelope's six kinds: **`conflict | decline | ...`** in INTERFACES §1.
function envelopeKinds(md) {
  const m = md.match(/six closed kinds — \*\*`([^`]+)`\*\*/);
  return m ? m[1].split("|").map((s) => s.trim()) : null;
}

// SPEC §3.4's printed park union — needs_human's own closed reason set, parsed
// rather than restated so the gate cannot go stale against it again (the
// pre-2026-08-22 three-member copy falsely redded slice_unfittable, which
// SCENARIOS L3 mandates in Step-5 test code). The union spans two lines and
// terminates at the first comma.
function parkUnion(md) {
  const m = md.match(/needs_human \{ reason: ([\s\S]*?),/);
  return m ? m[1].split("|").map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean) : null;
}

// reason: "..." literals in code (single or double quotes).
function codeReasons(dir) {
  const out = new Set();
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory() && e.name !== "node_modules") walk(p);
      else if (e.isFile() && /\.(ts|mts|js|mjs)$/.test(e.name)) {
        const src = fs.readFileSync(p, "utf8");
        for (const m of src.matchAll(/\breason:\s*["']([^"']+)["']/g)) out.add(m[1]);
      }
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

function check(compatMd, interfacesMd, reasonsInCode, specMd) {
  const bad = [];
  const rows = compatTable(compatMd);
  const kinds = envelopeKinds(interfacesMd);
  if (!rows.length) return ["INTERFACES.md §7.1's table no longer parses — fix this script's contract"];
  if (!kinds) return ["INTERFACES.md §1's envelope sentence no longer parses — fix this script's contract"];
  const park = parkUnion(specMd);
  if (!park) return ["SPEC §3.4's park union no longer parses — fix this script's contract"];
  const tableKinds = [...new Set(rows.map((r) => r.kind))];
  for (const k of kinds) if (!tableKinds.includes(k)) bad.push(`envelope kind \`${k}\` has no §7.1 row`);
  for (const k of tableKinds) if (!kinds.includes(k)) bad.push(`§7.1 kind \`${k}\` is not in the envelope's six`);
  const reasons = new Set(rows.map((r) => r.reason));
  for (const r of reasonsInCode) {
    // The park's needs_human.reason members are SPEC §3.4's own closed set,
    // not seam refusal reasons — out of this gate's domain.
    if (park.includes(r)) continue;
    if (!reasons.has(r)) bad.push(`code uses reason "${r}" which §7.1 does not enumerate — widening is a breaking change (RQ-13)`);
  }
  return bad;
}

const COMPAT_FIXTURE = "| `conflict` | `capacity` | x |\n| `decline` | `no-feasible-placement` | x |\n| `invalid` | `malformed` | x |\n| `refused` | `no-basis` | x |\n| `unavailable` | `substrate` | x |\n| `timeout` | `substrate` | x |";
const IFACE_FIXTURE = "six closed kinds — **`conflict | decline | invalid | refused | unavailable | timeout`**";
const SPEC_FIXTURE =
  "  needs_human { reason: no_basis | unreachable | unverified\n                      | budget_exhausted | slice_unfittable | quarantine_failed,";

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual(check(COMPAT_FIXTURE, IFACE_FIXTURE, new Set(), SPEC_FIXTURE), [], "a matched pair passes");
  assert.ok(
    check(COMPAT_FIXTURE.replace("| `timeout` | `substrate` | x |", ""), IFACE_FIXTURE, new Set(), SPEC_FIXTURE).some((b) => b.includes("`timeout`")),
    "a kind with no row is caught",
  );
  assert.ok(
    check(COMPAT_FIXTURE + "\n| `retry` | `later` | x |", IFACE_FIXTURE, new Set(), SPEC_FIXTURE).some((b) => b.includes("`retry`")),
    "a seventh kind is caught",
  );
  assert.ok(
    check(COMPAT_FIXTURE, IFACE_FIXTURE, new Set(["surprise"]), SPEC_FIXTURE).some((b) => b.includes('"surprise"')),
    "an unenumerated code reason is caught",
  );
  assert.deepStrictEqual(check(COMPAT_FIXTURE, IFACE_FIXTURE, new Set(["unverified"]), SPEC_FIXTURE), [], "the park's own reason set is out of domain");
  assert.deepStrictEqual(
    check(COMPAT_FIXTURE, IFACE_FIXTURE, new Set(["slice_unfittable"]), SPEC_FIXTURE),
    [],
    "a park member beyond the original three is out of domain",
  );
  assert.ok(
    check(COMPAT_FIXTURE, IFACE_FIXTURE, new Set(), "no park union here").some((b) => b.includes("§3.4")),
    "a broken §3.4 fixture fails closed",
  );

  // The property the 2026-08-29 fold creates: both enumerations now live in one
  // file, so the gate reads that file as both inputs. Reading one file twice
  // must not cross-contaminate — and in particular the envelope sentence's own
  // `conflict | decline | …` must not parse as a table row, which would hand
  // the table a kind column it never declared.
  const COMBINED = `${IFACE_FIXTURE}\n\n${COMPAT_FIXTURE}`;
  assert.deepStrictEqual(check(COMBINED, COMBINED, new Set(), SPEC_FIXTURE), [], "one file as both inputs passes");
  assert.strictEqual(compatTable(COMBINED).length, 6, "the envelope sentence contributes no table row");
  assert.ok(
    check(`${IFACE_FIXTURE}\n\n${COMPAT_FIXTURE}\n| \`retry\` | \`later\` | x |`, COMBINED, new Set(), SPEC_FIXTURE).some((b) => b.includes("`retry`")),
    "a seventh kind is still caught when both enumerations share a file",
  );
  console.log("selfcheck OK");
  process.exit(0);
}

const iface = fs.readFileSync(path.join(ROOT, "harness/INTERFACES.md"), "utf8");
const spec = fs.readFileSync(path.join(ROOT, "harness/SPEC.md"), "utf8");
const inCode = codeReasons(path.join(ROOT, "harness/src"));
for (const r of codeReasons(path.join(ROOT, "harness/tests"))) inCode.add(r);
const bad = check(iface, iface, inCode, spec);
if (bad.length) {
  console.log(`\nCOMPAT-REASONS FAIL:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const rows = compatTable(iface);
console.log(
  `COMPAT-REASONS OK — ${new Set(rows.map((r) => r.kind)).size} kinds, ${rows.length} reasons, kinds equal the envelope's six both ways; ` +
    `${inCode.size} reason literal(s) in harness code, all enumerated. NOT CHECKED: that every enumerated reason is exercised by a suite — checkable when the Step 1–5 suites land; and reason values passed as a shorthand object property ({ …, reason }) are invisible to the literal scan.`,
);
