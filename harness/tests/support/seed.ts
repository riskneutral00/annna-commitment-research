// The pinned property-run seed (TDD.md §Harness — D20's floor property runs on
// `fast-check` when Step 5 lands it; B9's twice-run byte-compare demands the
// generated cases be the SAME cases every run, so the seed is a constant here,
// never wall-clock derived, and the generator below is a plain deterministic
// LCG — no dependency lands before the step that needs the real library).
export const FC_SEED = 20260831;
export const FC_RUNS = 100;

/** Deterministic pseudo-random doubles in [-1e6, 1e6], seeded. */
export function* seededDoubles(seed: number, runs: number): Generator<number> {
  let x = seed >>> 0;
  for (let i = 0; i < runs; i++) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    yield ((x / 0xffffffff) * 2 - 1) * 1e6;
  }
}
