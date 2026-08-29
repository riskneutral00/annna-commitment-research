// Doc-count assertion (deployment/SPEC.md §4, the CI floor): the markdown counts
// README.md and AGENTS.md claim about this repo must be true. A repo that lies
// about its own size is the cheapest possible tell that nothing else is checked.
// Claims are PARSED from the docs; actuals come from git and the filesystem.
//
// Only the TRACKED count is asserted. A working-tree count was asserted here
// too until CI became real: it walks the filesystem, so it counts whatever
// gitignored working material the machine happens to hold — true on the author's
// laptop, false in every clone and every runner. A check that passes only where
// it was written is worse than no check, so the claim it read was deleted from
// AGENTS.md rather than made tolerant. Tracked is what a reader gets.
//
// `--write` (2026-08-29, `npm run derive`): rewrites both claimed numbers to the
// current tracked count instead of asking a human to. The judgment pass ruled
// the RETIRE-AT-BUILD verdict stands and commissioned "a derive script whose
// output the existing gates verify instead of hand-maintained prose" — so the
// gate STAYS and what retires is the hand-maintenance. This number is fully
// derivable and carries zero judgement, which is exactly why it may be written.
// It is deliberately NOT in the `check` chain: a gate that mutates the tree
// inside the pre-commit hook would rewrite a commit out from under its author.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], {
  encoding: "utf8",
  maxBuffer: 1 << 28,
}).split("\0").filter(Boolean).length;

const claim = (file, re, what) => {
  const m = readFileSync(file, "utf8").match(re);
  if (!m) {
    console.log(`\nDOC-COUNT FAIL — ${file} no longer states its ${what} count in a parseable form`);
    process.exit(1);
  }
  return Number(m[1]);
};

// One definition of where each number lives, so check and write cannot disagree
// about which digits they are talking about.
const HOMES = [
  ["README.md", /\*\*(\d+) markdown files\*\*/, (n) => `**${n} markdown files**`],
  ["AGENTS.md", /\*\*(\d+)\*\* tracked markdown files/, (n) => `**${n}** tracked markdown files`],
];

if (process.argv.includes("--write")) {
  const changed = [];
  for (const [file, re, render] of HOMES) {
    const text = readFileSync(file, "utf8");
    const m = text.match(re);
    if (!m) {
      console.log(`\nDERIVE FAIL — ${file} no longer states its tracked count in a parseable form; fix the prose before deriving`);
      process.exit(1);
    }
    if (Number(m[1]) !== tracked) {
      writeFileSync(file, text.replace(re, render(tracked)));
      changed.push(`${file} ${m[1]} → ${tracked}`);
    }
  }
  console.log(`\nDOC-COUNT DERIVED — ${tracked} tracked .md${changed.length ? `; ${changed.join(", ")}` : "; both homes already current"}`);
  process.exit(0);
}

const claims = HOMES.map(([file, re]) => [file, claim(file, re, "tracked"), tracked, "tracked"]);

const wrong = claims.filter(([, claimed, actual]) => claimed !== actual);
for (const [file, claimed, actual, what] of wrong) {
  console.log(`\nDOC-COUNT FAIL — ${file} claims ${claimed} ${what} .md files; actual is ${actual}`);
}
if (wrong.length) process.exit(1);

console.log(`\nDOC-COUNT OK — ${tracked} tracked .md, as claimed`);
