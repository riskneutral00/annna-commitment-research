// R9 — lower rungs unindexed and undoored (deployment/SPEC.md §3, SCENARIOS.md
// R9): non-production rungs serve X-Robots-Tag: noindex and contain no
// reachable debug or auth-bypass flag. Config/grep check — the security X1
// pattern (x1-secret-grep.mjs).
//
// Two halves, and only one is constructible today. The FLAG half runs now, over
// tracked non-markdown files: the spec corpus names these identifiers in prose
// and must not redden its own gate, which is also why `.md` is out of scope —
// a flag that is only ever written about is not a reachable flag. This file is
// excluded for the same reason: it names the patterns it hunts.
// The NOINDEX half needs a rung config to assert against. There is none yet
// (no tracked path carries one of RUNG_CONFIGS' three basenames), so it reports
// as not-yet-constructible instead of passing quietly, and becomes a real
// assertion at BUILD Step 2 when the preview rung exists.
//
// "A rung config" tracks the host, so its filename list moved to
// `rung-configs.mjs` on 2026-08-29. R9 imports the list and the shared basename
// helper; `t-six-before-link.mjs` imports the list but keeps its own app-scoped
// basename predicate. If a host swap changes recognition, both predicates must
// move together — the duplicate is a known seam, not a claim of one definition.
//
// TWO REPAIRS, 2026-09-13, and each had a control that passed before it:
//   1. DISCOVERY. The half tested the three bare basenames at the repository
//      ROOT, with existsSync. The app keeps its config beside the app, so a
//      nested `app/preview/<basename>` with no directive at all was invisible
//      and the gate printed not-yet-constructible over it. Discovery is now
//      every TRACKED path whose basename is a rung config, `git ls-files` wide.
//      That scope is deliberately wider than `t-six-before-link.mjs`'s app-only
//      search, and the difference is stated where the shared list lives: R9 asks
//      whether any rung config lacks the directive, T-six asks whether the app
//      is publishable.
//   2. VALUE. The header test was a case-insensitive substring of the header
//      NAME, so the single commented line `# X-Robots-Tag: index` — a mention
//      whose value is the opposite of the law's — satisfied it. A directive is
//      now a non-comment line that carries the header name followed by the
//      value `noindex` on that same line.
// What stays owed: whether a rung actually SERVES the header is a live-response
// fact no tracked file shows (deployment/BUILD.md Step 2's proof, not this
// gate's). `--selfcheck` pins the parse, never the response.
//
// Usage:
//   node deployment/scripts/r9-noindex-nodebug.mjs             check
//   node deployment/scripts/r9-noindex-nodebug.mjs --selfcheck assert-based self-test
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";
import { RUNG_CONFIGS, isRungConfigPath } from "./rung-configs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FLAGS = ["(SKIP|DISABLE|BYPASS)_AUTH", "AUTH_(SKIP|DISABLE|BYPASS)", "DEBUG" + "_MODE", "ALLOW" + "_ANONYMOUS"];

// Remove TOML and JSONC comments while preserving quoted values and newlines.
// This keeps the header test about configuration data, not prose around it.
const withoutComments = (content) => {
  let result = "";
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (lineComment) {
      if (char === "\n") {
        lineComment = false;
        result += char;
      } else {
        result += " ";
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        result += "  ";
        i += 1;
      } else {
        result += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (quote) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      result += char;
    } else if (char === "#") {
      lineComment = true;
      result += " ";
    } else if (char === "/" && next === "/") {
      lineComment = true;
      result += "  ";
      i += 1;
    } else if (char === "/" && next === "*") {
      blockComment = true;
      result += "  ";
      i += 1;
    } else {
      result += char;
    }
  }

  return result;
};

const NOINDEX_DIRECTIVE = /(?:^|[,{]\s*)(?:["']?X-Robots-Tag["']?)\s*(?::|=)\s*(?:["']?noindex["']?)(?=\s*(?:[,}]|$))/i;

// A directive has the exact header key and the value `noindex`, uncommented,
// on one line. `X-Robots-Tag = "index"` is a real directive and still a fault.
const hasNoindexDirective = (content) => withoutComments(content).split("\n").some((line) => NOINDEX_DIRECTIVE.test(line));

// configs: [{path, content}] — every tracked rung config, wherever it sits.
// Pure: no filesystem, no git, so the fixtures below are the same code path.
export function noindexFaults(configs) {
  return configs
    .filter((c) => !hasNoindexDirective(c.content))
    .map((c) => `${c.path} — a rung config with no X-Robots-Tag: noindex header`);
}

if (process.argv.includes("--selfcheck")) {
  // The fixtures are DERIVED from RUNG_CONFIGS, never written out: a literal
  // here would be the second copy, and it would go on testing a filename the
  // host no longer uses the day the list moves.
  const root = { path: RUNG_CONFIGS[0], content: '[vars]\nX-Robots-Tag = "noindex"\n' };
  const nested = { path: `app/preview/${RUNG_CONFIGS.at(-1)}`, content: '{ "name": "annna-preview" }\n' };
  const indexValued = { path: RUNG_CONFIGS[0], content: '[vars]\nX-Robots-Tag = "index"\n' };
  const commentOnly = { path: RUNG_CONFIGS[0], content: '# X-Robots-Tag: index\nname = "annna-preview"\n' };
  const inlineComment = { path: RUNG_CONFIGS[0], content: '[vars]\nX-Robots-Tag = "index" # TODO: change to noindex\n' };
  const blockComment = { path: RUNG_CONFIGS[0], content: '{\n/* X-Robots-Tag: noindex */\n"name": "annna-preview"\n}\n' };
  const unrelatedProperty = { path: RUNG_CONFIGS[0], content: '{"X-Robots-Tag":"index","note":"noindex"}\n' };
  assert.deepStrictEqual(noindexFaults([]), [], "absent: no rung config tracked is no fault — the half is not yet constructible");
  assert.deepStrictEqual(noindexFaults([root]), [], "a real directive whose value is noindex passes");
  assert.strictEqual(noindexFaults([nested]).length, 1, "a nested config with no header at all is a finding");
  assert.strictEqual(noindexFaults([indexValued]).length, 1, "a directive whose value is index is a finding — the value is read, not the name");
  assert.strictEqual(noindexFaults([commentOnly]).length, 1, "a commented mention is no directive at all");
  assert.strictEqual(noindexFaults([inlineComment]).length, 1, "noindex in an inline comment is not a directive");
  assert.strictEqual(noindexFaults([blockComment]).length, 1, "noindex in a block comment is not a directive");
  assert.strictEqual(noindexFaults([unrelatedProperty]).length, 1, "noindex in an unrelated property is not a directive");
  assert.ok(isRungConfigPath(nested.path), "rung configs are found by basename wherever they are tracked");
  assert.ok(!isRungConfigPath(`${RUNG_CONFIGS[0]}.md`), "and a file merely named like one is not one");
  console.log("selfcheck OK");
  process.exit(0);
}

// git grep skips binaries and honours pathspec exclusions; exit 1 means no match.
const hit = spawnSync(
  "git",
  ["grep", "-nE", FLAGS.join("|"), "--", ":!*.md", ":!deployment/scripts/r9-noindex-nodebug.mjs"],
  { encoding: "utf8" },
);
const findings = hit.stdout.split("\n").filter(Boolean);

const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
const rung = tracked.filter(isRungConfigPath);
findings.push(...noindexFaults(rung.map((p) => ({ path: p, content: fs.readFileSync(path.join(ROOT, p), "utf8") }))));

if (findings.length) {
  console.log(`\nR9 FAIL — a reachable debug/auth-bypass flag, or a rung config without noindex:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log(
  rung.length
    ? `\nR9 OK — no debug/auth-bypass flag; ${rung.length} rung config(s) carry noindex`
    : `\nR9 OK — no debug/auth-bypass flag. The noindex half is NOT YET CONSTRUCTIBLE: no rung config exists (BUILD.md Step 2 creates one).`,
);
