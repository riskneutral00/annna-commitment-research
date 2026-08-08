import type { Clock } from "./seams.js";

// The steppable virtual clock (INTERFACES.md §5). Hold/offer expiry (C8), park
// behaviour, and the escalation ladder's step_timeout/total_timeout (SPEC.md
// §3.9, D12–D17) all advance on this. Nothing here reads Date.now(): a suite
// that touches wall time cannot replay byte-identical (L2, and B9 above it).
export function makeClock(startMs = 0): Clock {
  let t = startMs;
  return {
    now: () => t,
    step(ms: number) {
      if (ms < 0) throw new Error("the clock does not run backwards");
      t += ms;
    },
  };
}
