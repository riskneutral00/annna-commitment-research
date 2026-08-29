// typed_value / compare — the shared LIBRARY (INTERFACES.md §1.4, 2026-08-22).
//
// Both are pure functions: every input arrives as an argument (the resolution
// context rides inside the type_spec), nothing reads a store — so they are a
// library both layers import, not seam round-trips. The former engine-stub
// versions accepted anything and echoed it back, which made FD-27's fail-closed
// path unreachable in the suite; this implementation is real and minimal, and
// FAILING CLOSED IS ITS CONTRACT: anything it cannot resolve deterministically
// is an `invalid` error, never a guess. The value vocabulary's normative home
// is engine/SPEC.md §2; Step 2 grows this file toward it (FD-57's
// propose-then-verify rendering tables land there, not here).

export type TypedValue =
  | { kind: "instant"; epoch_ms: number }
  | { kind: "number"; value: number; unit?: string };

/** `INTERFACES.md §7.1`'s closed `invalid` reasons, as far as this library mints
 *  them. Deliberately a two-of-three subset: §7.1 enumerates a third `invalid`
 *  reason, `schema-mismatch`, which is return-leg and rejected-render
 *  validation — the app's domain, not typed_value's. Do not "complete" the
 *  union here. */
export type TvReason = "type-mismatch" | "malformed";

/** `detail` carries the human prose; it is already in the spec envelope —
 *  INTERFACES.md §1 prints `{kind, reason, detail?, next?}`. */
export type TvError = { error: true; kind: "invalid"; reason: TvReason; detail: string };

export const isTvError = (v: unknown): v is TvError =>
  typeof v === "object" && v !== null && (v as TvError).error === true;

const invalid = (reason: TvReason, detail: string): TvError => ({ error: true, kind: "invalid", reason, detail });

// Strict ISO-8601 with an EXPLICIT offset (Z or ±hh:mm). An ambient-zone
// timestamp is not deterministic input and fails closed; a natural-language
// phrase ("บ่ายสามวันพฤหัสนี้") fails closed here by construction — resolving
// it is the propose-then-verify path (FD-57), never a parse.
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

export function typed_value(raw: unknown, type_spec: unknown): TypedValue | TvError {
  const spec = (typeof type_spec === "object" && type_spec !== null ? type_spec : {}) as {
    type?: string;
    unit?: string;
  };
  switch (spec.type) {
    case "instant": {
      if (typeof raw !== "string" || !ISO.test(raw))
        return invalid("type-mismatch", "instant requires strict ISO-8601 with an explicit offset");
      const epoch_ms = Date.parse(raw);
      if (Number.isNaN(epoch_ms)) return invalid("malformed", "instant does not parse");
      return { kind: "instant", epoch_ms };
    }
    case "number": {
      const value = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
      if (!Number.isFinite(value)) return invalid("type-mismatch", "number is not finite");
      return spec.unit === undefined ? { kind: "number", value } : { kind: "number", value, unit: spec.unit };
    }
    default:
      return invalid("malformed", `unknown type_spec.type: ${String(spec.type)}`);
  }
}

const OPS: Record<string, (a: number, b: number) => boolean> = {
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  "=": (a, b) => a === b,
  ">=": (a, b) => a >= b,
  ">": (a, b) => a > b,
};

export function compare(a: TypedValue, op: string, b: TypedValue): boolean | TvError {
  const f = OPS[op];
  if (!f) return invalid("malformed", `unknown operator: ${op}`);
  if (a.kind !== b.kind) return invalid("type-mismatch", `kind mismatch: ${a.kind} vs ${b.kind}`);
  if (a.kind === "number" && b.kind === "number" && a.unit !== b.unit)
    return invalid("type-mismatch", `unit mismatch: ${String(a.unit)} vs ${String(b.unit)}`);
  const av = a.kind === "instant" ? a.epoch_ms : a.value;
  const bv = b.kind === "instant" ? b.epoch_ms : (b as { value: number }).value;
  return f(av, bv);
}
