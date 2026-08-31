// The three seam contracts, as TypeScript interfaces (INTERFACES.md §1–§3).
//
// These are what the stubs implement NOW and the real adapters implement at the
// swap. Nothing in the harness may reach across a seam except through these —
// that is what makes the swap a drop-in rather than an edit
// (engine/SCENARIOS.md Z2).
//
// EVERY SEAM CALL IS ASYNCHRONOUS (INTERFACES.md §1, 2026-08-22): the real
// neighbours are a datastore over a network, a multi-second model call, and
// provider-backed delivery — and the swap law (Q3) forbids harness edits at the
// moment the first real adapter would have needed the sync signatures fixed.
// The stubs resolve immediately; the shapes are promises from Step 0.

/** The closed failure envelope, seam-wide (INTERFACES.md §1 and §7.1): every
 *  failure return on every seam is one of six kinds, carried as
 *  `{kind, reason, detail?, next?}` — `alternatives` rides `conflict` as
 *  `next`. Reasons come from §7.1's table and nowhere else; widening the
 *  vocabulary in code is exactly what compat-reasons.mjs refuses (RQ-13). */
export type FailureKind = "conflict" | "decline" | "invalid" | "refused" | "unavailable" | "timeout";
export type Envelope<K extends FailureKind = FailureKind> = {
  kind: K;
  reason: string;
  detail?: unknown;
  next?: unknown;
};
const KINDS: ReadonlySet<string> = new Set(["conflict", "decline", "invalid", "refused", "unavailable", "timeout"]);
export const isEnvelope = (v: unknown): v is Envelope =>
  typeof v === "object" && v !== null && KINDS.has((v as Envelope).kind) && typeof (v as Envelope).reason === "string";

/** An engine-issued reference to a computed, validated value (INTERFACES.md §1.1).
 *  The harness passes handles around and may NEVER read their internals to
 *  author a literal — with ONE licensed exception: `display`, the
 *  engine-rendered, display-only projection (engine/SPEC.md §4's display
 *  facet, e.g. "Tom 2:30 → 10:30"), which the harness narrates from and never
 *  re-enters as a write (D7's oracle asserts exactly this). */
export type Handle = { readonly __handle: unique symbol; readonly display: string };

/** An engine-issued object reference. A plain string on the wire; the harness
 *  stores and passes it, never parses it (m-40: `bound_to` is nullable —
 *  an entry-class digest binds to no commitment). */
export type CommitmentRef = string;

/** The caller-supplied write id — commit's second parameter (INTERFACES.md
 *  §1.2): commit is idempotent per write_id, and re-committing the same id
 *  returns the ORIGINAL result rather than applying twice. */
export type WriteId = string;

/** §1.2's neutral applied-result: `applied_ref` names what the write applied —
 *  a commitment ref, an applied diff's object ref, a proposal's ref, or a
 *  bookkeeping object's ref. Failures are the envelope, per the §7 per-verb
 *  kind map: commit may return `conflict`, `refused`, `invalid` (+ infra). */
export type CommitOk = { ok: true; applied_ref: CommitmentRef };
export type CommitResult = CommitOk | ({ ok: false } & Envelope<"conflict" | "refused" | "invalid" | "unavailable" | "timeout">);

/** §1.3's discriminated request/result union, re-typed by FD-97: the
 *  board-structural kind keeps the old structural promise; the covering-grant
 *  kind is a pure lookup over STORED grants only — the decision to act stays
 *  the harness floor's. */
export type CoverageQuery =
  | { kind: "board-structural"; board: unknown }
  | { kind: "covering-grant"; act: { action_class: string; scope_ref: unknown }; principal_ref: unknown };
export type CoverageResult =
  | { kind: "board-structural"; missing_required: unknown[] }
  | { kind: "covering-grant"; covering: CommitmentRef | null };

/** Layer-1 spotlighting on the wire: every free-text string carries the tag
 *  stamped at the door that admitted it (INTERFACES.md §2.1, SPEC.md §8). */
export type SourceTag = "owner" | "guest" | "import" | "document";
export type Tagged = { text: string; source: SourceTag };

/** The closed harness-written registration kinds (engine/SPEC.md §1.15's
 *  optional member — an engine-internal registration omits it; a
 *  harness-written one MUST carry it). */
export type RegistrationKind = "reminder" | "offer-hold" | "ask-age-out";

/** The six trigger sources (SPEC.md §4), with the kind-routed bridge's two
 *  discriminator-carrying arms (engine/INTERFACES.md §2.2, 2026-08-31):
 *  `offer-hold` registrations surface as `hold-expiry`; `reminder` and
 *  `ask-age-out` registrations — and every engine-internal registration,
 *  which carries no kind — surface as the ordinary `clock` source. */
export type Event =
  | { kind: "sale"; at: number; ref: unknown }
  | { kind: "hold-expiry"; at: number; hold_ref: CommitmentRef; registration_ref: CommitmentRef; registration_kind: RegistrationKind }
  | { kind: "decline"; at: number; ref: unknown }
  | { kind: "returned-form"; at: number; reply: unknown }
  | { kind: "clock"; at: number; registration_ref: CommitmentRef; registration_kind?: RegistrationKind }
  | { kind: "delivery-report"; at: number; event: unknown };

export interface EngineSeam {
  calculate(query: unknown): Promise<Handle | Envelope<"unavailable" | "timeout">>;
  /** The write id is commit's second parameter — the printed seam position
   *  (INTERFACES.md §1.2). */
  commit(input: unknown, write_id: WriteId): Promise<CommitResult>;
  check_consistency(rules: unknown): Promise<{ conflicts: unknown[]; latent: unknown[] } | Envelope<"unavailable" | "timeout">>;
  check_coverage(query: CoverageQuery): Promise<CoverageResult | Envelope<"invalid" | "unavailable" | "timeout">>;
  // typed_value/compare are NOT seam methods (INTERFACES.md §1.4, 2026-08-22):
  // both are pure functions taking every input as an argument, so they live in
  // the shared library `./typed-value.ts` — one real implementation both layers
  // import, which is what makes FD-27's fail-closed path reachable in the suite.
  resolve(goal: unknown, boards: unknown, rules: unknown): Promise<Handle | Envelope<"decline" | "unavailable" | "timeout">>;
}

/** §2.1's ambiguity member: never bare strings — each carries its question and
 *  the readings that differ in stored effect or floor status. */
export type Ambiguity = { question: string; readings: unknown[] };
export type NormalizeReturn =
  | { intent: string; fields: Record<string, unknown>; ambiguities: Ambiguity[] }
  | { sequence: Array<{ intent: string; fields: Record<string, unknown> }>; ambiguities: Ambiguity[] };

export interface ModelSeam {
  normalize(utterance: string, context: unknown): Promise<NormalizeReturn | Envelope<"invalid" | "refused" | "unavailable" | "timeout">>;
  narrate(structure: unknown): Promise<string | Envelope<"invalid" | "refused" | "unavailable" | "timeout">>;
  /** §2.4, the layer-2 quarantine read. Tool-less by construction; never BYO
   *  (FD-3); FAILS CLOSED — it rejects rather than resolving a partial summary,
   *  because a summary that might be raw text is the control degrading into no
   *  control at the moment it failed (L7). */
  summarize(raw_text: string, source_tag: SourceTag): Promise<{ summary: string; labels: string[] } | Envelope<"invalid" | "refused" | "unavailable" | "timeout">>;
}

/** The immediate outcome union `send` returns on the seam call itself
 *  (INTERFACES.md §3.3, the delivery-outcomes bullet): the app records the raw
 *  result and decides nothing; the harness commits it as an attributed fact.
 *  The infrastructure members ride the seam-wide envelope. */
export type SendOutcome =
  | { outcome: "sent" | "delivered-failed" | "handed-to-owner" }
  | Envelope<"unavailable" | "timeout">;

export interface AppSeam {
  render(surface: "board" | "commitment-page" | "console", payload: unknown): Promise<void | Envelope<"invalid">>;
  /** §3.2 — the generative-UI leg: the harness hands a schema, the app returns
   *  the composed view. Pinned by INTERFACES.md §3.2 and app/INTERFACES.md §4's
   *  swap-parity clause; shape only at Step 0. */
  render_generative(schema: unknown): Promise<unknown | Envelope<"invalid">>;
  /** Return leg per INTERFACES.md §3.3 (2026-08-22): `minted[]` is the digest
   *  return leg — the harness commits the mint set in the same firing.
   *  `bound_to` is `CommitmentRef | null` (engine/SPEC.md §1.7, m-40): an
   *  entry-class digest binds to no commitment and carries `null`, never a
   *  stringified placeholder. */
  publish(
    payload: unknown,
    recipients?: unknown,
  ): Promise<{ artifact: unknown; minted: Array<{ digest: string; bound_to: CommitmentRef | null }> } | Envelope<"refused">>;
  /** Renamed from `notify_and_await` (INTERFACES.md §3.3, 2026-08-22). The
   *  recipient is REQUIRED — §3.3's printed signature `send(form_payload,
   *  recipient)`: an outward act with nobody named is not an act the floor can
   *  attribute. */
  send(payload: unknown, recipient: unknown): Promise<SendOutcome>;
  /** FD-49 (2026-08-22) — the attended calendar pull, reachable only inside a
   *  caller-initiated firing. Provider rejection surfaces the visible
   *  disconnected state via the envelope (`unavailable`, reason `provider`)
   *  and is never retried. */
  import_fetch(
    connection_ref: unknown,
  ): Promise<{ items: unknown[]; provider_status: string } | Envelope<"unavailable" | "timeout">>;
  /** FD-66 (2026-08-22) — FD-42's ratified mechanism: the owner's display-only
   *  settings write into the app-owned store (app/SPEC.md §7's closed member
   *  set). An off-set member is the envelope's `invalid` and nothing partial
   *  applies. */
  display_settings(diff: unknown): Promise<{ ok: true } | ({ ok: false } & Envelope<"invalid">)>;
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
