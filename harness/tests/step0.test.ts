import { describe, expect, expectTypeOf, it } from "vitest";
import { handleTurn, makeClock, wire, SUMMARIZE_ALWAYS_FAILS } from "../src/index.js";
import { ModelStub } from "../src/stubs/model.js";
import { EngineStub } from "../src/stubs/engine.js";
import { AppStub } from "../src/stubs/app.js";
import type { AppSeam, CalculateResult, EngineSeam, Envelope, ReadSnapshot, PendingDecisionRead, DecisionChoiceRead, HumanPrincipalRead, Handle, UnclearedParkRead } from "../src/seams.js";

// harness/BUILD.md Step 0 — Verify: the test runner runs; a trivial "echo" test
// passes; swapping a stub for a no-op adapter through the injection point needs
// no harness edit. Each test below is one of those three, plus the two Step-0
// deliverables that are easy to declare and never check.
//
// Every seam call is a promise (INTERFACES.md §1, the async law) — the tests
// await them, which is exactly the shape the real adapters will demand.

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

  it("sleepUntil resolves on the step that reaches the instant, never before", async () => {
    // The async law's twin of the step test: a sleeper is pending while the
    // clock is short of its instant, and resolves when a step carries the
    // clock to or past it — on stepped time only, nothing waits on wall time.
    const clock = makeClock(0);
    let woke = false;
    const sleeper = clock.sleepUntil(1_000).then(() => {
      woke = true;
    });
    clock.step(999);
    await Promise.resolve(); // drain microtasks — the sleeper must still be pending
    expect(woke).toBe(false);
    clock.step(1);
    await sleeper;
    expect(woke).toBe(true);
  });

  it("sleepUntil on a past instant resolves immediately", async () => {
    const clock = makeClock(5_000);
    await clock.sleepUntil(1_000); // resolves without any step
  });
});

describe("Step 0 — the injection point", () => {
  it("takes a no-op adapter for any single seam with no harness edit", async () => {
    // The Z2 property, asserted rather than asserted-about: a bare object
    // satisfying the interface goes in, and the other two seams still default.
    const noopEngine = {
      calculate: async () => ({}) as never,
      commit: async () => ({ ok: true as const, applied_ref: "ref0" }),
      check_consistency: async () => ({ conflicts: [], latent: [] }),
      check_coverage: async () => ({ kind: "board-structural" as const, missing_required: [] }),
      resolve: async () => ({}) as never,
    } satisfies EngineSeam;

    const h = wire({ engine: noopEngine });
    expect((await h.engine.commit({}, "w0")).ok).toBe(true);
    expect(h.model).toBeDefined();
    expect(h.app).toBeDefined();
  });

  it("gives each engine stub its own handle sequence", async () => {
    // Regression. The counter was module-level and reset in the constructor, so
    // constructing a second stub rewound the first one's sequence and two
    // different calculate() calls returned the SAME handle — destroying the one
    // property an opaque handle has (INTERFACES.md §1.1).
    const a = new EngineStub();
    const first = JSON.stringify(await a.calculate({ q: 1 }));
    new EngineStub();
    expect(JSON.stringify(await a.calculate({ q: 2 }))).not.toBe(first);
  });

  it("requires declared record fields and correlates snapshot payloads", () => {
    type Payload<S extends ReadSnapshot["shape"]> = Extract<ReadSnapshot, { shape: S }>["value"];
    expectTypeOf<{}>().not.toExtend<Payload<"PartyContact">>();
    expectTypeOf<{}>().not.toExtend<Payload<"DeliveryEvent">>();
    expectTypeOf<{}>().not.toExtend<Payload<"PendingAsk">>();
    expectTypeOf<{}>().not.toExtend<Payload<"PendingDecision">>();
    expectTypeOf<{}>().not.toExtend<Payload<"OnCall">>();
    expectTypeOf<{}>().not.toExtend<Payload<"OpenEscalations">>();
    expectTypeOf<{}>().not.toExtend<Payload<"PatternDecline">>();
    expectTypeOf<{}>().not.toExtend<Payload<"UnclearedParks">>();
    expectTypeOf<{}>().not.toExtend<Payload<"InboxLossRecords">>();
    expectTypeOf<{}>().not.toExtend<Payload<"RelevantSlice">>();
    expectTypeOf<{}>().not.toExtend<Payload<"TemplateBundle">>();
    expectTypeOf<{}>().not.toExtend<Payload<"CandidateShapeGhost">>();
    expectTypeOf<{}>().not.toExtend<Payload<"FiringEvent">>();
    expectTypeOf<{}>().not.toExtend<Payload<"TurnState">>();
    expectTypeOf<Omit<Payload<"PartyContact">, "updated">>().not.toExtend<Payload<"PartyContact">>();
    expectTypeOf<Omit<Payload<"DeliveryEvent">, "act_ref">>().not.toExtend<Payload<"DeliveryEvent">>();
    expectTypeOf<Omit<Payload<"PendingAsk">, "raised_in">>().not.toExtend<Payload<"PendingAsk">>();
    expectTypeOf<{ shape: "PendingDecision"; value: Payload<"PendingAsk"> }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ shape: "PartyContact"; value: Payload<"DeliveryEvent"> }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ shape: "DeliveryEvent"; value: { kind: "sent"; at: string } }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ shape: "EffectivePolicy"; value: {} }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ shape: "OwnerBoard"; value: {} }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ shape: "Shared"; value: {} }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ shape: "NotDeclared"; value: {} }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ kind: "invalid"; reason: "malformed" }>().not.toExtend<CalculateResult>();
    expectTypeOf<{ display: string }>().not.toExtend<CalculateResult>();
    expectTypeOf<{}>().not.toExtend<UnclearedParkRead>();
    expectTypeOf<{ reason: "unverified"; since: number; trigger_ref: string }>().toExtend<UnclearedParkRead>();
    expectTypeOf<{ reason: "unverified"; since: number; trigger_ref: string; cleared_by: { principal: HumanPrincipalRead; at: number } }>().not.toExtend<UnclearedParkRead>();
    type Chosen = NonNullable<PendingDecisionRead["chosen"]>;
    expectTypeOf<Chosen>().toEqualTypeOf<{ choice: DecisionChoiceRead; by: HumanPrincipalRead; at: number }>();
    expectTypeOf<Omit<Chosen, "choice">>().not.toExtend<Chosen>();
    expectTypeOf<Omit<Chosen, "by">>().not.toExtend<Chosen>();
    expectTypeOf<Omit<Chosen, "at">>().not.toExtend<Chosen>();
    expectTypeOf<{ choice: string; by: "engine"; at: number }>().not.toExtend<Chosen>();
    expectTypeOf<{ choice: DecisionChoiceRead; by: "llm"; at: number }>().not.toExtend<Chosen>();
    expectTypeOf<string[]>().not.toExtend<PendingDecisionRead["choices"]>();
    expectTypeOf<Payload<"PendingAsk">>().not.toExtend<Handle>();
    expectTypeOf<Payload<"DeliveryEvent">>().not.toExtend<Handle>();
    expectTypeOf<{ display: string }>().not.toExtend<Handle>();
    // Required-key rosters come from the object homes, so making just one
    // member optional cannot weaken the test along with the implementation.
    type OmitEach<T, Keys extends keyof T> = { [K in Keys]: Omit<T, K> }[Keys];
    type AcceptedIncomplete<T, Keys extends keyof T> = Extract<OmitEach<T, Keys>, T>;
    expectTypeOf<AcceptedIncomplete<Payload<"PartyContact">, "owner_org" | "party_ref" | "addresses" | "preferred_channel" | "updated">>().toEqualTypeOf<never>();
    expectTypeOf<AcceptedIncomplete<Payload<"DeliveryEvent">, "owner_org" | "kind" | "party_ref" | "channel" | "act_ref" | "at">>().toEqualTypeOf<never>();
    expectTypeOf<AcceptedIncomplete<Payload<"PendingAsk">, "owner_org" | "id" | "owner" | "raised_in" | "question_ref" | "expires_at">>().toEqualTypeOf<never>();
    expectTypeOf<AcceptedIncomplete<PendingDecisionRead, "owner_org" | "id" | "commitment" | "raised_by" | "choices">>().toEqualTypeOf<never>();
    expectTypeOf<AcceptedIncomplete<Payload<"PatternDecline">, "owner_org" | "owner" | "pattern_key" | "proposed_value_hash" | "permanent" | "declined_at">>().toEqualTypeOf<never>();
    expectTypeOf<AcceptedIncomplete<Payload<"OnCall">, "owner_org" | "owner" | "ranked" | "step_timeout" | "total_timeout">>().toEqualTypeOf<never>();
    // Fresh payloads have no extension keys outside their owning home.
    const delivery: Payload<"DeliveryEvent"> = {
      owner_org: "tenant", kind: "sent", party_ref: "party", channel: "email", act_ref: "act", at: 1,
      // @ts-expect-error DeliveryEvent never carries raw addresses.
      address: "private@example.test",
    };
    const contact: Payload<"PartyContact"> = {
      owner_org: "tenant", party_ref: "party", addresses: [], preferred_channel: "email",
      updated: { who: "owner", basis: "confirmation", when: 1 },
      // @ts-expect-error No blanket index signature admits an undeclared member.
      invented: true,
    };
    void delivery;
    void contact;
    // Deferred layouts and projection grammars must not accept invented fields.
    expectTypeOf<{ firing_ref: string; termination: "interrupted" }>().not.toExtend<Payload<"FiringEvent">>();
    expectTypeOf<{ addresses: string[] }>().not.toExtend<Payload<"CandidateShapeGhost">>();
    expectTypeOf<{ token_digests: string[] }>().not.toExtend<Payload<"TemplateBundle">>();
  });

  it("scripts declared read snapshots and failure branches with isolated fixtures", async () => {
    const engine = new EngineStub();
    const snapshot: ReadSnapshot = {
      shape: "PendingAsk",
      value: {
        id: "ask-1",
        owner_org: "tenant-1",
        raised_in: "firing-1",
        owner: "owner-1",
        question_ref: "question-1",
        expires_at: 2_000,
        proposed: { field_ref: "field-1", scope_ref: "scope-1", value: { label: "original" } },
      },
    };
    const decision: ReadSnapshot = {
      shape: "PendingDecision",
      value: { owner_org: "tenant-1", id: "decision-1", commitment: "commitment-1", raised_by: "min-occupancy", choices: [] },
    };
    const contact: ReadSnapshot = {
      shape: "PartyContact",
      value: { owner_org: "tenant-1", party_ref: "party-1", addresses: [{ channel: "email", address: "party@example.test" }], preferred_channel: "email", updated: { who: "owner-1", basis: "confirmation", when: 1 } },
    };
    const invalid: CalculateResult = { kind: "invalid", reason: "schema-mismatch", detail: "unknown query member" };
    const timeout: CalculateResult = { kind: "timeout", reason: "substrate" };
    const unavailable: CalculateResult = { kind: "unavailable", reason: "provider" };
    const seam: EngineSeam = engine;
    const expected = structuredClone(snapshot);
    const query = { kind: "read", shape: "PendingAsk", principal: "owner-1" };

    engine.scriptCalculate({ read: "decision" }, decision);
    engine.scriptCalculate({ read: "contact" }, contact);
    const pending = await seam.calculate({ read: "decision" });
    if (!("shape" in pending) || pending.shape !== "PendingDecision") throw new Error("expected pending decision");
    expect(pending.value.commitment).toBe(decision.value.commitment);
    expect(pending.value.raised_by).toBe("min-occupancy");
    expect(pending.value.chosen).toBeUndefined();
    const recipient = await seam.calculate({ read: "contact" });
    if (!("shape" in recipient) || recipient.shape !== "PartyContact") throw new Error("expected party contact");
    expect(recipient.value.preferred_channel).toBe("email");
    expect(recipient.value.addresses[0]?.address).toBe("party@example.test");
    engine.scriptCalculate(query, snapshot);
    query.principal = "other-owner";
    snapshot.value.proposed = { field_ref: "changed", scope_ref: "changed", value: "changed" };
    engine.scriptCalculate({ kind: "read", shape: "unknown" }, invalid);
    engine.scriptCalculate({ kind: "read", shape: "slow" }, timeout);
    engine.scriptCalculate({ kind: "read", shape: "offline" }, unavailable);

    const read = await seam.calculate({ principal: "owner-1", shape: "PendingAsk", kind: "read" });
    if (!("shape" in read) || read.shape !== "PendingAsk") throw new Error("expected a pending ask snapshot");
    expect(read).toEqual(expected);
    expect(read.value).toEqual(expected.value);
    read.value.id = "mutated-locally";
    if (!read.value.proposed) throw new Error("expected stored proposal");
    read.value.proposed.field_ref = "mutated-field";
    await expect(seam.calculate({ kind: "read", shape: "PendingAsk", principal: "owner-1" })).resolves.toEqual(expected);
    await expect(engine.calculate({ kind: "read", shape: "unknown" })).resolves.toEqual(invalid);
    await expect(seam.calculate({ kind: "read", shape: "slow" })).resolves.toEqual(timeout);
    await expect(seam.calculate({ kind: "read", shape: "offline" })).resolves.toEqual(unavailable);
    // Query syntax is opaque to this generic scaffold. Only a prepared exact
    // query has a script; neither another principal nor another stub inherits it.
    for (const result of [await seam.calculate(query), await new EngineStub().calculate({ kind: "read", shape: "PendingAsk", principal: "owner-1" }), await seam.calculate({ completely: "unscripted" })]) {
      if (!("display" in result)) throw new Error("expected canned handle fallback");
      expect(result.display).toMatch(/^display of h/);
    }
    const handle = await seam.calculate({ computed: "availability" });
    if (!("display" in handle)) throw new Error("expected opaque handle");
    engine.scriptCalculate({ computed: "scripted" }, handle);
    await expect(seam.calculate({ computed: "scripted" })).resolves.toEqual(handle);
    expect(engine.calls.every(({ call }) => call === "calculate")).toBe(true);
  });

  it("records every app call, so an act fired twice is countable", async () => {
    const h = wire();
    const app = h.app as AppSeam & { countOf(c: string): number };
    await h.app.render("board", {});
    expect(app.countOf("render")).toBe(1);
  });
});

describe("Step 0 — publish preserves infrastructure outcomes", () => {
  it("returns refused, unavailable, and timeout without minting, then keeps the success path", async () => {
    const app = new AppStub();
    const failures = [
      { kind: "refused", reason: "no-basis" },
      { kind: "unavailable", reason: "provider" },
      { kind: "timeout", reason: "provider" },
    ] satisfies Array<Envelope<"refused" | "unavailable" | "timeout">>;

    for (const failure of failures) {
      app.nextPublishResult = failure;
      await expect(app.publish({ template: "personal" }, ["recipient-1"])).resolves.toEqual(failure);
    }

    await expect(app.publish({ template: "personal" }, ["recipient-1"])).resolves.toEqual({
      artifact: { template: "personal" },
      minted: [{ digest: "digest-1", bound_to: "recipient-1" }],
    });
  });
});

describe("Step 0 — ModelStub scripts four calls, not three", () => {
  it("scripts summarize, the §2.4 quarantine read", async () => {
    const model = new ModelStub({ summarize: { "a guest note": { summary: "asks to move", labels: ["request"] } } });
    await expect(model.summarize("a guest note", "guest")).resolves.toEqual({ summary: "asks to move", labels: ["request"] });
  });

  it("carries a failure fixture that fails on every attempt including the fallback", async () => {
    // Without this fixture L7's fail-closed path is unreachable and the
    // scenario passes vacuously — which is the failure BUILD.md Step 0 names.
    const model = new ModelStub({});
    await expect(model.summarize(SUMMARIZE_ALWAYS_FAILS, "guest")).rejects.toThrow(/every attempt including the fallback/);
  });

  it("fails closed on an unscripted input rather than inventing a summary", async () => {
    await expect(new ModelStub({}).summarize("unscripted stranger text", "guest")).rejects.toThrow(/fail closed/);
  });
});

describe("Step 0 — the entry points exist and are honestly empty", () => {
  it("handleTurn throws rather than returning a plausible nothing", () => {
    expect(() => handleTurn(wire(), { utterance: "hi", owner: "o" })).toThrow(/Step 5/);
  });
});
