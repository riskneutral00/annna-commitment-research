// The three seam contracts, as TypeScript interfaces (INTERFACES.md §1–§3).
//
// These are what the stubs implement NOW and the real adapters implement at the
// swap. Nothing in the harness may reach across a seam except through these —
// that is what makes the swap a drop-in rather than an edit
// (engine/SCENARIOS.md Z2).
//
// Step 0 pins the shapes and nothing more. The behaviour behind them arrives in
// Steps 1–5; a fuller type here would be a guess about code nobody has written.

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
  calculate(query: unknown): Handle;
  commit(input: unknown): CommitResult;
  check_consistency(rules: unknown): { conflicts: unknown[]; latent: unknown[] };
  check_coverage(board: unknown): { missing_required: unknown[] };
  typed_value(raw: unknown, type_spec: unknown): unknown;
  compare(a: unknown, op: string, b: unknown): boolean;
  resolve(goal: unknown, boards: unknown, rules: unknown): Handle;
}

export interface ModelSeam {
  normalize(utterance: string, context: unknown): { intent: string; fields: Record<string, unknown>; ambiguities: string[] };
  narrate(structure: unknown): string;
  /** §2.4, the layer-2 quarantine read. Tool-less by construction; never BYO
   *  (FD-3); FAILS CLOSED — it throws rather than returning a partial summary,
   *  because a summary that might be raw text is the control degrading into no
   *  control at the moment it failed (L7). */
  summarize(raw_text: string, source_tag: SourceTag): { summary: string; labels: string[] };
}

export interface AppSeam {
  render(payload: unknown): void;
  publish(payload: unknown): void;
  notify_and_await(payload: unknown): void;
}

/** A steppable virtual clock — required, not optional (INTERFACES.md §5).
 *  Tests STEP it; nothing sleeps and nothing waits on wall time. Injected
 *  through the same point as the seams, and shared with the engine. */
export interface Clock {
  now(): number;
  step(ms: number): void;
}
