import type { CommitResult, EngineSeam, Handle } from "../seams.js";

// EngineStub — INTERFACES.md §5: an in-memory store with a capacity check and a
// latch check, plus canned handles keyed by scenario.
//
// Step 0 builds the seam and the determinism, not the engine's behaviour: the
// capacity and latch rules arrive with the scenarios that need them (Steps 1–5).
// What matters now is that handles are OPAQUE — the harness may pass one on and
// may never read it to author a literal (INTERFACES.md §1.1).
//
// Async per the seam's law (INTERFACES.md §1): the stub resolves immediately
// and deterministically — same order, same values, every run (L2/B9).

export class EngineStub implements EngineSeam {
  readonly calls: Array<{ call: string; args: unknown[] }> = [];
  readonly store = new Map<string, unknown>();

  // Per-INSTANCE, not module-level. A shared counter reset in the constructor
  // meant constructing a second stub rewound the first one's sequence, so two
  // different calculate() calls on the same stub could return the SAME handle —
  // handles are opaque unique references and that broke the one property they
  // have. Deterministic and monotonic per instance; never random, or the suite
  // could not replay byte-identical (L2/B9).
  #next = 0;
  #handle(): Handle {
    return { __handle: `h${++this.#next}` } as unknown as Handle;
  }

  async calculate(query: unknown): Promise<Handle> {
    this.calls.push({ call: "calculate", args: [query] });
    return this.#handle();
  }

  async commit(input: unknown): Promise<CommitResult> {
    this.calls.push({ call: "commit", args: [input] });
    return { ok: true, commitment: input };
  }

  async check_consistency(rules: unknown) {
    this.calls.push({ call: "check_consistency", args: [rules] });
    return { conflicts: [], latent: [] };
  }

  async check_coverage(board: unknown) {
    this.calls.push({ call: "check_coverage", args: [board] });
    return { missing_required: [] };
  }

  // typed_value/compare left this stub 2026-08-22 (INTERFACES.md §1.4): they
  // are the shared library `../typed-value.ts` now — the accept-anything echo
  // made FD-27's fail-closed path unreachable, which is exactly what a stub
  // must never do to a MUST path.

  async resolve(goal: unknown, boards: unknown, rules: unknown): Promise<Handle> {
    this.calls.push({ call: "resolve", args: [goal, boards, rules] });
    return this.#handle();
  }
}
