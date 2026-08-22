// The T1–T6 gate, mechanized (security/BUILD.md Step 4's printed rule:
// "no public link goes live before T1–T6 are green" — prose until 2026-08-22,
// against deployment/BUILD.md's own guardrail that a rule enforced only by
// prose has gone wrong).
//
// What it checks: if any tracked code file under app/ defines a TOKEN ROUTE
// (a route-y path whose content mentions a token — the guest capability-link
// surface), then the recorded green marker `security/t1-t6-green.md` must
// exist. With no token route in the tree the gate passes and is ARMED — the
// honest state today, since app/ holds no code yet.
//
// What it cannot check: that the marker's green was earned — that is the
// suite's fact. This gate only refuses the route-without-marker ordering.
//
// Usage:
//   node deployment/scripts/t-six-before-link.mjs             check
//   node deployment/scripts/t-six-before-link.mjs --selfcheck assert-based self-test

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MARKER = "security/t1-t6-green.md";

const isRoutePath = (p) => /\.(ts|tsx|js|jsx)$/.test(p) && /(^|\/)routes?(\/|\.)/i.test(p);

// files: [{path, content}] for tracked app/ code files; markerExists: boolean.
export function check(files, markerExists) {
  const tokenRoutes = files.filter((f) => isRoutePath(f.path) && /token/i.test(f.content)).map((f) => f.path);
  if (tokenRoutes.length && !markerExists)
    return { ok: false, tokenRoutes, msg: `token route(s) with no ${MARKER}: ${tokenRoutes.join(", ")}` };
  return { ok: true, tokenRoutes };
}

if (process.argv.includes("--selfcheck")) {
  const route = { path: "app/src/routes/t.$token.tsx", content: "export const token = params.token" };
  const plain = { path: "app/src/routes/index.tsx", content: "home" };
  const lib = { path: "app/src/lib/token.ts", content: "token helpers" }; // not a route path
  assert.ok(check([], false).ok, "empty tree passes (armed)");
  assert.ok(check([plain, lib], false).ok, "non-token route and non-route token file pass");
  assert.ok(!check([route], false).ok, "a token route without the marker fails");
  assert.ok(check([route], true).ok, "a token route with the marker passes");
  console.log("selfcheck OK");
  process.exit(0);
}

const tracked = execFileSync("git", ["ls-files", "app/"], { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .filter((p) => p && /\.(ts|tsx|js|jsx)$/.test(p));
const files = tracked.map((p) => ({ path: p, content: fs.readFileSync(path.join(ROOT, p), "utf8") }));
const res = check(files, fs.existsSync(path.join(ROOT, MARKER)));
if (!res.ok) {
  console.log(`\nT-SIX FAIL — ${res.msg}`);
  process.exit(1);
}
console.log(
  res.tokenRoutes.length
    ? `T-SIX OK — ${res.tokenRoutes.length} token route(s), marker present. NOT CHECKED: that the marker's green was earned — the suite's fact, not this gate's.`
    : `T-SIX OK — no token route in the tree; the gate is armed. NOT CHECKED: that the marker's green was earned — the suite's fact, not this gate's.`,
);
