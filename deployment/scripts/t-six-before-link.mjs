// The T1–T6 gate, mechanized (security/BUILD.md Step 4's printed rule:
// "no public link goes live before T1–T6 are green" — prose until 2026-08-22,
// against deployment/BUILD.md's own guardrail that a rule enforced only by
// prose has gone wrong).
//
// What it checks: the marker `security/t1-t6-green.md` must exist once the tree
// holds BOTH a token route under app/ (a route-y path whose content mentions a
// token — the guest capability-link surface) AND a tracked rung config under
// app/, which is what makes the app publishable.
//
// Why the trigger is a pair, re-cut 2026-08-29 (L-221 / S13). The printed law is
// "no public link goes LIVE before T1–T6 are green". The gate fired on tracked
// token-route presence alone, which is not liveness — it reddened app/BUILD.md
// Step 0's first commit four steps before the marker could legitimately exist,
// and that was the one named blocker on the app build. Step 0's first commit
// lands routes with no rung config, so the gate stays ARMED and green through
// it. The commit that makes the app publishable is the last state this
// repository can observe before a link is live, and that commit now requires the
// marker. The law is re-affirmed; only the trigger moved.
//
// "A rung config" is imported from `rung-configs.mjs`, the same definition
// `r9-noindex-nodebug.mjs` reads. There is deliberately no second copy of those
// filenames here: `substrate-swap.md` names what a forgotten one costs, and a
// host swap has to move that list once or not at all.
//
// What it cannot check — three bounds, and the third is the one that matters:
//   1. That the app is actually deployed. The tree cannot see production.
//   2. That the marker's green was earned — that is the suite's fact.
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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MARKER = "security/t1-t6-green.md";

const isRoutePath = (p) => /\.(ts|tsx|js|jsx)$/.test(p) && /(^|\/)routes?(\/|\.)/i.test(p);
const isRungConfig = (p) => RUNG_CONFIGS.includes(path.basename(p));

// paths: every tracked path under app/. files: [{path, content}] for the code
// ones. markerExists: boolean.
export function check(files, markerExists, paths = []) {
  const tokenRoutes = files.filter((f) => isRoutePath(f.path) && /token/i.test(f.content)).map((f) => f.path);
  const configs = paths.filter(isRungConfig);
  if (tokenRoutes.length && configs.length && !markerExists)
    return {
      ok: false,
      tokenRoutes,
      configs,
      msg: `the app is publishable (${configs.join(", ")}) and serves token route(s) (${tokenRoutes.join(", ")}) with no ${MARKER}`,
    };
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
  assert.ok(check([], false).ok, "empty tree passes (armed)");
  assert.ok(check([plain, lib], false, cfg).ok, "non-token route and non-route token file pass");
  // S13's case, and it is asserted rather than assumed: routes may land before
  // the marker can legitimately exist, so long as nothing can publish them.
  assert.ok(check([route], false).ok, "token route + no rung config + no marker PASSES — the gate is armed, not tripped");
  // The loosening is bounded here: publishable and unmarked is still a refusal.
  assert.ok(!check([route], false, cfg).ok, "token route + rung config + no marker FAILS");
  assert.ok(check([route], true, cfg).ok, "token route + rung config + marker passes");
  assert.ok(check([], false, cfg).ok, "a rung config with no token route passes — there is no link to gate");
  assert.ok(isRungConfig(`app/nested/${RUNG_CONFIGS.at(-1)}`), "the config list is read by basename, at any depth under app/");
  assert.ok(!isRungConfig(`app/src/routes/${RUNG_CONFIGS[0]}.md`), "and a file merely named like one is not one");
  console.log("selfcheck OK");
  process.exit(0);
}

const tracked = execFileSync("git", ["ls-files", "app/"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
const files = tracked
  .filter((p) => /\.(ts|tsx|js|jsx)$/.test(p))
  .map((p) => ({ path: p, content: fs.readFileSync(path.join(ROOT, p), "utf8") }));
const res = check(files, fs.existsSync(path.join(ROOT, MARKER)), tracked);
const BOUNDS =
  " NOT CHECKED: that the app is actually deployed (the tree cannot see production); that the marker's" +
  " green was earned (the suite's fact, not this gate's); and that deploy is gated on a TRACKED rung" +
  " config rather than one the deploy workflow supplies inline — SPEC.md §4 rules deploy continuous and" +
  " no deploy workflow exists yet, so this trigger is the best proxy the tree can observe, not a proof.";
if (!res.ok) {
  console.log(`\nT-SIX FAIL — ${res.msg}`);
  console.log(`  The marker lands before the app can publish, not after. This is the last state the repository can observe before a link is live.`);
  process.exit(1);
}
const state = !res.tokenRoutes.length
  ? "no token route in the tree; the gate is armed"
  : !res.configs.length
    ? `${res.tokenRoutes.length} token route(s) and no rung config — not publishable, so the gate is armed`
    : `${res.tokenRoutes.length} token route(s), publishable, marker present`;
console.log(`T-SIX OK — ${state}.${BOUNDS}`);
