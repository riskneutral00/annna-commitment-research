// Egress lint (deployment/SPEC.md §7, egress-allowlist.md): outbound network
// calls in tracked code are confined to the allowlisted files. Adding egress is
// a floor act — the path a prompt-injected builder would need (NOTES.md S4).
//
// The allowlist is markdown so S2 forces it to land in its own commit, ahead of
// whatever wants the permission. That separation is most of the value here.
//
// Markdown is out of scope (the corpus writes these words in prose), and this
// file is excluded for the same reason X1 excludes itself: a gate that reddens
// on its own source is a gate nobody keeps.
// Matching is done in JS, not `git grep -E`. That is deliberate and it cost a
// canary to learn: git grep -E is POSIX ERE, where \b is not a word boundary, so
// every pattern below silently matched nothing while --selfcheck (JS RegExp)
// passed. A gate whose selfcheck runs a different engine from its real pass is
// a gate that reports green for the wrong reason. Same engine, both paths.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ALLOWLIST = "deployment/egress-allowlist.md";
const SKIP = /\.(md|jpg|jpeg|png|gif|webp|ico|pdf|zip|lock)$/i;
const CALLS = new RegExp(
  [
    "\\bfetch\\s*\\(",
    "\\bXMLHttpRequest\\b",
    "\\bWebSocket\\b",
    "from\\s+[\"']node:(http|https|net|dgram|tls)[\"']",
    "require\\s*\\(\\s*[\"'](http|https|net|dgram|tls)[\"']",
    "\\b(axios|got|undici|node-fetch|superagent)\\b",
    "\\bConvex(Http)?Client\\b",
  ].join("|"),
);

// Allowed paths are the first backticked path in each row of the Allowed table.
// Parsed rather than duplicated: two lists that must agree is one list too many.
const allowed = new Set(
  readFileSync(ALLOWLIST, "utf8")
    .split(/^## /m)
    .find((s) => s.startsWith("Allowed"))
    ?.split("\n")
    .filter((l) => l.startsWith("|"))
    .map((l) => l.match(/`([^`]+)`/)?.[1])
    .filter(Boolean) ?? [],
);

// The one matcher, used by both the real pass and --selfcheck.
function scan(files, read) {
  const findings = [];
  for (const f of files) {
    read(f)
      .split("\n")
      .forEach((line, i) => {
        if (CALLS.test(line)) findings.push(`${f}:${i + 1}:${line.trim()}`);
      });
  }
  return findings;
}

if (process.argv.includes("--selfcheck")) {
  const cases = [
    ["the allowlist parses to a non-empty set", allowed.size > 0],
    ["the two known callers are on it", allowed.has("engine/scripts/reactive-push-check.mjs") && allowed.has("model/spike/run-nset.mjs")],
    ["a bare fetch( is a call site", CALLS.test("const r = await fetch(url)")],
    ["a node:https import is a call site", CALLS.test('import https from "node:https"')],
    ["prefetch( is not a call site", !CALLS.test("const x = prefetch(url)")],
    ["ordinary code is not", !CALLS.test("const summary = summarize(text)")],
    // The bug this file's canary caught: the two paths must share an engine.
    ["the real pass and the selfcheck use the same matcher", scan(["x"], () => "await fetch(u)").length === 1],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nEGRESS SELFCHECK FAIL:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean)
  .filter((f) => !SKIP.test(f))
  .filter((f) => f !== "deployment/scripts/egress-lint.mjs")
  .filter((f) => !f.includes("/_generated/"))
  .filter((f) => !allowed.has(f));

const findings = scan(files, (f) => readFileSync(f, "utf8"));

if (findings.length) {
  console.log(`\nEGRESS FAIL — an outbound network call outside ${ALLOWLIST}:`);
  for (const f of findings) console.log(`  ${f}`);
  console.log(`  Adding egress is a floor act. Land the allowlist entry as its own spec commit first (SPEC.md §7).`);
  process.exit(1);
}
console.log(`\nEGRESS OK — network calls confined to ${allowed.size} allowlisted file(s)`);
