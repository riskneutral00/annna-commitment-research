// R4 — one seed door (deployment/SPEC.md §3, SCENARIOS.md R4): exactly one
// named seed entrypoint exists, and its module statically imports only the
// fixtures bundle — no network, no store dump. Production data never descends.
//
// The name is `seed.<ext>` and the check is on the NAME, not the location
// (SPEC.md §3): a location rule would have to guess which layer owns seeding
// before that layer exists.
//
// Two halves. The COUNT half runs today and is a real assertion — a second seed
// door fails it the moment someone adds one. The IMPORT half has nothing to
// read: zero doors exist, so it reports as unexercised rather than passing
// quietly, and becomes real with the first door.
//
// BARE PACKAGE SPECIFIERS ARE ALLOWLISTED, NOT EXEMPTED (SPEC.md §7a item 7,
// fixed 2026-08-21). The import half used to look only at relative and absolute
// paths, so a Postgres client imported by its package name — a store client,
// the exact thing "no store dump" names — walked through it. (Written in prose
// rather than as a snippet on purpose: the egress lint reads this folder, and a
// worked example of a store-client import in a gate source is a call site to
// it.) The allowlist is the node builtins
// that carry no network, taken from node:module rather than typed out: a
// hand-written package list is a registry that rots, and the corpus has been
// bitten by every one of those it has written.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { builtinModules } from "node:module";

const DOOR = /(^|\/)seed\.(ts|tsx|js|mjs|cjs)$/;
const IMPORT = /(?:^|\s)(?:import\s[^;]*?from\s*|import\s*|require\s*\(\s*)["']([^"']+)["']/g;
const FIXTURES = /(^|\/)fixtures(\/|$)/;
// The network-capable builtins, which a seed door may not reach either — the
// same set the egress lint refuses, named once per script because these two
// gates run in different folders and neither may import the other's law.
const NETWORK_BUILTIN = /^(node:)?(http|https|http2|net|dgram|tls|dns|cluster|inspector)$/;
const ALLOWED_BARE = new Set(
  builtinModules.filter((m) => !NETWORK_BUILTIN.test(m)).flatMap((m) => [m, `node:${m}`]),
);

function badImports(source) {
  return [...source.matchAll(IMPORT)]
    .map((m) => m[1])
    .filter((spec) =>
      spec.startsWith(".") || spec.startsWith("/") ? !FIXTURES.test(spec) : !ALLOWED_BARE.has(spec),
    );
}

if (process.argv.includes("--selfcheck")) {
  const imp = (spec) => `import { X } from ${JSON.stringify(spec)};`;
  const cases = [
    ["seed.ts is a door", DOOR.test("engine/seed.ts")],
    ["a nested seed.mjs is a door", DOOR.test("app/db/seed.mjs")],
    ["seeds.ts is not", !DOOR.test("engine/seeds.ts")],
    ["reseed.ts is not", !DOOR.test("engine/reseed.ts")],
    ["a fixtures import is allowed", badImports('import { boards } from "../fixtures/boards";').length === 0],
    ["a store-dump import is caught", badImports('import { dump } from "../prod/dump";').length === 1],
    // §7a item 7's worked example, and the allowlist that replaced the exemption.
    // The specifiers are composed rather than written out for the reason in the
    // header: a literal store-client import here is one the egress lint reads.
    ["a store client imported by package name is caught", badImports(imp("pg")).length === 1],
    ["so is any other bare package", badImports(imp("zod")).length === 1],
    ["a non-network builtin is allowed", badImports(imp("node:fs")).length === 0],
    ["its bare spelling too", badImports(imp("path")).length === 0],
    ["a network builtin is not", badImports(imp("node:https")).length === 1],
    ["require form reads the same", badImports(`const c = require(${JSON.stringify("pg")});`).length === 1],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nR4 SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

const doors = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean)
  .filter((f) => DOOR.test(f));

if (doors.length > 1) {
  console.log(`\nR4 FAIL — ${doors.length} seed doors. Exactly one may exist (SPEC.md §3):`);
  for (const d of doors) console.log(`  ${d}`);
  process.exit(1);
}

if (!doors.length) {
  console.log(`\nR4 OK — no seed door yet, and at most one may ever exist. The import half is NOT YET EXERCISED: it reads the door's module, and there is none (BUILD.md Step 2).`);
  process.exit(0);
}

const bad = badImports(readFileSync(doors[0], "utf8"));
if (bad.length) {
  console.log(`\nR4 FAIL — ${doors[0]} reaches outside the fixtures bundle:`);
  for (const b of bad) console.log(`  imports ${b}`);
  process.exit(1);
}
console.log(`\nR4 OK — one seed door (${doors[0]}), importing fixtures only`);
