import type { Clock, CommitResult, CommitmentRef, CoverageQuery, CoverageResult, EngineSeam, Envelope, Handle, WriteId } from "../seams.js";

// EngineStub — INTERFACES.md §5: an in-memory store with real WRITES, an
// idempotency ledger keyed on the caller's write id, and canned handles.
//
// Step 0 builds the seam and the determinism, not the engine's behaviour: the
// capacity and latch rules arrive with the scenarios that need them (Steps 1–5).
// What matters now: handles are OPAQUE except their display facet
// (INTERFACES.md §1.1), commits actually LAND in the store (a stub whose store
// stays empty makes every read-back assertion vacuously green — the
// anti-vacuity the Step-0 suite asserts over eight rows), and re-committing a
// write id returns the ORIGINAL result (§1.2's idempotency law).
//
// Async per the seam's law (INTERFACES.md §1): the stub resolves immediately
// and deterministically — same order, same values, every run (L2/B9).

export class EngineStub implements EngineSeam {
  readonly calls: Array<{ call: string; args: unknown[] }> = [];
  readonly store = new Map<CommitmentRef, unknown>();
  /** Scripted stored grants for the covering-grant lookup (§1.3, FD-97):
   *  a pure lookup over stored grants only — the decision stays the floor's. */
  readonly grants = new Map<string, CommitmentRef>();

  // Injected so the stub and the harness can never disagree about the time —
  // the same point that wires the seams wires the clock (make.ts).
  constructor(readonly clock?: Clock) {}

  // Per-INSTANCE, not module-level. A shared counter reset in the constructor
  // meant constructing a second stub rewound the first one's sequence, so two
  // different calculate() calls on the same stub could return the SAME handle —
  // handles are opaque unique references and that broke the one property they
  // have. Deterministic and monotonic per instance; never random, or the suite
  // could not replay byte-identical (L2/B9).
  #next = 0;
  #handle(): Handle {
    const n = ++this.#next;
    return { __handle: `h${n}`, display: `display of h${n}` } as unknown as Handle;
  }

  /** The §1.2 idempotency ledger: write id → the original result, returned
   *  verbatim on a re-commit. */
  readonly #ledger = new Map<WriteId, CommitResult>();

  async calculate(query: unknown): Promise<Handle | Envelope<"unavailable" | "timeout">> {
    this.calls.push({ call: "calculate", args: [query] });
    return this.#handle();
  }

  async commit(input: unknown, write_id: WriteId): Promise<CommitResult> {
    this.calls.push({ call: "commit", args: [input, write_id] });
    const prior = this.#ledger.get(write_id);
    if (prior) return prior; // idempotent per id: the ORIGINAL result, not a re-apply
    const applied_ref: CommitmentRef = `ref${this.#ledger.size + 1}`;
    this.store.set(applied_ref, input); // a real write — the anti-vacuity the suite reads back
    const result: CommitResult = { ok: true, applied_ref };
    this.#ledger.set(write_id, result);
    return result;
  }

  async check_consistency(rules: unknown) {
    this.calls.push({ call: "check_consistency", args: [rules] });
    return { conflicts: [], latent: [] };
  }

  async check_coverage(query: CoverageQuery): Promise<CoverageResult | Envelope<"invalid" | "unavailable" | "timeout">> {
    this.calls.push({ call: "check_coverage", args: [query] });
    if (query.kind === "board-structural") return { kind: "board-structural", missing_required: [] };
    if (query.kind === "covering-grant") {
      // FD-97's pure lookup: stored grants only, `covering: grant_ref | null`.
      const key = `${query.act.action_class}`;
      return { kind: "covering-grant", covering: this.grants.get(key) ?? null };
    }
    return { kind: "invalid", reason: "malformed", detail: "unknown coverage query kind" };
  }

  // typed_value/compare left this stub 2026-08-22 (INTERFACES.md §1.4): they
  // are the shared library `../typed-value.ts` now — the accept-anything echo
  // made FD-27's fail-closed path unreachable, which is exactly what a stub
  // must never do to a MUST path.

  async resolve(goal: unknown, boards: unknown, rules: unknown): Promise<Handle | Envelope<"decline" | "unavailable" | "timeout">> {
    this.calls.push({ call: "resolve", args: [goal, boards, rules] });
    return this.#handle();
  }
}
