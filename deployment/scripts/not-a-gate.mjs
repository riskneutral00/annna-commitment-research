// NOT-A-GATE — the one definition of which files in this folder are not gates.
//
// Data only. Every consumer imports it; nobody redeclares it. It was declared
// twice before this file existed — once in `claim-check.mjs`, once in
// `roster-check.mjs` — feeding two different counts that agreed by luck, with
// neither citing the other. Two copies of a set that must agree is one copy
// too many, and the day they disagree both gates stay green while one of them
// lies about the number.
//
// Data-only is the point, not a style preference: every other script in this
// folder executes its check at module top level, so making one of them the
// home would mean that importing the list runs a gate as a side effect. This
// file has no side effects, which is what lets "exactly one definition" be a
// statement about a file that contains nothing else.
//
// Each entry carries a REASON, because "it is not a gate" is exactly the
// sentence someone reaches for to silence a real one. An entry without a
// reason a reader can check is a hole with a lid on it.
//
// `gate-wiring.mjs` asserts this is the only definition.
export const NOT_A_GATE = {
  "transcript-reporter.mjs": "the vitest reporter B9 reads; it emits, it never refuses",
  "not-a-gate.mjs": "this file — the shared declaration itself, data rather than a check",
};
