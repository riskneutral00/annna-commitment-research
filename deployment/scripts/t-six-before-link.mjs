// The T1–T7 gate, mechanized (security/BUILD.md Step 4's printed rule:
// "no public link goes live before T1–T7 are green" — prose until 2026-08-22,
// against deployment/BUILD.md's own guardrail that a rule enforced only by
// prose has gone wrong).
//
// What it checks: the marker `security/t1-t7-green.md` must exist, and name every
// ID of the required suite, once the tree holds BOTH a token route under app/ (a
// route-y path whose content mentions a token — the guest capability-link
// surface) AND a tracked rung config under app/, which is what makes the app
// publishable.
//
// Why the trigger is a pair, re-cut 2026-08-29 (L-221 / S13). The printed law is
// "no public link goes LIVE before the suite is green". The gate fired on tracked
// token-route presence alone, which is not liveness — it reddened app/BUILD.md
// Step 0's first commit four steps before the marker could legitimately exist,
// and that was the one named blocker on the app build. Step 0's first commit
// lands routes with no rung config, so the gate stays ARMED and green through
// it. The commit that makes the app publishable is the last state this
// repository can observe before a link is live, and that commit now requires the
// marker. The law is re-affirmed; only the trigger moved.
//
// The suite, read rather than restated (2026-09-14). `deployment/SPEC.md` §7a
// item 16 made T7 a required row beside T1–T6 while this script and its marker
// still printed the six-suite form, so a marker naming T1–T6 satisfied the gate.
// The required set is now read from item 16's own bold lead ("The T1–T7 gate
// proxies liveness"), every printed "no public link goes live before …" in
// security/BUILD.md must name that same set, and each ID must be a row
// security/SCENARIOS.md defines. Once the pair fires, a marker that omits any ID
// fails. With no token route or no tracked rung config the gate is not
// applicable, whatever the marker says.
//
// "A rung config" is imported from `rung-configs.mjs`, the same definition
// `r9-noindex-nodebug.mjs` reads. There is deliberately no second copy of those
// filenames here: `substrate-swap.md` names what a forgotten one costs, and a
// host swap has to move that list once or not at all.
//
// What it cannot check — three bounds, and the third is the one that matters:
//   1. That the app is actually deployed. The tree cannot see production.
//   2. That the marker's green was earned — that is the suite's fact. A marker
//      naming T1–T7 is evidence metadata, never proof the tests ran.
//   3. That deploy is actually gated on a TRACKED rung config, rather than on
//      configuration the deploy workflow supplies inline. `deployment/SPEC.md`
//      §4 rules deploy continuous ("From app Step 0 onward, landing on main
//      deploys production") and no deploy workflow exists yet, so nothing in
//      the tree proves a deploy is impossible without a tracked config. Under
//      that architecture a token route could reach production while this gate
//      stays armed and silent. The trigger is the best proxy the repository can
//      observe today; it is not a proof. Re-verify when `deployment/BUILD.md`
//      Step 2 ("The rung ladder") and Step 4 ("The ladder drills (at app Step
//      0)") stand up the first rung — that is the commit where the real deploy
//      path becomes readable.
//
// Usage:
//   node deployment/scripts/t-six-before-link.mjs             check
//   node deployment/scripts/t-six-before-link.mjs --selfcheck assert-based self-test

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";
import { RUNG_CONFIGS } from "./rung-configs.mjs";
import { buildIds, scenarioDefs } from "./gate-coverage.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MARKER = "security/t1-t7-green.md";

const isRoutePath = (p) => /\.(ts|tsx|js|jsx)$/.test(p) && /(^|\/)routes?(\/|\.)/i.test(p);
const isRungConfig = (p) => RUNG_CONFIGS.includes(path.basename(p));
const sortIds = (ids) => [...ids].sort((a, b) => a.slice(1) - b.slice(1));

// The required live-link suite: item 16's bold lead is the home, security/BUILD.md's
// printed gates must agree with it, and security/SCENARIOS.md must define every ID.
export function requiredSuite(specText, securityBuild, securityScenarios) {
  const home = specText.match(/^16\. \*\*The (T\d+–T\d+) gate proxies liveness/m);
  if (!home)
    return { ids: [], bad: [`deployment/SPEC.md §7a item 16 no longer names its suite as "The T1–Tn gate proxies liveness" — fix this script's contract`] };
  const ids = sortIds(buildIds(home[1]));
  const bad = [];
  const printed = [...securityBuild.matchAll(/no public link goes live before (T\d+–T\d+) are green/g)];
  if (!printed.length) bad.push(`security/BUILD.md prints no "no public link goes live before … are green" gate — fix this script's contract`);
  for (const p of printed)
    if (sortIds(buildIds(p[1])).join() !== ids.join())
      bad.push(`security/BUILD.md prints the live-link gate as ${p[1]}; its home, deployment/SPEC.md §7a item 16, requires ${home[1]}`);
  const defs = scenarioDefs(securityScenarios);
  for (const id of ids) if (!defs.has(id)) bad.push(`${id} is in the required live-link suite and security/SCENARIOS.md does not define it`);
  return { ids, bad };
}

// paths: every tracked path under app/. files: [{path, content}] for the code
// ones. markerText: the marker's content, or null when it does not exist.
// suite: the required IDs.
export function check(files, markerText, paths = [], suite = []) {
  const tokenRoutes = files.filter((f) => isRoutePath(f.path) && /token/i.test(f.content)).map((f) => f.path);
  const configs = paths.filter(isRungConfig);
  if (!tokenRoutes.length || !configs.length) return { ok: true, tokenRoutes, configs };
  const where = `the app is publishable (${configs.join(", ")}) and serves token route(s) (${tokenRoutes.join(", ")})`;
  if (markerText === null) return { ok: false, tokenRoutes, configs, msg: `${where} with no ${MARKER}` };
  const named = buildIds(markerText);
  const missing = suite.filter((id) => !named.has(id));
  if (missing.length)
    return { ok: false, tokenRoutes, configs, msg: `${where} and ${MARKER} does not name ${missing.join(", ")} of the required ${suite.join(", ")}` };
  return { ok: true, tokenRoutes, configs };
}

if (process.argv.includes("--selfcheck")) {
  const route = { path: "app/src/routes/t.$token.tsx", content: "export const token = params.token" };
  const plain = { path: "app/src/routes/index.tsx", content: "home" };
  const lib = { path: "app/src/lib/token.ts", content: "token helpers" }; // not a route path
  // The fixtures are DERIVED from RUNG_CONFIGS, never written out: a literal
  // here would be the second copy, and it would go on testing a filename the
  // host no longer uses the day the list moves.
  const cfg = [`app/${RUNG_CONFIGS[0]}`];
  const SUITE = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"];
  const seven = "T1, T2, T3, T4, T5, T6, T7 green";
  const six = "T1–T6 green";
  assert.ok(check([], null, [], SUITE).ok, "empty tree passes (armed)");
  assert.ok(check([plain, lib], null, cfg, SUITE).ok, "non-token route and non-route token file pass");
  // S13's case, and it is asserted rather than assumed: routes may land before
  // the marker can legitimately exist, so long as nothing can publish them.
  assert.ok(check([route], null, [], SUITE).ok, "token route + no rung config + no marker PASSES — the gate is armed, not tripped");
  assert.ok(check([route], six, [], SUITE).ok, "and with no rung config a short marker is not applicable either");
  // The loosening is bounded here: publishable and unmarked is still a refusal.
  assert.ok(!check([route], null, cfg, SUITE).ok, "token route + rung config + no marker FAILS");
  assert.ok(check([route], seven, cfg, SUITE).ok, "token route + rung config + a marker naming T1–T7 passes");
  assert.ok(check([route], "T1–T7 green", cfg, SUITE).ok, "the marker may name the suite as a range");
  const short = check([route], six, cfg, SUITE);
  assert.ok(!short.ok && short.msg.includes("does not name T7"), "a marker omitting T7 FAILS, and says which ID it omits");
  assert.ok(check([], null, cfg, SUITE).ok, "a rung config with no token route passes — there is no link to gate");
  assert.ok(isRungConfig(`app/nested/${RUNG_CONFIGS.at(-1)}`), "the config list is read by basename, at any depth under app/");
  assert.ok(!isRungConfig(`app/src/routes/${RUNG_CONFIGS[0]}.md`), "and a file merely named like one is not one");

  // The suite is read from its home and cross-checked, never restated here.
  const spec = "16. **The T1–T7 gate proxies liveness with a tracked rung config**";
  const build = (r) => `**The printed gate: no public link goes live before ${r} are green**`;
  const scen = SUITE.map((id) => `- **${id} [x]** y`).join("\n");
  assert.deepStrictEqual(requiredSuite(spec, build("T1–T7"), scen), { ids: SUITE, bad: [] }, "home, printed gate and suite agree on T1–T7");
  assert.ok(requiredSuite(spec, build("T1–T6"), scen).bad.some((b) => b.includes("T1–T6")), "a printed gate that drops T7 FAILS");
  assert.ok(requiredSuite(spec.replace("T1–T7", "T1–T8"), build("T1–T8"), scen).bad.some((b) => b.includes("T8")), "a suite ID the scenarios do not define FAILS");
  assert.ok(requiredSuite("no such item", build("T1–T7"), scen).bad.length, "an unparseable home is a failure, not an empty suite");
  assert.ok(requiredSuite(spec, "no printed gate", scen).bad.length, "and so is a security/BUILD.md with no printed gate");
  console.log("selfcheck OK");
  process.exit(0);
}

const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const suite = requiredSuite(read("deployment/SPEC.md"), read("security/BUILD.md"), read("security/SCENARIOS.md"));
const tracked = execFileSync("git", ["ls-files", "app/"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
const files = tracked
  .filter((p) => /\.(ts|tsx|js|jsx)$/.test(p))
  .map((p) => ({ path: p, content: fs.readFileSync(path.join(ROOT, p), "utf8") }));
const res = check(files, fs.existsSync(path.join(ROOT, MARKER)) ? read(MARKER) : null, tracked, suite.ids);
const BOUNDS =
  " NOT CHECKED: that the app is actually deployed (the tree cannot see production); that the marker's" +
  " green was earned (the suite's fact, not this gate's — a marker naming the suite is evidence metadata, never proof the tests ran);" +
  " and that deploy is gated on a TRACKED rung config rather than one the deploy workflow supplies inline — SPEC.md §4 rules deploy" +
  " continuous and no deploy workflow exists yet, so this trigger is the best proxy the tree can observe, not a proof.";
if (suite.bad.length || !res.ok) {
  console.log(`\nT-SIX FAIL`);
  for (const b of suite.bad) console.log(`  ${b}`);
  if (!res.ok) {
    console.log(`  ${res.msg}`);
    console.log(`  The marker lands before the app can publish, not after. This is the last state the repository can observe before a link is live.`);
  }
  process.exit(1);
}
const state = !res.tokenRoutes.length
  ? "no token route in the tree; the gate is armed"
  : !res.configs.length
    ? `${res.tokenRoutes.length} token route(s) and no rung config — not publishable, so the gate is armed`
    : `${res.tokenRoutes.length} token route(s), publishable, marker names the whole suite`;
console.log(
  `T-SIX OK — required live-link suite ${suite.ids.join(", ")}, read from deployment/SPEC.md §7a item 16 and matched by every printed security/BUILD.md gate; ${state}.${BOUNDS}`,
);
