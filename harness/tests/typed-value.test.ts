import { describe, expect, it } from "vitest";
import { compare, isTvError, typed_value } from "../src/typed-value.js";

// The library that replaced the accept-anything engine-stub echo
// (INTERFACES.md §1.4, 2026-08-22). The point of these tests is that the
// FAIL-CLOSED path is finally reachable: FD-27's "a phrase that cannot be
// resolved is a typed_value error" was untestable while the stub always
// succeeded.

describe("typed_value — deterministic resolution, fail-closed", () => {
  it("resolves a strict ISO instant with an explicit offset", () => {
    const v = typed_value("2026-09-03T15:00:00+07:00", { type: "instant" });
    expect(isTvError(v)).toBe(false);
    if (!isTvError(v) && v.kind === "instant") expect(v.epoch_ms).toBe(Date.parse("2026-09-03T08:00:00Z"));
  });

  it("two offsets naming one instant resolve equal", () => {
    const a = typed_value("2026-09-03T15:00+07:00", { type: "instant" });
    const b = typed_value("2026-09-03T08:00Z", { type: "instant" });
    expect(a).toEqual(b);
  });

  it("FAILS CLOSED on a natural-language phrase — FD-27's reachable error path", () => {
    const v = typed_value("บ่ายสามถึงบ่ายสี่วันพฤหัสนี้", { type: "instant" });
    expect(isTvError(v)).toBe(true);
  });

  it("fails closed on an offset-less timestamp (ambient zone is not deterministic input)", () => {
    expect(isTvError(typed_value("2026-09-03T15:00:00", { type: "instant" }))).toBe(true);
  });

  it("resolves a unit-bearing number and fails closed on a non-number", () => {
    expect(typed_value("30", { type: "number", unit: "min" })).toEqual({ kind: "number", value: 30, unit: "min" });
    expect(isTvError(typed_value("half an hour", { type: "number", unit: "min" }))).toBe(true);
  });

  it("fails closed on an unknown type_spec", () => {
    expect(isTvError(typed_value("x", { type: "vibes" }))).toBe(true);
  });
});

describe("compare — same-kind, same-unit, or an error", () => {
  const t = (s: string) => typed_value(s, { type: "instant" });

  it("orders instants", () => {
    expect(compare(t("2026-09-03T08:00Z") as never, "<", t("2026-09-03T09:00Z") as never)).toBe(true);
  });

  it("fails closed across kinds and across units", () => {
    const n = typed_value(5, { type: "number", unit: "h" });
    expect(isTvError(compare(t("2026-09-03T08:00Z") as never, "<", n as never))).toBe(true);
    const m = typed_value(5, { type: "number", unit: "min" });
    expect(isTvError(compare(n as never, "<", m as never))).toBe(true);
  });

  it("fails closed on an unknown operator", () => {
    expect(isTvError(compare(t("2026-09-03T08:00Z") as never, "~", t("2026-09-03T08:00Z") as never))).toBe(true);
  });
});
