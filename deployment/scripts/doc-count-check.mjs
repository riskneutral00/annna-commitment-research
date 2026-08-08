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
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

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

const claims = [
  ["README.md", claim("README.md", /\*\*(\d+) markdown files\*\*/, "tracked"), tracked, "tracked"],
  ["AGENTS.md", claim("AGENTS.md", /\*\*(\d+)\*\* tracked markdown files/, "tracked"), tracked, "tracked"],
];

const wrong = claims.filter(([, claimed, actual]) => claimed !== actual);
for (const [file, claimed, actual, what] of wrong) {
  console.log(`\nDOC-COUNT FAIL — ${file} claims ${claimed} ${what} .md files; actual is ${actual}`);
}
if (wrong.length) process.exit(1);

console.log(`\nDOC-COUNT OK — ${tracked} tracked .md, as claimed`);
