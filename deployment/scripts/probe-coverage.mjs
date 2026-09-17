// The probe-coverage gate (2026-08-22 strategy review, F4's gate half).
//
// Why: every scenario "derives from and is refutable against" user-stories/,
// yet the requirements register (PRD.md, RQ-##) and the probe corpus shared
// ZERO referents when this was written — no RQ named a Situation, no Situation
// named an RQ, so the two could drift forever without contradicting each other.
// PRD.md §4.6 is now the tie: every requirement names its Situation anchor or
// declares the probe owed, with what the owed probe must show.
//
// What it checks:
//   1. Every `#### RQ-N:` defined in PRD.md has a §4.6 row, and every row names
//      a defined RQ (no orphans, no phantoms — the gate-coverage shape).
//   2. Every row either declares `owed — <nonempty what>` or names a
//      `Situation-X` whose folder exists under user-stories/Situations/.
// What it cannot check, printed as the honest bound: whether an anchored
// Situation's beat actually exercises the requirement — existence is
// mechanical, aboutness is a reading job (the cross-layer-cite bound, here).
// An `owed` row is a debt this gate keeps visible, not an exemption it grants.
//
// Usage:
//   node deployment/scripts/probe-coverage.mjs             check
//   node deployment/scripts/probe-coverage.mjs --selfcheck assert-based self-test

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildIds, gateLines, scenarioDefs } from "./gate-coverage.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// ---------------------------------------------------------------------------
// The provenance half (2026-08-29). Two scars, one subject: the provenance
// registers guarded known rows and nothing guarded a NEW one.
//
// (1) HELD-OUT CITATION. FR10 holds Situation E out of v1 and FD-59 re-provenanced
//     six harness rows that had quietly derived from E's on-call roster — "which
//     build gates are forbidden to cite". That correction was a one-time sweep:
//     a new row citing E was caught by nothing, and "a new row's register entry
//     is discipline, not a gate."
//
//     Scope, chosen so the check cannot cry wolf: a BUILD-GATING row only —
//     one tagged `[MUST…]` or `[ENGINE…]`, the classes gate-coverage.mjs treats
//     as gates. `[HELD-OUT]` rows are held-out by definition and must be able to
//     name E. Rows carrying neither (`[honest decline]`, `[SHOULD …]`) are not
//     build gates and may cite E illustratively — engine P2 does exactly that,
//     alongside Situation-B, and it is not the defect FD-59 corrected.
//     A gating row may still cite E if it carries the re-provenance marker the
//     ruling established: the `held-out E's` form already in harness/SCENARIOS.md.
//
//     Zero rows violate this today, so the check is ARMED rather than busy —
//     which is the state a regression guard is supposed to be in.
//
// (2) UNKNOWN REGISTER NAME. user-stories/README.md declares four registers and
//     each probe records one in-file as `**Provenance: <name>**`. Set membership
//     against the declared home, the roster-check shape one level over. A fifth
//     register invented in a probe file reads as vocabulary and is caught here.
//
// What neither can check, and it is the honest bound: whether a register tag is
// TRUE. Existence is mechanical, aboutness is a reading job — the same bound the
// RQ half already prints.
const MARKER = "held-out E's";
const GATING = /^(?:MUST|ENGINE)\b/;

// --- the obligation-cardinality half (2026-08-31 — Q1-01 widened; H1–H3) ---
//
// The canonical universe is the audit's part-(a) classifier (plan Appendix A-3):
// every bold-ID bullet across the six SCENARIOS suites; a row is a LAWFUL
// EXCLUSION when its bracket tag opens SHOULD/HELD-OUT or a trailing backticked
// marker immediately before the closing ** reads [DRILL]; everything else is
// obligation. The four product suites (engine/app/marketplace/security) declare
// "Every scenario is MUST" in their own preambles, so their rows are GATING
// regardless of bracket text — which is what finally puts engine P2 inside the
// held-out-citation check, admitted only through FD-59's exact marker.
export const SUITE_FILES = {
  harness: "harness/SCENARIOS.md",
  engine: "engine/SCENARIOS.md",
  app: "app/SCENARIOS.md",
  marketplace: "marketplace/SCENARIOS.md",
  security: "security/SCENARIOS.md",
  deployment: "deployment/SCENARIOS.md",
};
const PERM = /^\s*-\s*\*\*([A-Z]\d+[a-z]?)\b/;
const SHIP = /^\s*-\s*\*\*([A-Z]\d+[a-z]?)\s*\[([^\]]*)\]\*\*/;
const WIDE = /^\s*-\s*\*\*([A-Z]\d+[a-z]?)\s*\[([^\]]*)\](?:\s*`\[[^\]]*\]`)?\*\*(.*)$/;
const TRAIL = /`\[([A-Z-]+)\]`\*\*/;

export function classifySuite(text, preambleMust) {
  const rows = [];
  for (const line of text.split("\n")) {
    const perm = line.match(PERM);
    if (!perm) continue;
    const ship = line.match(SHIP);
    const wide = line.match(WIDE);
    const tag = ship ? ship[2].trim() : wide ? wide[2].trim() : "";
    const trail = line.match(TRAIL);
    const excluded = tag.startsWith("SHOULD") || tag.startsWith("HELD-OUT") || (trail !== null && trail[1] === "DRILL");
    const gating =
      !excluded && (GATING.test(tag) || (trail !== null && (trail[1] === "MUST" || trail[1] === "ENGINE")) || preambleMust);
    rows.push({ id: perm[1], body: wide ? wide[3] : line, excluded, gating });
  }
  return rows;
}

export const declaresPreambleMust = (text) => /Every scenario is MUST/.test(text);

export function registerNames(readme) {
  const m = readme.match(/([A-Za-z]+) registers, recorded per probe[^\n]*\n\n((?:- \*\*[^\n]*\n)+)/);
  if (!m) return null;
  return { word: m[1], names: [...m[2].matchAll(/^- \*\*([a-z-]+)\*\*/gm)].map((x) => x[1]) };
}

// A scenario definition row, with its tag: `- **D12 [MUST / the ladder walk]** …`
export function rows(text) {
  const out = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\s*\[([^\]]*)\]\*\*(.*)$/);
    if (m) out.push({ id: m[1], tag: m[2], body: m[3] });
  }
  return out;
}

export function heldOutViolations(text, file, preambleMust = false) {
  // Widened 2026-08-31 (Q1-01): the checked set is every GATING row under the
  // classification above — bracket/trailing MUST/ENGINE, plus the product
  // suites' preamble-MUST — not only bracket-tagged rows. A row is admitted
  // with an E citation only through FD-59's exact marker.
  return classifySuite(text, preambleMust)
    .filter((r) => r.gating && /Situation[-\s]E\b/.test(r.body) && !r.body.includes(MARKER))
    .map((r) => `${file} ${r.id} cites held-out Situation E with no "${MARKER}" re-provenance marker (FR10, FD-59)`);
}

export function registerTags(text) {
  return [...text.matchAll(/\*\*Provenance: ([a-z-]+)\*\*/g)].map((m) => m[1]);
}

// --- the story-ID trace arm (2026-09-14; user-stories/README.md §The bar a story passes, item 5) ---
//
// The Matt English companion keeps its scene, MT, CRUD and HR IDs as the story
// defines them, and each carries one trace: the layer rows whose text cites it,
// each with the BUILD step that closes that row, or the missing link named as
// owed. deployment/SCENARIOS.md B8 recorded this arm as owed — no gate read a
// story ID, so a dropped case, a duplicated scene, a trace at a phantom scenario
// or a trace with its BUILD link removed all stayed green.
//
// What it checks, with no second copy of any ID list: the census counts are read
// from item 5's own sentence, the IDs from the story (scene anchors) and the
// companion (MT and CRUD rows, HR headings). Every ID is defined once, MT/CRUD/HR
// run 01..N, and every ID carries exactly one trace; a trace on anything else is
// a phantom, which also keeps provenance and supplemental rows from being
// promoted into acceptance. A traced layer row must be defined in its suite and
// never [HELD-OUT] (held-out E/ER material is never acceptance), and its listed
// steps must equal the steps whose Verify or Gate names it (any step naming it
// where none does) — the reading the companion's layer-debt table states. A model
// item must be defined in EVALS.md and closes only at the Qualification step:
// set-level qualification, never a per-item BUILD home (gate-coverage's model
// exclusion). Each CRUD action cell states Shown, with its scene, or Required;
// every scene link resolves; the supplemental cases item 5 names still stand.
//
// What it cannot check, printed: whether a cited row asserts the ID's claim.
// A trace is a pointer, never a pass — scripted prose, a Shown cell and a
// resolving row are not results.
// Stories are DISCOVERED, not listed (FD-109): every `story-<name>.md` under a
// Situation folder with a sibling `story-<name>-verification.md` is a traced
// story. A story without a companion is narrative, not a traced obligation.
export function discoverStories(root = ROOT) {
  const dir = path.join(root, "user-stories/Situations");
  const out = [];
  for (const sit of fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const f of fs.readdirSync(path.join(dir, sit.name)).sort()) {
      const m = f.match(/^(story-[a-z0-9-]+)\.md$/);
      if (!m || m[1].endsWith("-verification")) continue;
      const companion = `${m[1]}-verification.md`;
      if (fs.existsSync(path.join(dir, sit.name, companion)))
        out.push({ story: `user-stories/Situations/${sit.name}/${f}`, companion: `user-stories/Situations/${sit.name}/${companion}` });
    }
  }
  return out;
}
const DEFAULT_STORY = "user-stories/Situations/Situation-A/story-matt.md";
const DEFAULT_COMPANION = "user-stories/Situations/Situation-A/story-matt-verification.md";
export const TRACE_LAYERS = ["harness", "engine", "app", "marketplace", "security"];
const TRACE_LINKS = {
  harness: { spec: "harness/SPEC.md", seam: "harness/INTERFACES.md", acceptance: "harness/SCENARIOS.md", build: "harness/BUILD.md" },
  engine: { spec: "engine/SPEC.md", seam: "engine/INTERFACES.md", acceptance: "engine/SCENARIOS.md", build: "engine/BUILD.md" },
  app: { spec: "app/SPEC.md", seam: "app/INTERFACES.md", acceptance: "app/SCENARIOS.md", build: "app/BUILD.md" },
  marketplace: { spec: "marketplace/SPEC.md", seam: "marketplace/INTERFACES.md", acceptance: "marketplace/SCENARIOS.md", build: "marketplace/BUILD.md" },
  security: { spec: "security/SPEC.md", seam: "security/INTERFACES.md", acceptance: "security/SCENARIOS.md", build: "security/BUILD.md" },
  model: { spec: "model/SPEC.md", seam: "model/INTERFACES.md", acceptance: "model/EVALS.md", build: "model/BUILD.md" },
};
const LINK = /^\[([a-z]+)\]\(#trace-\1\)$/;

// The companion's one current documentary debt is deliberately not promoted to
// an outcome: the spec writer still owes the CRUD-02 removal cell an explicit
// Required or Shown label. Keep the exact prose marker so a later negated or
// empty replacement cannot inherit this exception silently.
const OUTCOME_DEBT = new Map([
  ["CRUD-02 delete/removal", "A required timezone cannot become an unexplained null/default."],
]);

// The census sentence for one story: a link to the story followed by
// "keeps its N scene, N MT, N CRUD and N HR IDs" and, in the same paragraph,
// the supplemental list. A story with no census is checked without counts.
export function census(readme, storyFile = DEFAULT_STORY) {
  const base = path.basename(storyFile).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const linked = readme.match(new RegExp(`\\]\\([^)]*${base}\\)[^\\n]*?keeps its (\\d+) scene, (\\d+) MT, (\\d+) CRUD and (\\d+) HR IDs`));
  const m = linked ?? readme.match(/keeps its (\d+) scene, (\d+) MT, (\d+) CRUD and (\d+) HR IDs/);
  if (!m) return null;
  const paragraph = readme.slice(m.index, readme.indexOf("\n", m.index) < 0 ? undefined : readme.indexOf("\n", m.index));
  const s = paragraph.match(/((?:[A-Z]+-\d+(?:–\d+)?(?:, | and )?)+) stay supplemental obligations/);
  if (!s) return null;
  const supplemental = [];
  for (const [, fam, a, b] of s[1].matchAll(/([A-Z]+)-(\d+)(?:–(\d+))?/g))
    for (let n = +a; n <= +(b ?? a); n++) supplemental.push(`${fam}-${String(n).padStart(a.length, "0")}`);
  return { counts: { S: +m[1], MT: +m[2], CRUD: +m[3], HR: +m[4] }, supplemental };
}

export function storyIds(story, companion) {
  const rowsOf = (fam) => [...companion.matchAll(new RegExp(`^\\| (${fam}-\\d+) \\|`, "gm"))].map((m) => m[1]);
  return {
    S: [...story.matchAll(/<a id="s(\d+[a-z]?)"><\/a>/g)].map((m) => `S${m[1]}`),
    MT: rowsOf("MT"),
    CRUD: rowsOf("CRUD"),
    HR: [...companion.matchAll(/^## (HR-\d+) —/gm)].map((m) => m[1]),
  };
}

// Every trace in the companion, attributed to the row or HR section it sits in.
export function storyTraces(companion, storyFile = DEFAULT_STORY) {
  const out = [];
  let hr = null;
  const base = path.basename(storyFile).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sceneRow = new RegExp(`^\\| \\[(S\\d+[a-z]?)\\]\\(${base}#s\\d+[a-z]?\\) \\| (.+) \\|$`);
  for (const line of companion.split("\n")) {
    if (line.startsWith("## ")) hr = line.match(/^## (HR-\d+) —/)?.[1] ?? null;
    const scene = line.match(sceneRow);
    if (scene) {
      out.push({ id: scene[1], body: scene[2] });
      continue;
    }
    const at = line.indexOf("**Trace:** ");
    if (at < 0) continue;
    const row = line.match(/^\| ([A-Z][A-Z0-9]*(?:-[A-Z]?\d+)?) \|/);
    const id = row ? row[1] : line.startsWith("**Trace:**") ? hr : null;
    out.push({ id: id ?? `an unattributed trace ("${line.slice(0, 40)}")`, body: line.slice(at + 11).replace(/ \|$/, "") });
  }
  return out;
}

// `[layer](#trace-layer) B1, B2 → Steps 4, 5 · E1 → Step 3 · … ; owed at [layer](#trace-layer).`
// or `no layer row cites <ID> yet — acceptance owed at [layer](#trace-layer), ….`
export function parseTrace(id, body) {
  const bad = [];
  const links = (s) => s.split(", ").map((l) => l.match(LINK)?.[1] ?? null);
  let text = body.trim().replace(/\.$/, "");
  const none = text.match(/^no layer row cites (\S+) yet — acceptance owed at (.+)$/);
  if (none) {
    if (none[1] !== id) bad.push(`${id}'s trace says no row cites ${none[1]} — a trace names its own ID`);
    const owed = links(none[2]);
    if (owed.includes(null)) bad.push(`${id}'s owed layers do not parse as [layer](#trace-layer) links`);
    return { groups: [], owed, bad };
  }
  let owed = [];
  const semi = text.indexOf("; owed at ");
  if (semi >= 0) {
    owed = links(text.slice(semi + 10));
    if (owed.includes(null)) bad.push(`${id}'s owed layers do not parse as [layer](#trace-layer) links`);
    text = text.slice(0, semi);
  }
  const groups = [];
  let layer = null;
  for (const part of text.split(" · ")) {
    const g = part.match(/^(?:\[([a-z]+)\]\(#trace-\1\) )?(.+?)(?: → Steps? (\d+[a-z]?(?:, \d+[a-z]?)*))?$/);
    if (!g) {
      bad.push(`${id}'s trace has an empty group`);
      continue;
    }
    layer = g[1] ?? layer;
    if (!layer) bad.push(`${id}'s trace group "${part}" names no layer`);
    else if (!g[3]) bad.push(`${id}'s trace cites ${layer} ${g[2]} with no BUILD step — a traced row names the step that closes it`);
    else groups.push({ layer, rows: g[2].split(", "), steps: g[3].split(", ") });
  }
  return { groups, owed, bad };
}

export function traceLayerLinks(companion, companionFile = DEFAULT_COMPANION) {
  const bad = [];
  const referenced = new Set([...companion.matchAll(/\]\(#trace-([a-z]+)\)/g)].map((m) => m[1]));
  const lines = companion.split("\n");
  const companionDir = path.dirname(path.join(ROOT, companionFile));
  for (const layer of referenced) {
    const expected = TRACE_LINKS[layer];
    if (!expected) {
      bad.push(`the companion references trace layer "${layer}", which has no rule-home contract`);
      continue;
    }
    const line = lines.find((l) => l.includes(`<a id="trace-${layer}"></a>`));
    if (!line) {
      bad.push(`trace-${layer} has no layer-debt row with its rule home, seam, acceptance and BUILD links`);
      continue;
    }
    const links = [...line.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1]);
    for (const link of links) {
      const target = link.split("#", 1)[0];
      if (target.startsWith(".") && !fs.existsSync(path.resolve(companionDir, target)))
        bad.push(`trace-${layer} link target ${link} is missing`);
    }
    for (const [kind, target] of Object.entries(expected)) {
      const relative = path.relative(companionDir, path.join(ROOT, target)).replaceAll(path.sep, "/");
      if (!links.includes(relative)) bad.push(`trace-${layer} omits its ${kind} link to ${target}`);
      if (!fs.existsSync(path.join(ROOT, target))) bad.push(`trace-${layer} points its ${kind} link at missing ${target}`);
    }
  }
  return bad;
}

export function stepSections(build) {
  return build
    .split(/^(?=## )/m)
    .map((text) => ({ step: text.match(/^## Step (\d+[a-z]?)\b/)?.[1], text }))
    .filter((s) => s.step);
}

// The steps whose Verify/Gate line names the row; any step naming it where none does.
export function closingSteps(id, sections, defs) {
  const gated = sections.filter((s) => buildIds(gateLines(s.text), defs).has(id)).map((s) => s.step);
  return gated.length ? gated : sections.filter((s) => buildIds(s.text, defs).has(id)).map((s) => s.step);
}

// texts: { readme, story, companion, layers: { name: { scen, build } }, model: { evals, build }, storyFile?, companionFile? }
// A story with no census sentence in the README is checked without counts (FD-109).
export function checkStory({ readme, story, companion, layers, model, storyFile = DEFAULT_STORY, companionFile = DEFAULT_COMPANION }) {
  const bad = [];
  const decl = census(readme, storyFile) ?? { counts: null, supplemental: [] };
  bad.push(...traceLayerLinks(companion, companionFile));
  const ids = storyIds(story, companion);
  const counts = {};
  for (const [fam, list] of Object.entries(ids)) {
    const seen = new Map();
    for (const x of list) seen.set(x, (seen.get(x) || 0) + 1);
    for (const [x, n] of seen) if (n > 1) bad.push(`${x} is defined ${n} times — one ID, one definition`);
    counts[fam] = seen.size;
    const want = decl.counts ? decl.counts[fam] : seen.size;
    if (seen.size !== want) bad.push(`user-stories/README.md item 5 declares ${want} ${fam} IDs and ${fam === "S" ? storyFile : companionFile} defines ${seen.size}`);
    if (fam !== "S")
      for (let n = 1; n <= want; n++) {
        const x = `${fam}-${String(n).padStart(2, "0")}`;
        if (!seen.has(x)) bad.push(`${x} is not defined — the ${fam} IDs run 01–${want}, never renumbered or dropped`);
      }
  }

  const defined = new Set(Object.values(ids).flat());
  const traced = new Map();
  for (const t of storyTraces(companion, storyFile)) {
    if (!defined.has(t.id)) bad.push(`a trace for ${t.id}, which the story census does not define (phantom)`);
    else if (traced.has(t.id)) bad.push(`${t.id} carries two traces — one ID, one trace`);
    else traced.set(t.id, t.body);
  }
  for (const x of defined) if (!traced.has(x)) bad.push(`${x} carries no trace — name its covering rows or the missing link as owed`);

  const defsOf = {};
  const stepsOf = {};
  for (const [name, t] of Object.entries(layers)) {
    defsOf[name] = scenarioDefs(t.scen);
    stepsOf[name] = stepSections(t.build);
  }
  const items = new Set([...model.evals.matchAll(/^\| ([A-Z]-\d+) \|/gm)].map((m) => m[1]));
  const qualification = stepSections(model.build).find((s) => /^## Step \S+ — Qualification/.test(s.text))?.step;
  if (!qualification) bad.push("model/BUILD.md has no Qualification step for a model item to close at — fix this script's contract");
  let cited = 0;
  let owedOnly = 0;
  for (const [id, body] of traced) {
    const p = parseTrace(id, body);
    bad.push(...p.bad);
    for (const l of p.owed) if (l && l !== "model" && !defsOf[l]) bad.push(`${id} owes acceptance at "${l}", which is not a traced layer`);
    if (!p.groups.length) owedOnly++;
    for (const g of p.groups) {
      cited += g.rows.length;
      if (g.layer === "model") {
        for (const r of g.rows) if (!items.has(r)) bad.push(`${id} cites model item ${r}, which model/EVALS.md does not define (phantom)`);
        if (qualification && g.steps.join() !== qualification)
          bad.push(`${id} closes model items ${g.rows.join(", ")} at Step ${g.steps.join(", ")} — a model item closes only at Step ${qualification}'s set-level qualification`);
        continue;
      }
      const defs = defsOf[g.layer];
      if (!defs) {
        bad.push(`${id} traces to "${g.layer}", which is not a traced layer`);
        continue;
      }
      // Every listed step must name a row of the group, and every row must close at
      // a listed step. Not equality: a gate line's cross-layer mention (app Step 5
      // names security's V1) reads exactly like a citation of this layer's V1.
      const closes = new Set();
      for (const r of g.rows) {
        const def = defs.get(r);
        if (!def) bad.push(`${id} cites ${g.layer} ${r}, which ${g.layer}/SCENARIOS.md does not define (phantom)`);
        else if (def.tag === "HELD-OUT") bad.push(`${id} cites ${g.layer} ${r}, a [HELD-OUT] row — held-out material is never a story's acceptance`);
        else {
          const steps = closingSteps(r, stepsOf[g.layer], defs);
          if (!steps.length) bad.push(`${id} cites ${g.layer} ${r}, which no ${g.layer}/BUILD.md step names (absent BUILD closure)`);
          else if (!steps.some((s) => g.steps.includes(s)))
            bad.push(`${id} lists no step that closes ${g.layer} ${r} — ${g.layer}/BUILD.md names it at Step(s) ${steps.join(", ")}`);
          steps.forEach((s) => closes.add(s));
        }
      }
      const extra = [...new Set(g.steps)].filter((s) => !closes.has(s));
      if (closes.size && extra.length)
        bad.push(`${id} closes ${g.layer} ${g.rows.join(", ")} at Step ${extra.join(", ")}, which names none of them — ${g.layer}/BUILD.md names them at Step(s) ${[...closes].sort().join(", ")}`);
    }
  }

  const scenes = new Set(ids.S);
  const storyBase = path.basename(storyFile);
  for (const m of companion.matchAll(/\[([^\]]+)\]\(([^)]*)\)/g)) {
    if (!m[2].startsWith(`${storyBase}#`)) continue;
    const id = m[1];
    const target = m[2].slice(storyBase.length + 1);
    if (!/^S\d+[a-z]?$/.test(id) || target !== id.toLowerCase() || !scenes.has(id))
      bad.push(`the companion links scene ${id} at #${target}, which ${storyFile} does not define (phantom or malformed destination)`);
  }
  let cells = 0;
  const owedCells = [];
  for (const line of companion.split("\n")) {
    const row = line.match(/^\| (CRUD-\d+) \|/);
    if (!row) continue;
    const actions = line.split(" | ").slice(2, 5);
    ["create/read", "edit", "delete/removal"].forEach((what, i) => {
      const c = actions[i] ?? "";
      const key = `${row[1]} ${what}`;
      const shown = [...c.matchAll(/\bShown\s+\[([^\]]+)\]\(([^)]*)\)/g)];
      const malformedShown = shown.filter((m) => {
        const id = m[1];
        const target = m[2].startsWith(`${storyBase}#`) ? m[2].slice(storyBase.length + 1).match(/^(s\d+[a-z]?)$/) : null;
        return !/^S\d+[a-z]?$/.test(id) || !target || target[1] !== id.toLowerCase() || !scenes.has(id);
      });
      for (const m of malformedShown)
        bad.push(`${key} has a malformed Shown destination: [${m[1]}](${m[2]})`);
      const hasShown = shown.length > 0 && malformedShown.length === 0;
      const negatedRequired = /\b(?:not|never|no)\s+Required\b/i.test(c);
      const explicitRequired = !negatedRequired &&
        (/(?:^|[.;])\s*Required\b\s*(?::\s*[A-Za-z0-9]|\s+[A-Za-z0-9])/.test(c) ||
          /\b(?:is|remain|remains|stays)\s+Required\b/.test(c));
      if (hasShown || explicitRequired) {
        cells++;
        return;
      }
      const debtMarker = OUTCOME_DEBT.get(key);
      if (debtMarker && c.includes(debtMarker)) {
        owedCells.push(key);
        return;
      }
      if (!hasShown && !explicitRequired)
        bad.push(`${row[1]}'s ${what} outcome states neither Shown (with its scene) nor Required — an action not shown stays Required`);
    });
  }
  for (const x of decl.supplemental)
    if (!companion.includes(`<a id="${x.toLowerCase()}"></a>`)) bad.push(`${x}, a supplemental obligation item 5 names, no longer stands in ${companionFile}`);

  return { bad, counts, total: defined.size, cited, owedOnly, cells, owedCells, supplemental: decl.supplemental };
}

function definedRQs(prd) {
  return [...prd.matchAll(/^#### (RQ-\d+):/gm)].map((m) => m[1]);
}

function anchorRows(prd) {
  // §4.5's "what the specs owe" map also has | RQ-N | rows — only the §4.6
  // probe-anchor section is this gate's domain.
  const section = prd.match(/### 4\.6 Probe anchors[\s\S]*?(?=\n## )/);
  if (!section) return [];
  const rows = [];
  for (const m of section[0].matchAll(/^\| (RQ-\d+) \| ([^|]+) \|$/gm)) rows.push({ rq: m[1], anchor: m[2].trim() });
  return rows;
}

function check(prd, situationExists) {
  const bad = [];
  const defined = definedRQs(prd);
  const rows = anchorRows(prd);
  if (!defined.length) return ["PRD.md defines no #### RQ-N headings — the parsing contract broke, fix this script"];
  if (!rows.length) return ["PRD.md §4.6's anchor table no longer parses — fix this script's contract"];
  const rowFor = new Map(rows.map((r) => [r.rq, r]));
  for (const rq of defined) if (!rowFor.has(rq)) bad.push(`${rq} is defined and has no probe-anchor row (orphan)`);
  for (const r of rows) {
    if (!defined.includes(r.rq)) bad.push(`§4.6 anchors ${r.rq}, which no #### heading defines (phantom)`);
    const owed = r.anchor.match(/^owed — (.+)$/s);
    const situation = r.anchor.match(/Situation-([A-Z0-9]+)/);
    if (owed) {
      if (owed[1].trim().length < 10) bad.push(`${r.rq}'s owed row does not say what the probe must show`);
    } else if (situation) {
      if (!situationExists(`Situation-${situation[1]}`)) bad.push(`${r.rq} anchors Situation-${situation[1]}, which does not exist`);
    } else {
      bad.push(`${r.rq}'s row is neither \`owed — <what>\` nor a Situation anchor: "${r.anchor.slice(0, 60)}"`);
    }
  }
  return bad;
}

if (process.argv.includes("--selfcheck")) {
  const mk = (rows) =>
    `#### RQ-1: a\n#### RQ-2: b\n| RQ-1 | a §4.5-style row outside the section, must be ignored |\n### 4.6 Probe anchors\n${rows}\n## 5. after`;
  const prd = mk("| RQ-1 | owed — a beat where the thing happens |\n| RQ-2 | Situations exercised at Situation-A, the placement beat |");
  const exists = (s) => s === "Situation-A";
  assert.deepStrictEqual(check(prd, exists), [], "a clean register passes, and rows outside §4.6 are ignored");
  assert.ok(check(prd.replace("#### RQ-2: b\n", "#### RQ-2: b\n#### RQ-3: c\n"), exists).some((b) => b.includes("RQ-3")), "an unanchored RQ is an orphan");
  assert.ok(
    check(mk("| RQ-1 | owed — a beat where the thing happens |\n| RQ-2 | Situation-A, the placement beat |\n| RQ-9 | owed — something long enough |"), exists).some((b) => b.includes("phantom")),
    "a phantom row is caught",
  );
  assert.ok(check(prd.replace("Situation-A, the placement beat", "Situation-Z"), exists).some((b) => b.includes("Situation-Z")), "a dead anchor is caught");
  assert.ok(check(prd.replace("owed — a beat where the thing happens", "owed — tbd"), exists).some((b) => b.includes("what the probe must show")), "a contentless owed row is caught");

  // --- the held-out half, with its negatives ---
  const bare = "- **D12 [MUST / the ladder walk]** Given a ranked roster from Situation-E, the walk proceeds.";
  const marked = `- **D12 [MUST / the ladder walk]** Given a ranked roster that derives from **${MARKER}** on-call roster, the walk proceeds.`;
  assert.strictEqual(heldOutViolations(bare, "f").length, 1, "a build-gating row citing E bare is refused");
  assert.strictEqual(heldOutViolations(marked, "f").length, 0, "the same row carrying FD-59's marker passes");
  assert.strictEqual(heldOutViolations("- **E1 [HELD-OUT]** Situation-E predictions.", "f").length, 0, "a HELD-OUT row may name E — that is what it is for");
  assert.strictEqual(heldOutViolations("- **P2 [honest decline]** ...Situation-E's safe park.", "f").length, 0, "a non-gating row is not a build gate, and engine P2 is the live case");
  assert.strictEqual(heldOutViolations("- **D15 [SHOULD / exhaustion parks]** Situation-E roster.", "f").length, 0, "nor is a SHOULD");
  assert.strictEqual(heldOutViolations("prose about Situation-E outside any row", "f").length, 0, "prose is not a definition row");

  // --- the widened classification's canaries (2026-08-31, Q1-01/H2/H3) ---
  // shape 2/3: the tag rides a trailing backticked marker before the closing **.
  const shape2 = "- **S3 [nothing from outside: no fetched spec] `[MUST]`** Given Situation-E text arrives.";
  assert.strictEqual(heldOutViolations(shape2, "f").length, 1, "a trailing-[MUST] row (shape 2/3) is inside the checked set now");
  const shape2marked = `- **S3 [nothing from outside] \`[MUST]\`** Given **${MARKER}** text arrives (Situation-E, re-provenanced).`;
  assert.strictEqual(heldOutViolations(shape2marked, "f").length, 0, "and the marker admits it");
  const drill = "- **R10 [the ladder drill] `[DRILL]`** walks Situation-E once.";
  assert.strictEqual(heldOutViolations(drill, "f").length, 0, "a trailing-[DRILL] row is a lawful exclusion, not a gate");
  assert.deepStrictEqual(
    classifySuite(shape2 + "\n" + drill, false).map((r) => [r.id, r.excluded, r.gating]),
    [["S3", false, true], ["R10", true, false]],
    "the cardinality classification: trailing-MUST guarded, trailing-DRILL exempt",
  );

  // preamble-MUST: an untagged-bracket row in a product suite is gating — the
  // live case is engine P2, admitted only through FD-59's exact marker.
  const p2marked = `- **P2 [honest decline]** No placement exists. *(Situation-B's "no bike"; **${MARKER}** safe park — the Situation-E example.)*`;
  const p2stripped = `- **P2 [honest decline]** No placement exists. *(Situation-B's "no bike"; Situation-E's safe park.)*`;
  assert.strictEqual(heldOutViolations(p2marked, "engine/SCENARIOS.md", true).length, 0, "marked P2 is admitted under the preamble classification");
  assert.strictEqual(heldOutViolations(p2stripped, "engine/SCENARIOS.md", true).length, 1, "a marker-stripped P2 fails — the DEV-07 completion canary");
  assert.strictEqual(heldOutViolations(p2stripped, "engine/SCENARIOS.md", false).length, 0, "outside a preamble-MUST suite the same row is not gating — the classification, not the string, decides");

  // --- the register half, with its negatives ---
  const readme = "Four registers, recorded per probe so nobody has to reconstruct this later:\n\n- **elicited-blind** — a\n- **elicited-to-design** — b\n- **scripted** — c\n- **held-out** — d\n\nprose after";
  const reg = registerNames(readme);
  assert.deepStrictEqual(reg.names, ["elicited-blind", "elicited-to-design", "scripted", "held-out"]);
  assert.strictEqual(reg.word, "Four", "the declared count word is read too, so the list and its number cannot drift apart");
  assert.deepStrictEqual(registerTags("***Provenance: scripted** (added later)*"), ["scripted"], "an in-file tag parses");
  assert.deepStrictEqual(registerTags("no tag here"), [], "a file with no tag declares nothing");
  assert.ok(!reg.names.includes(registerTags("**Provenance: vibes-based**")[0]), "a register nobody declared is not in the set");
  assert.strictEqual(registerNames("no such declaration"), null, "an unparseable register list is a failure, not an empty set");

  // --- the story-ID trace arm, with its negatives ---
  const sx = {
    readme: "Matt keeps its 2 scene, 2 MT, 1 CRUD and 1 HR IDs as they are defined. XR-01–02 and LEGAL-01 stay supplemental obligations beside those IDs.",
    story: '<a id="s01"></a>\nscene one\n<a id="s01a"></a>\nscene one-a',
    companion: [
      '<a id="trace-harness"></a> [Harness SPEC](../../../harness/SPEC.md), [interfaces](../../../harness/INTERFACES.md), [scenarios](../../../harness/SCENARIOS.md), [BUILD](../../../harness/BUILD.md)',
      '<a id="trace-model"></a> [Model SPEC](../../../model/SPEC.md), [interfaces](../../../model/INTERFACES.md), [evals](../../../model/EVALS.md), [BUILD](../../../model/BUILD.md)',
      "| [S01](story-matt.md#s01) | [harness](#trace-harness) B1 → Step 4. |",
      "| [S01a](story-matt.md#s01a) | no layer row cites S01a yet — acceptance owed at [harness](#trace-harness). |",
      "| MT-01 | a | b | c **Trace:** [harness](#trace-harness) B1, B2 → Steps 4, 5 · [model](#trace-model) N-01 → Step 3. |",
      "| MT-02 | a | b | c **Trace:** no layer row cites MT-02 yet — acceptance owed at [harness](#trace-harness), [model](#trace-model). |",
      "| CRUD-01 | obj | Shown [S01](story-matt.md#s01): create. | Required: edit. | Removal remains Required. **Trace:** [harness](#trace-harness) B2 → Step 5. |",
      "## HR-01 — a cue",
      "**Trace:** [harness](#trace-harness) B1 → Step 4; owed at [harness](#trace-harness).",
      "## Supplemental",
      '| XR-01 | <a id="xr-01"></a> a | b | c |',
      '| XR-02 | <a id="xr-02"></a> a | b | c |',
      '<a id="legal-01"></a>',
      "| E01 | provenance | untraced |",
    ].join("\n"),
    layers: {
      harness: {
        scen: "- **B1 [MUST]** a\n- **B2 [MUST]** b\n- **J1 [HELD-OUT]** c",
        build: "## Step 4 — elicitation\n- **Verify:** B1\n## Step 5 — loop\n- **Verify:** B2\n## Step 6 — held-out\n- **Verify:** J1\n## Guardrails\nB1 B2",
      },
    },
    model: { evals: "| N-01 | an item |\n| A-01 | another |", build: "## Step 2 — Prompt authoring\n## Step 3 — Qualification runs\n" },
  };
  const story = (patch) => checkStory({ ...sx, ...patch }).bad;
  const comp = (from, to) => {
    assert.ok(sx.companion.includes(from), `fixture anchor: ${from}`);
    return story({ companion: sx.companion.replace(from, to) });
  };
  const fails = (bad, needle, why) => assert.ok(bad.some((b) => b.includes(needle)), `${why} — findings: ${JSON.stringify(bad)}`);
  const clean = checkStory(sx);
  assert.deepStrictEqual(clean.bad, [], "a complete map passes");
  assert.strictEqual(clean.total, 6, "and counts every census ID");
  assert.strictEqual(clean.owedOnly, 2, "a no-row trace is counted as owed, never as covered");
  assert.ok(story({ companion: sx.companion.replace(/^<a id="trace-harness">.*\n/m, "") }).some((b) => b.includes("trace-harness") && b.includes("no layer-debt row")), "a deleted layer row fails");
  assert.ok(story({ companion: sx.companion.replace("../../../harness/SPEC.md", "../../../harness/PHANTOM.md") }).some((b) => b.includes("link target") && b.includes("PHANTOM.md")), "a phantom rule-home target fails");
  fails(comp("| MT-02 | a | b | c **Trace:** no layer row cites MT-02 yet — acceptance owed at [harness](#trace-harness), [model](#trace-model). |\n", ""), "MT-02 is not defined", "a dropped MT case fails");
  fails(comp("| [S01](story-matt.md#s01) | [harness](#trace-harness) B1 → Step 4. |", "| [S01](story-matt.md#s01) | [harness](#trace-harness) B1 → Step 4. |\n| [S01](story-matt.md#s01) | [harness](#trace-harness) B1 → Step 4. |"), "S01 carries two traces", "a duplicated scene fails");
  fails(comp("| [S01a](story-matt.md#s01a) |", "| [S02](story-matt.md#s02) | [harness](#trace-harness) B1 → Step 4. |\n| [S01a](story-matt.md#s01a) |"), "a trace for S02", "a phantom scene row fails");
  fails(comp("B2 → Step 5. |", "B9 → Step 5. |"), "does not define (phantom)", "a CRUD row pointed at a phantom scenario fails");
  fails(comp("Shown [S01](story-matt.md#s01): create.", "Shown [S09](story-matt.md#s09): create."), "links scene S09", "a Shown cell at a phantom scene fails");
  fails(comp("B2 → Step 5. |", "B2. |"), "with no BUILD step", "a removed BUILD link fails");
  fails(comp("B2 → Step 5. |", "B2 → Step 4. |"), "at Step 4, which names none of them", "a trace closing at the wrong step fails");
  fails(comp("B1, B2 → Steps 4, 5", "B1, B2 → Step 4"), "lists no step that closes harness B2", "a group dropping a row's only closing step fails");
  assert.deepStrictEqual(
    story({ layers: { harness: { ...sx.layers.harness, build: sx.layers.harness.build.replace("- **Verify:** B2", "- **Verify:** B2\n- **Gate:** B1 (a cross-layer mention)") } } }),
    [],
    "a further gate-line mention of a row does not force its step into the trace — the printed bound",
  );
  fails(story({ layers: { harness: { ...sx.layers.harness, build: sx.layers.harness.build.replace("- **Verify:** B2\n", "").replace("B1 B2", "B1") } } }), "absent BUILD closure", "a row no BUILD step names fails");
  fails(comp("| Required: edit. |", "| Edit. |"), "edit outcome states neither", "a CRUD cell stripped of its Required outcome fails");
  fails(comp("| Required: edit. |", "| Required |"), "edit outcome states neither", "an empty Required label fails");
  fails(comp("| Required: edit. |", "| Not Required: edit. |"), "edit outcome states neither", "a negated Required outcome fails");
  fails(comp("Shown [S01](story-matt.md#s01): create.", "Shown [S01](story-matt.md#missing): create."), "malformed Shown destination", "a Shown link to a missing scene anchor fails");
  fails(comp("\n**Trace:** [harness](#trace-harness) B1 → Step 4; owed at [harness](#trace-harness).", ""), "HR-01 carries no trace", "a missing trace fails");
  fails(comp("\n**Trace:** [harness](#trace-harness) B1 → Step 4; owed at [harness](#trace-harness).", "\n**Trace:** [harness](#trace-harness) B1 → Step 4.\n**Trace:** [harness](#trace-harness) B1 → Step 4."), "HR-01 carries two traces", "a second trace on one cue fails");
  fails(comp("| E01 | provenance | untraced |", "| E01 | provenance | **Trace:** [harness](#trace-harness) B1 → Step 4. |"), "a trace for E01", "a provenance row promoted into acceptance fails");
  fails(comp('<a id="xr-02"></a>', ""), "XR-02, a supplemental obligation", "a dropped supplemental case fails");
  fails(comp("MT-01 | a | b | c **Trace:** [harness](#trace-harness) B1, B2", "MT-01 | a | b | c **Trace:** [harness](#trace-harness) J1, B2"), "[HELD-OUT] row", "a held-out row cited as acceptance fails");
  fails(comp("N-01 → Step 3. |", "N-01 → Step 2. |"), "closes only at Step 3", "a model item closed anywhere but qualification fails");
  fails(comp("N-01 → Step 3. |", "N-09 → Step 3. |"), "model item N-09", "a phantom model item fails");
  fails(comp("no layer row cites MT-02 yet", "no layer row cites MT-01 yet"), "a trace names its own ID", "an owed trace naming another ID fails");
  assert.deepStrictEqual(story({ readme: "no census here" }), [], "a story with no README census is checked without counts, never refused (FD-109)");
  fails(story({ readme: sx.readme.replace("2 MT", "3 MT") }), "declares 3 MT IDs", "the declared count and the defined rows cannot drift apart");

  console.log("selfcheck OK");
  process.exit(0);
}

const prd = fs.readFileSync(path.join(ROOT, "PRD.md"), "utf8");
const situationExists = (name) => fs.existsSync(path.join(ROOT, "user-stories/Situations", name));
const bad = check(prd, situationExists);

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean);
const readOne = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// Check 1 — no gating row cites held-out E without FD-59's marker, over the
// widened classification; and the obligation cardinality, printed per suite.
const perSuite = [];
let totalParsed = 0;
let totalGuarded = 0;
let totalExempt = 0;
for (const [suite, file] of Object.entries(SUITE_FILES)) {
  const text = readOne(file);
  const preambleMust = declaresPreambleMust(text);
  const rowsHere = classifySuite(text, preambleMust);
  const parsed = rowsHere.length;
  const guarded = rowsHere.filter((r) => !r.excluded).length;
  totalParsed += parsed;
  totalGuarded += guarded;
  totalExempt += parsed - guarded;
  perSuite.push(`${suite} ${parsed}/${guarded}`);
  bad.push(...heldOutViolations(text, file, preambleMust));
}
// EVALS files stay outside the cardinality (the canonical universe is the six
// SCENARIOS suites) but inside the held-out-citation law at tag grain.
for (const f of tracked.filter((x) => /EVALS\.md$/.test(x))) {
  bad.push(...heldOutViolations(readOne(f), f, false));
}

// Check 2 — every register tag in use is one the declared home enumerates.
const reg = registerNames(readOne("user-stories/README.md"));
let tagCount = 0;
if (!reg) {
  bad.push(`user-stories/README.md no longer declares its register list in a parseable form (the "registers, recorded per probe" sentence and its bullets)`);
} else {
  if (reg.names.length !== ({ Three: 3, Four: 4, Five: 5, Six: 6 }[reg.word] ?? -1))
    bad.push(`user-stories/README.md says ${reg.word} registers and enumerates ${reg.names.length}`);
  for (const f of tracked.filter((f) => f.startsWith("user-stories/"))) {
    for (const tag of registerTags(readOne(f))) {
      tagCount++;
      if (!reg.names.includes(tag)) bad.push(`${f} records provenance "${tag}", which user-stories/README.md does not declare (declared: ${reg.names.join(", ")})`);
    }
  }
}

// Check 3 — the story-ID trace arm over every discovered story/companion pair.
const layerTexts = Object.fromEntries(
  TRACE_LAYERS.map((l) => [l, { scen: readOne(SUITE_FILES[l]), build: readOne(`${l}/BUILD.md`) }]),
);
const stories = discoverStories();
if (!stories.length) bad.push("no story/companion pair found under user-stories/Situations/ — a traced story is `story-<name>.md` beside `story-<name>-verification.md`");
const storyResults = stories.map((s) => {
  const r = checkStory({
    readme: readOne("user-stories/README.md"),
    story: readOne(s.story),
    companion: readOne(s.companion),
    layers: layerTexts,
    model: { evals: readOne("model/EVALS.md"), build: readOne("model/BUILD.md") },
    storyFile: s.story,
    companionFile: s.companion,
  });
  bad.push(...r.bad.map((b) => `${path.basename(s.story)}: ${b}`));
  return { ...r, story: s.story };
});

if (bad.length) {
  console.log(`\nPROBE-COVERAGE FAIL:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const rqRows = anchorRows(prd);
const owed = rqRows.filter((r) => r.anchor.startsWith("owed")).length;
console.log(
  `PROBE-COVERAGE OK — ${rqRows.length} requirement(s): ${rqRows.length - owed} anchored to a Situation, ${owed} declared owed (a debt kept visible, not an exemption); ` +
    `obligation scope per suite (parsed/guarded): ${perSuite.join(", ")} — summing ${totalParsed}/${totalGuarded}, ${totalExempt} declared exempt; ` +
    `no gating row cites held-out E without FD-59's re-provenance marker; ` +
    `${tagCount} recorded provenance tag(s), every one among the ${reg.names.length} user-stories/README.md declares; ` +
    `story traces over ${storyResults.length} discovered story/companion pair(s): ` +
    storyResults.map((r) => `${path.basename(r.story)} — ${r.total} IDs (${Object.entries(r.counts).map(([f, n]) => `${n} ${f}`).join(", ")}) each defined once with one trace, ` +
      `${r.cited} cited layer row/item reference(s) resolving in their suites and closing at a step that names them (model items at qualification only), ` +
      `${r.owedOnly} ID(s) with no citing row, owed; ${r.cells} CRUD outcome cell(s) stating Shown or Required; ` +
      `${r.owedCells.length} CRUD outcome debt(s) explicitly owed and not counted as outcomes (${r.owedCells.join(", ") || "none"}); supplemental ${r.supplemental.join(", ") || "none"} standing`).join("; ") + ". " +
    `A TRACE IS NOT A PASS: scripted prose, a Shown cell and a resolving row are pointers, not results. ` +
    `NOT CHECKED: whether an anchored beat actually exercises its requirement, whether a register tag is TRUE, or whether a cited row asserts its story ID's claim — existence is mechanical, aboutness is a reading job; ` +
    `nor that a trace lists every step naming a row, since a gate line's cross-layer mention reads like a citation.`,
);
