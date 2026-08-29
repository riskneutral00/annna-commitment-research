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
// Two consumers now read it — `r9-noindex-nodebug.mjs` (a rung config must
// carry noindex) and `t-six-before-link.mjs` (a rung config is what makes the
// app publishable, which is when the T1–T6 marker becomes required) — and a
// host swap moves it once, here, or it moves nowhere.
export const RUNG_CONFIGS = ["wrangler.toml", "wrangler.jsonc", "wrangler.json"];
