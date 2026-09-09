import type { Clock, CommitResult, CommitmentRef, CoverageQuery, CoverageResult, EngineSeam, Envelope, Handle, WriteId } from "../seams.js";

type CoveringGrantQuery = Extract<CoverageQuery, { kind: "covering-grant" }>;
type GrantFixtureResponse = { at: number; covering: CommitmentRef | null };
type GrantCoverageScript = {
  before: GrantFixtureResponse;
  at: GrantFixtureResponse;
  after: GrantFixtureResponse;
  after_revocation: GrantFixtureResponse;
};

function grantReferenceKey(parent: object, name: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(parent, name)) return { state: "missing" };
  const value = (parent as Record<string, unknown>)[name];
  if (value === undefined) return { state: "undefined" };
  if (value === null) return { state: "null" };
  return { state: "value", value };
}

function grantQueryKey(query: CoveringGrantQuery): string {
  return JSON.stringify([
    query.act.action_class,
    grantReferenceKey(query.act, "scope_ref"),
    grantReferenceKey(query, "principal_ref"),
  ]);
}

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
  /** Full-request covering-grant fixtures (§1.3, FD-97). The fake consumes
   *  explicit lifecycle responses; it does not implement grant matching. */
  readonly #grantScripts = new Map<string, GrantCoverageScript>();

  /** Install one complete-request fixture without adding a seam verb. */
  readonly scriptCoveringGrant = (query: CoveringGrantQuery, script: GrantCoverageScript): void => {
    const responses = [script.before, script.at, script.after, script.after_revocation];
    const times = responses.map((response) => response.at);
    if (new Set(times).size !== times.length || times.some((at, index) => index > 0 && at <= times[index - 1]!)) {
      throw new Error("grant fixture clock states must be ordered and distinct");
    }
    this.#grantScripts.set(grantQueryKey(query), script);
  };

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
      const script = this.#grantScripts.get(grantQueryKey(query));
      if (!script) throw new Error("unscripted covering-grant request");
      if (!this.clock) throw new Error("covering-grant request requires an injected clock");
      const response = [script.before, script.at, script.after, script.after_revocation].find(({ at }) => at === this.clock!.now());
      if (!response) throw new Error("unprepared clock state for covering-grant fixture");
      return { kind: "covering-grant", covering: response.covering };
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
