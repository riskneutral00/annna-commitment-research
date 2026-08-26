// The three seam contracts, as TypeScript interfaces (INTERFACES.md §1–§3).
//
// These are what the stubs implement NOW and the real adapters implement at the
// swap. Nothing in the harness may reach across a seam except through these —
// that is what makes the swap a drop-in rather than an edit
// (engine/SCENARIOS.md Z2).
//
// Step 0 pins the shapes and nothing more. The behaviour behind them arrives in
// Steps 1–5; a fuller type here would be a guess about code nobody has written.
//
// EVERY SEAM CALL IS ASYNCHRONOUS (INTERFACES.md §1, 2026-08-22): the real
// neighbours are a datastore over a network, a multi-second model call, and
// provider-backed delivery — and the swap law (Q3) forbids harness edits at the
// moment the first real adapter would have needed the sync signatures fixed.
// The stubs resolve immediately; the shapes are promises from Step 0.

/** An engine-issued reference to a computed, validated value (INTERFACES.md §1.1).
 *  The harness passes handles around and may NEVER read their internals to
 *  author a literal — that prohibition is the whole point of the opaque type. */
export type Handle = { readonly __handle: unique symbol };

export type CommitResult =
  | { ok: true; commitment: unknown }
  | { ok: false; conflict: true; reason: string; alternatives?: unknown[] };

/** Layer-1 spotlighting on the wire: every free-text string carries the tag
 *  stamped at the door that admitted it (INTERFACES.md §2.1, SPEC.md §8). */
export type SourceTag = "owner" | "guest" | "import" | "document";
export type Tagged = { text: string; source: SourceTag };

export interface EngineSeam {
  calculate(query: unknown): Promise<Handle>;
  commit(input: unknown): Promise<CommitResult>;
  check_consistency(rules: unknown): Promise<{ conflicts: unknown[]; latent: unknown[] }>;
  check_coverage(board: unknown): Promise<{ missing_required: unknown[] }>;
  // typed_value/compare are NOT seam methods (INTERFACES.md §1.4, 2026-08-22):
  // both are pure functions taking every input as an argument, so they live in
  // the shared library `./typed-value.ts` — one real implementation both layers
  // import, which is what makes FD-27's fail-closed path reachable in the suite.
  resolve(goal: unknown, boards: unknown, rules: unknown): Promise<Handle>;
}

export interface ModelSeam {
  normalize(utterance: string, context: unknown): Promise<{ intent: string; fields: Record<string, unknown>; ambiguities: string[] }>;
  narrate(structure: unknown): Promise<string>;
  /** §2.4, the layer-2 quarantine read. Tool-less by construction; never BYO
   *  (FD-3); FAILS CLOSED — it rejects rather than resolving a partial summary,
   *  because a summary that might be raw text is the control degrading into no
   *  control at the moment it failed (L7). */
  summarize(raw_text: string, source_tag: SourceTag): Promise<{ summary: string; labels: string[] }>;
}

/** The immediate outcome union `send` returns on the seam call itself
 *  (INTERFACES.md §3.3, the delivery-outcomes bullet): the app records the raw
 *  result and decides nothing; the harness commits it as an attributed fact. */
export type SendOutcome =
  | { outcome: "sent" | "delivered-failed" | "handed-to-owner" }
  | { unavailable: true }
  | { timeout: true };

export interface AppSeam {
  render(surface: "board" | "commitment-page" | "console", payload: unknown): Promise<void>;
  /** §3.2 — the generative-UI leg: the harness hands a schema, the app returns
   *  the composed view. Pinned by INTERFACES.md §3.2 and app/INTERFACES.md §4's
   *  swap-parity clause; shape only at Step 0. */
  render_generative(schema: unknown): Promise<unknown>;
  /** Return leg per INTERFACES.md §3.3 (2026-08-22): `minted[]` is the digest
   *  return leg — the harness commits the mint set in the same firing, and a
   *  digest reaches the store on no path but this leg and `on_form_return`'s
   *  open-time ride. */
  publish(
    payload: unknown,
    recipients?: unknown,
  ): Promise<{ artifact: unknown; minted: Array<{ digest: string; bound_to: string }> }>;
  /** Renamed from `notify_and_await` (INTERFACES.md §3.3, 2026-08-22): the verb
   *  never awaited — the reply arrives later through `on_form_return`, and the
   *  old name already produced one documented spec error. The immediate outcome
   *  returns on this call itself; `pending` was the retired shape's leftover. */
  send(payload: unknown, recipient?: unknown): Promise<SendOutcome>;
  /** FD-49 (2026-08-22) — the attended calendar pull, reachable only inside a
   *  caller-initiated firing (the no-trigger-path is the loop's structural
   *  assertion, B10, not this signature's). Provider rejection surfaces the
   *  visible disconnected state and is never retried. */
  import_fetch(
    connection_ref: unknown,
  ): Promise<{ items: unknown[]; provider_status: string } | { unavailable: true } | { timeout: true }>;
  /** FD-66 (2026-08-22) — FD-42's ratified mechanism: the owner's display-only
   *  settings write into the app-owned store (app/SPEC.md §7's closed member
   *  set). `internal` class, diff-shaped; an off-set member is `invalid` and
   *  nothing partial applies. The second ruled amendment to the seam's verb
   *  roster, after `import_fetch` (INTERFACES.md §3.3). */
  display_settings(diff: unknown): Promise<{ ok: true } | { ok: false; invalid: true }>;
}

/** A steppable virtual clock — required, not optional (INTERFACES.md §5).
 *  Tests STEP it; nothing sleeps and nothing waits on wall time. Injected
 *  through the same point as the seams, and shared with the engine.
 *
 *  `sleepUntil` is `step`'s promise twin (INTERFACES.md §1, the async law):
 *  the loop's own waiting — hold expiry, ladder timeouts — awaits it, and it
 *  resolves only when a `step` carries the clock to or past the instant. It
 *  never touches wall time, so the ordering laws across awaited calls are
 *  testable exactly as the sync expiries always were. */
export interface Clock {
  now(): number;
  step(ms: number): void;
  sleepUntil(instant: number): Promise<void>;
}
