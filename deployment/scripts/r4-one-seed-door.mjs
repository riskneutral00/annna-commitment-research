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
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const DOOR = /(^|\/)seed\.(ts|tsx|js|mjs|cjs)$/;
const IMPORT = /(?:^|\s)(?:import\s[^;]*?from\s*|import\s*|require\s*\(\s*)["']([^"']+)["']/g;
const FIXTURES = /(^|\/)fixtures(\/|$)/;

function badImports(source) {
  return [...source.matchAll(IMPORT)]
    .map((m) => m[1])
    .filter((spec) => spec.startsWith(".") || spec.startsWith("/"))
    .filter((spec) => !FIXTURES.test(spec));
}

if (process.argv.includes("--selfcheck")) {
  const cases = [
    ["seed.ts is a door", DOOR.test("engine/seed.ts")],
    ["a nested seed.mjs is a door", DOOR.test("app/db/seed.mjs")],
    ["seeds.ts is not", !DOOR.test("engine/seeds.ts")],
    ["reseed.ts is not", !DOOR.test("engine/reseed.ts")],
    ["a fixtures import is allowed", badImports('import { boards } from "../fixtures/boards";').length === 0],
    ["a store-dump import is caught", badImports('import { dump } from "../prod/dump";').length === 1],
    ["a bare package import is not a local reach", badImports('import { z } from "zod";').length === 0],
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
