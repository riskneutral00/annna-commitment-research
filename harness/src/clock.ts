import type { Clock } from "./seams.js";

// The steppable virtual clock (INTERFACES.md §5). Hold/offer expiry (C8), park
// behaviour, and the escalation ladder's step_timeout/total_timeout (SPEC.md
// §3.9, D12–D17) all advance on this. Nothing here reads Date.now(): a suite
// that touches wall time cannot replay byte-identical (L2, and B9 above it).
//
// sleepUntil is step's promise twin (INTERFACES.md §1, the async law): a
// sleeper resolves when a step carries the clock to or past its instant, in
// deterministic order (instant first, registration order second) — never on
// wall time, never on a timer.
export function makeClock(startMs = 0): Clock {
  let t = startMs;
  let seq = 0;
  const sleepers: Array<{ at: number; seq: number; wake: () => void }> = [];

  function wakeDue() {
    const due = sleepers
      .filter((s) => s.at <= t)
      .sort((a, b) => a.at - b.at || a.seq - b.seq);
    for (const s of due) {
      sleepers.splice(sleepers.indexOf(s), 1);
      s.wake();
    }
  }

  return {
    now: () => t,
    step(ms: number) {
      if (ms < 0) throw new Error("the clock does not run backwards");
      t += ms;
      wakeDue();
    },
    sleepUntil(instant: number) {
      if (instant <= t) return Promise.resolve();
      return new Promise<void>((wake) => {
        sleepers.push({ at: instant, seq: ++seq, wake });
      });
    },
  };
}
