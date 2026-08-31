import { describe, expect, it } from "vitest";
import { wire, isEnvelope, ROUTING_TABLES, ROUTING_TABLE_AUTHOR } from "../src/index.js";
import type { Event } from "../src/index.js";
import { EngineStub } from "../src/stubs/engine.js";
import { AppStub } from "../src/stubs/app.js";
import { ModelStub } from "../src/stubs/model.js";
import { compare, typed_value, isTvError } from "../src/typed-value.js";
import { narrationTracesToFacets } from "./support/d7-oracle.js";
import { FC_SEED, FC_RUNS, seededDoubles } from "./support/seed.js";

// The Step-0/1 contract suite grown by the remediation (2026-08-31): the
// envelope, the write id, the coverage union, the Event arms, the store's
// anti-vacuity, and the entry-point enumeration Q2-060 requires to be complete
// against the seam — so a newly landed verb FAILS here until its absence
// assertions are re-asserted over it.

describe("the closed failure envelope", () => {
  it("recognizes exactly the six kinds", () => {
    for (const kind of ["conflict", "decline", "invalid", "refused", "unavailable", "timeout"]) {
      expect(isEnvelope({ kind, reason: "capacity" })).toBe(true);
    }
    // the unknown-kind fixture rides an ENUMERATED reason: the vocabulary gate
    // reads every reason literal in harness code, and a made-up one here would
    // be the widening-by-code it exists to refuse (RQ-13).
    expect(isEnvelope({ kind: "pending", reason: "capacity" })).toBe(false);
    expect(isEnvelope({ kind: "conflict" })).toBe(false); // no reason, no envelope
  });
});

describe("commit — the write id and the store (§1.2)", () => {
  it("writes eight rows that actually land, readable back — never vacuous", async () => {
    const engine = new EngineStub();
    const refs: string[] = [];
    for (let i = 1; i <= 8; i++) {
      const r = await engine.commit({ row: i }, `w${i}`);
      expect(r.ok).toBe(true);
      if (r.ok) refs.push(r.applied_ref);
    }
    expect(engine.store.size).toBe(8);
    refs.forEach((ref, i) => expect(engine.store.get(ref)).toEqual({ row: i + 1 }));
  });

  it("is idempotent per write id: the ORIGINAL result, no second apply", async () => {
    const engine = new EngineStub();
    const first = await engine.commit({ a: 1 }, "w1");
    const again = await engine.commit({ a: 1 }, "w1");
    expect(again).toBe(first);
    expect(engine.store.size).toBe(1);
  });
});

describe("check_coverage — FD-97's request/result union (§1.3)", () => {
  it("answers the covering-grant kind from stored grants only, null when none", async () => {
    const engine = new EngineStub();
    const miss = await engine.check_coverage({ kind: "covering-grant", act: { action_class: "send", scope_ref: "b1" }, principal_ref: "p1" });
    expect(miss).toEqual({ kind: "covering-grant", covering: null });
    engine.grants.set("send", "grant-1");
    const hit = await engine.check_coverage({ kind: "covering-grant", act: { action_class: "send", scope_ref: "b1" }, principal_ref: "p1" });
    expect(hit).toEqual({ kind: "covering-grant", covering: "grant-1" });
  });

  it("keeps the board-structural promise", async () => {
    const engine = new EngineStub();
    await expect(engine.check_coverage({ kind: "board-structural", board: {} })).resolves.toEqual({ kind: "board-structural", missing_required: [] });
  });
});

describe("the Event union — six sources, kind-routed discriminators (SPEC §4)", () => {
  it("carries the registration kind on hold-expiry, optionally on clock", () => {
    const holdExpiry: Event = { kind: "hold-expiry", at: 1, hold_ref: "h1", registration_ref: "r1", registration_kind: "offer-hold" };
    const reminder: Event = { kind: "clock", at: 2, registration_ref: "r2", registration_kind: "reminder" };
    const internal: Event = { kind: "clock", at: 3, registration_ref: "r3" }; // engine-internal: no kind, constructable
    expect([holdExpiry.kind, reminder.kind, internal.kind]).toEqual(["hold-expiry", "clock", "clock"]);
    expect("registration_kind" in internal).toBe(false);
  });

  it("constructs all six arms with their discriminator-specific required fields (LWR-01)", () => {
    // `satisfies` makes each arm's field roster a compile-time assertion: a
    // dropped required field or an invented one is a red build, not a green run.
    const sale = { kind: "sale", at: 1, offering_ref: "off-1", buyer_party_ref: "buyer-1", terms_ref: "terms-1" } satisfies Event;
    const decline = {
      kind: "decline", at: 2, offer_ref: "offer-1", party_ref: "party-1",
      structured_reason: { kind: "decline", reason: "no-feasible-placement" },
    } satisfies Event;
    const returned = { kind: "returned-form", at: 3, token: "tok-1", reply: { signed: true } } satisfies Event;
    const report = { kind: "delivery-report", at: 4, party_ref: "party-2", outcome: "complaint" } satisfies Event;
    expect([sale.offering_ref, sale.buyer_party_ref, sale.terms_ref]).toEqual(["off-1", "buyer-1", "terms-1"]);
    expect([decline.offer_ref, decline.party_ref, decline.structured_reason.kind]).toEqual(["offer-1", "party-1", "decline"]);
    expect([returned.token, report.party_ref, report.outcome]).toEqual(["tok-1", "party-2", "complaint"]);
  });
});

describe("publish — the nullable bound_to (m-40)", () => {
  it("binds a ref recipient and nulls an entry-class digest", async () => {
    const app = new AppStub();
    const out = await app.publish({ p: 1 }, ["commitment-9", ""]);
    if (isEnvelope(out)) throw new Error("unexpected envelope");
    expect(out.minted.map((m) => m.bound_to)).toEqual(["commitment-9", null]);
  });
});

describe("ModelStub fails closed on every unscripted call", () => {
  it("normalize refuses to invent an intent", async () => {
    await expect(new ModelStub({}).normalize("unscripted", {})).rejects.toThrow(/fail closed/);
  });
});

describe("the D7 spy oracle — narration traces to the display facet", () => {
  it("passes a narration whose values all come from facets, and names the stray otherwise", () => {
    const facets = ["Tom 2:30 → 10:30"];
    expect(narrationTracesToFacets("moved Tom to 2:30", facets)).toEqual({ ok: true });
    const bad = narrationTracesToFacets("moved Tom to 4:45", facets);
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.stray).toBe("4:45");
  });

  it("reads the facet from the handle, never the internals", async () => {
    const h = wire();
    const handle = await h.engine.calculate({ q: 1 });
    if (isEnvelope(handle)) throw new Error("unexpected envelope");
    expect(typeof handle.display).toBe("string");
    expect(narrationTracesToFacets(handle.display, [handle.display])).toEqual({ ok: true });
  });
});

describe("the routing tables are platform-authored data (FD-95)", () => {
  it("pins the authorship constant and refuses runtime mutation", () => {
    expect(ROUTING_TABLE_AUTHOR).toBe("platform");
    expect(Object.isFrozen(ROUTING_TABLES)).toBe(true);
    expect(() => {
      (ROUTING_TABLES as Record<string, unknown>).injected = [];
    }).toThrow();
  });
});

describe("Q2-060 — the entry-point enumeration is complete against the seam", () => {
  // The structural-absence assertions enumerate entry points; this test pins
  // the enumerated set to the seam's ACTUAL surface, so a newly landed verb
  // fails here and forces every absence assertion to re-assert over it.
  const methodsOf = (proto: object) =>
    Object.getOwnPropertyNames(proto)
      .filter((n) => n !== "constructor" && !n.startsWith("#"))
      .filter((n) => typeof (proto as Record<string, unknown>)[n] === "function")
      .sort();

  it("engine seam", () => {
    expect(methodsOf(EngineStub.prototype)).toEqual(["calculate", "check_consistency", "check_coverage", "commit", "resolve"]);
  });
  it("model seam", () => {
    expect(methodsOf(ModelStub.prototype)).toEqual(["narrate", "normalize", "summarize"]);
  });
  it("app seam (spy helpers included by name, so a new verb cannot hide among them)", () => {
    expect(methodsOf(AppStub.prototype)).toEqual([
      "countOf",
      "display_settings",
      "import_fetch",
      "publish",
      "render",
      "render_generative",
      "send",
      "simulateDeliveryReport",
      "simulateFormReturn",
    ]);
  });
  it("no seam declares a destruction or value-transfer class (D9/N2, walked structurally)", () => {
    const all = [EngineStub.prototype, ModelStub.prototype, AppStub.prototype].flatMap((p) => methodsOf(p));
    for (const name of all) expect(name).not.toMatch(/delete|destroy|transfer|pay/);
  });
});

describe("typed_value under the pinned property seed (TDD §Harness; B9 replay)", () => {
  // fast-check is D20's library and lands with Step 5; the seed and the replay
  // discipline are pinned NOW, over a plain deterministic generator, so the
  // property lane exists before the dependency does.
  it("compare is consistent with number order across the seeded run", () => {
    const values = [...seededDoubles(FC_SEED, FC_RUNS * 2)];
    for (let i = 0; i + 1 < values.length; i += 2) {
      const a = values[i]!;
      const b = values[i + 1]!;
      const ta = typed_value(a, { type: "number" });
      const tb = typed_value(b, { type: "number" });
      if (isTvError(ta) || isTvError(tb)) throw new Error("finite doubles must type");
      expect(compare(ta, "<", tb)).toBe(a < b);
    }
  });

  it("the seeded generator replays byte-identically — the seed is the law", () => {
    expect([...seededDoubles(FC_SEED, 5)]).toEqual([...seededDoubles(FC_SEED, 5)]);
  });
});
