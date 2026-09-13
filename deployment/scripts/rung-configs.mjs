// RUNG-CONFIGS — the one definition of "a file whose presence means this can be
// published".
//
// Data only, for the reason `not-a-gate.mjs` states about itself: every other
// script in this folder runs its check at module top level, so making one of
// them the home would mean importing the list runs a gate as a side effect.
//
// The list tracks the HOST, which is why it is worth one file. It named
// Vercel's and Next's files until FD-11 ruled Cloudflare, and
// `substrate-swap.md` names what a forgotten second copy costs: "a dead gate".
// Two consumers read this module: `r9-noindex-nodebug.mjs` uses the list and
// shared basename helper to check every tracked rung config, while
// `t-six-before-link.mjs` uses the list but keeps its own app-scoped basename
// predicate. The list is shared; recognition logic is not yet. A future host
// swap that changes the basename rule must update both consumers.
import path from "node:path";

export const RUNG_CONFIGS = ["wrangler.toml", "wrangler.jsonc", "wrangler.json"];

// R9 recognises a rung config by BASENAME, because the app keeps its config
// beside the app rather than at the repository root. The consumers differ in
// SEARCH SCOPE: `t-six-before-link.mjs` asks whether the *app* is publishable
// and looks under `app/` only, while `r9-noindex-nodebug.mjs` asks whether any
// tracked rung config lacks noindex and looks wherever one is tracked. T-six's
// local predicate currently duplicates the basename rule; keep it aligned if
// the host's config naming changes.
export const isRungConfigPath = (p) => RUNG_CONFIGS.includes(path.basename(p));
