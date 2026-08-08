# Testing the harness — behavioral tests on stubs

*Criteria: [`../harness/SCENARIOS.md`](../harness/SCENARIOS.md). Stubs: [`../harness/INTERFACES.md`](../harness/INTERFACES.md). Build order: [`../harness/BUILD.md`](../harness/BUILD.md).*

The harness is a loop of behavior — utterance in, decisions, tool calls, verification — not a pile of functions. So its tests are **behavioral**: Given a situation / When something happens / Then the harness did the right thing. The scenarios are already written in exactly this form; the build turns each into an executable test, one to one.

## Why it's deterministic anyway

Behavioral tests are usually flaky because of live dependencies. Here every neighbor is a **scripted stub**:

- **Model stub** — returns pre-written `normalize`/`narrate` outputs per test, **and `summarize`** (the quarantine read, [`../harness/INTERFACES.md §2.4`](../harness/INTERFACES.md)): a scripted `{summary, labels[]}` per quarantined input, **plus a failure fixture** — a scenario key that fails on every attempt including the fallback, so **L7**'s fail-closed path is reachable rather than vacuously green. Four scripted calls, not three; the stub's normative shape is [`../harness/INTERFACES.md §5`](../harness/INTERFACES.md) and [`../harness/BUILD.md`](../harness/BUILD.md) Step 0. No real model, no randomness, no cost. (The real model is tested separately, by evals — [`model.md`](model.md).)
- **Engine stubs** — canned handles, scripted verdicts (the capacity check, the latch check), and canned `resolve` proposals: a placement, a compaction Proposal, an **offered share**, or a decline, all through the one signature.
- **A steppable virtual clock** — the fourth stub, and the one the determinism claim below actually rests on. Hold and offer expiry (C8), parks, and the escalation ladder's rung timeouts (D12–D17) all advance because a test **steps** the clock. Nothing sleeps; no test waits on wall time.
- **App stubs** — record-and-return **spies**: they capture every call (what was rendered, what was sent, to whom, on what basis) so tests assert on the recording.

Same inputs → same run, every time. L2 pins this as a criterion: the same trigger fired twice assembles an identical context.

## What the assertions look like

- **Writes, not words** (A, B, G families): the test inspects what was *written* through the seam — a Rule with the right shape, an edit not a duplicate — never the chat text.
- **The floor as a spy assertion** (D family): the outward-act spy proves `notify_and_await` fired only with a basis, every act carrying `{who, basis, when}` (D6), and never at all in the no-grant cases (D1, D3, D4).
- **Refusals surfaced, not swallowed** (A4, B5, E family): the stub's `conflict`/`refuse` verdict must reach the surface.
- **Absence asserted structurally** (D9, N2): no tool in the contract declares the `destruction` or `value-transfer` class — a walk of the contract, not a runtime check.
- **Composition pinned** (P1): the compaction pass-through asserts at the end that no tool beyond the §5 contract was called and the harness needed no change.
- **The floor as a property** (D20): the D-family spies prove the floor case by case; **one property-based test** raises them to an invariant — *no outward act ever occurs without a matching basis, under any tool-call sequence*. The library is **`fast-check`** — the TypeScript-native property-based framework, added as the harness's one non-scaffolding dependency at [`../harness/BUILD.md`](../harness/BUILD.md) Step 3; it records a reproducible seed for any counterexample, which is what makes a failure of this invariant re-runnable rather than anecdotal. Generate arbitrary interleavings of tool calls (across-the-line and reversible), confirmations, and grants; assert every across-the-line effect the spies recorded carries `{who, basis, when}` whose basis actually matches — a **content-bound** live confirmation (D18) or a **scope-matched** grant (D11). This is the harness's crown-jewel invariant, the analogue of the engine's property-tested latch/quota invariants; its one normative home is [`../harness/SPEC.md §7`](../harness/SPEC.md) and it adds no new law. Written at build time like every scenario test.

## Family map

**A** board authoring (incl. **A7** return-leg validation) · **B** rules/elicitation · **C** status latches · **D** the floor (incl. **D10–D11** auto-accept-as-Grant, **D18–D20** content-bound confirmation / fail-closed / the floor property) · **D′** the escalation ladder (**D12–D17**) · **E** M2 gate · **F** conflict/versioning · **G** elicitation store · **H** orders/groups/guest · **I** the cross-owner share (**I1–I4**) · **K** check-work · **L** context assembly · **N** money · **P** proposal round-trip — all `[MUST]`, all behavioral, all on stubs.

**J family is different.** `[HELD-OUT]` probes run against the *finished* harness and their results are **recorded, pass or fail** — a failure means "which general primitive is missing," never "patch the atom." Do not design or fix toward J.

`[ENGINE]`-tagged parts (e.g. A4's enforcement) assert only the harness's half — the stub's verdict is surfaced; real enforcement is proven later at the swap.

## Done when

All MUST scenarios green on stubs, J results recorded. The harness suite then becomes the **reference exam** every other layer must pass at its swap ([`integration.md`](integration.md)).
