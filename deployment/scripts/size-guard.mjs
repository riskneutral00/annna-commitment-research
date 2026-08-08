// Binary-size guard (deployment/SPEC.md §4, the CI floor): no tracked file over
// 2MB, except the two JPEG masters already in history. They are pinned by path
// AND exact size, so a replacement at the same path cannot sail through on the
// name alone — a name-only allowlist would pass a 50MB swap of treestars.jpg.
// The pinned pair is sunk cost a history rewrite can't reach (SPEC.md §7:
// force-push, never). This stops the next 15MB, not the last one.
//
// Every tracked file is checked, deliberately: an earlier version diffed the
// index against HEAD, which made it a pre-commit guard that could never fail in
// CI (a checkout's index IS HEAD, so the offender set was empty by construction).
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

const LIMIT = 2 * 1024 * 1024;
const PINNED = {
  "assets/masters/treestars.jpg": 9663180,
  "assets/masters/koi.jpg": 5145999,
};

const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean);

const offenders = [];
for (const f of tracked) {
  if (!existsSync(f)) continue;
  const size = statSync(f).size;
  if (size <= LIMIT || PINNED[f] === size) continue;
  const mb = (size / 1024 / 1024).toFixed(1);
  offenders.push(
    f in PINNED
      ? `${f} (${mb}MB) — pinned at ${PINNED[f]} bytes; it changed, so re-pin it deliberately`
      : `${f} (${mb}MB)`,
  );
}

if (offenders.length) {
  console.log(`\nSIZE-GUARD FAIL — tracked over 2MB and not pinned:`);
  for (const o of offenders) console.log(`  ${o}`);
  process.exit(1);
}
console.log(`\nSIZE-GUARD OK — no tracked file over 2MB beyond the ${Object.keys(PINNED).length} pinned masters`);
