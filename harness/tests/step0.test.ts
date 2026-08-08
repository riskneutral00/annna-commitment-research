import { describe, expect, it } from "vitest";
import { handleTurn, makeClock, wire, SUMMARIZE_ALWAYS_FAILS } from "../src/index.js";
import { ModelStub } from "../src/stubs/model.js";
import { EngineStub } from "../src/stubs/engine.js";
import type { AppSeam, EngineSeam } from "../src/seams.js";

// harness/BUILD.md Step 0 — Verify: the test runner runs; a trivial "echo" test
// passes; swapping a stub for a no-op adapter through the injection point needs
// no harness edit. Each test below is one of those three, plus the two Step-0
// deliverables that are easy to declare and never check.

describe("Step 0 — the runner", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});

describe("Step 0 — the steppable virtual clock", () => {
  it("advances only when stepped, and never reads wall time", () => {
    const clock = makeClock(1000);
    expect(clock.now()).toBe(1000);
    clock.step(60_000);
    expect(clock.now()).toBe(61_000);
  });

  it("refuses to run backwards", () => {
    expect(() => makeClock().step(-1)).toThrow();
  });

  it("is shared by the whole harness, so nothing can disagree about the time", () => {
    const h = wire();
    h.clock.step(500);
    expect(h.clock.now()).toBe(500);
  });
});

describe("Step 0 — the injection point", () => {
  it("takes a no-op adapter for any single seam with no harness edit", () => {
    // The Z2 property, asserted rather than asserted-about: a bare object
    // satisfying the interface goes in, and the other two seams still default.
    const noopEngine = {
      calculate: () => ({}) as never,
      commit: () => ({ ok: true as const, commitment: null }),
      check_consistency: () => ({ conflicts: [], latent: [] }),
      check_coverage: () => ({ missing_required: [] }),
      typed_value: (raw: unknown) => raw,
      compare: () => false,
      resolve: () => ({}) as never,
    } satisfies EngineSeam;

    const h = wire({ engine: noopEngine });
    expect(h.engine.commit({}).ok).toBe(true);
    expect(h.model).toBeDefined();
    expect(h.app).toBeDefined();
  });

  it("gives each engine stub its own handle sequence", () => {
    // Regression. The counter was module-level and reset in the constructor, so
    // constructing a second stub rewound the first one's sequence and two
    // different calculate() calls returned the SAME handle — destroying the one
    // property an opaque handle has (INTERFACES.md §1.1).
    const a = new EngineStub();
    const first = JSON.stringify(a.calculate({ q: 1 }));
    new EngineStub();
    expect(JSON.stringify(a.calculate({ q: 2 }))).not.toBe(first);
  });

  it("records every app call, so an act fired twice is countable", () => {
    const h = wire();
    const app = h.app as AppSeam & { countOf(c: string): number };
    h.app.render({ surface: "board" });
    expect(app.countOf("render")).toBe(1);
  });
});

describe("Step 0 — ModelStub scripts four calls, not three", () => {
  it("scripts summarize, the §2.4 quarantine read", () => {
    const model = new ModelStub({ summarize: { "a guest note": { summary: "asks to move", labels: ["reschedule"] } } });
    expect(model.summarize("a guest note", "guest")).toEqual({ summary: "asks to move", labels: ["reschedule"] });
  });

  it("carries a failure fixture that fails on every attempt including the fallback", () => {
    // Without this fixture L7's fail-closed path is unreachable and the
    // scenario passes vacuously — which is the failure BUILD.md Step 0 names.
    const model = new ModelStub({});
    expect(() => model.summarize(SUMMARIZE_ALWAYS_FAILS, "guest")).toThrow(/every attempt including the fallback/);
  });

  it("fails closed on an unscripted input rather than inventing a summary", () => {
    expect(() => new ModelStub({}).summarize("unscripted stranger text", "guest")).toThrow(/fail closed/);
  });
});

describe("Step 0 — the entry points exist and are honestly empty", () => {
  it("handleTurn throws rather than returning a plausible nothing", () => {
    expect(() => handleTurn(wire(), { utterance: "hi", owner: "o" })).toThrow(/Step 5/);
  });
});
