import type { Harness } from "./make.js";

// The two harness entry points (BUILD.md Step 0: "wire an EMPTY harness entry
// point"). The loop itself is Step 5 — handleTurn is console utterance →
// normalize → plan → tool calls under the floor → check-work → narrate, and
// handleTrigger is sale / hold-expiry / decline / returned-form / clock /
// delivery-report — SIX sources (SPEC.md §4; the delivery report joined
// 2026-08-21 and this union lagged at five until 2026-08-22, which is the
// drift deployment/scripts/trigger-union.mjs now refuses).
//
// They throw rather than returning a plausible empty value. A Step-0 entry
// point that silently returns nothing is one a later step can build on top of
// while believing it works; one that throws cannot be mistaken for done.

export type TurnInput = { utterance: string; owner: string };
export type TriggerEvent = { kind: "sale" | "hold-expiry" | "decline" | "returned-form" | "clock" | "delivery-report"; at: number };

export function handleTurn(_harness: Harness, _input: TurnInput): never {
  throw new Error("handleTurn is not implemented — harness/BUILD.md Step 5");
}

export function handleTrigger(_harness: Harness, _event: TriggerEvent): never {
  throw new Error("handleTrigger is not implemented — harness/BUILD.md Step 5");
}

export * from "./seams.js";
export * from "./make.js";
export { makeClock } from "./clock.js";
export { SUMMARIZE_ALWAYS_FAILS } from "./stubs/model.js";
