# Testing the harness — behavioral tests on stubs

*Criteria: [`../harness/SCENARIOS.md`](../harness/SCENARIOS.md). Stubs: [`../harness/INTERFACES.md`](../harness/INTERFACES.md). Build order: [`../harness/BUILD.md`](../harness/BUILD.md).*

The harness is a loop of behavior — utterance in, decisions, tool calls, verification — not a pile of functions. So its tests are **behavioral**: Given a situation / When something happens / Then the harness did the right thing. The scenarios are already written in exactly this form; the build turns each into an executable test, one to one.

## Why it's deterministic anyway

Behavioral tests are usually flaky because of live dependencies. Here every neighbor is a **scripted stub**:

- **Model stub** — returns pre-written `normalize`/`narrate` outputs per test. No real model, no randomness, no cost. (The real model is tested separately, by evals — [`model.md`](model.md).)
- **Engine stubs** — canned handles, scripted verdicts (the capacity check, the latch check), and canned `resolve` proposals: a placement, a compaction Proposal, a **bind proposal**, or a decline, all through the one signature.
- **A steppable virtual clock** — the fourth stub, and the one the determinism claim below actually rests on. Hold and offer expiry (C8), parks, and the escalation ladder's rung timeouts (D12–D17) all advance because a test **steps** the clock. Nothing sleeps; no test waits on wall time.
- **App stubs** — record-and-return **spies**: they capture every call (what was rendered, what was sent, to whom, on what basis) so tests assert on the recording.

Same inputs → same run, every time. L2 pins this as a criterion: the same trigger fired twice assembles an identical context.

## What the assertions look like

- **Writes, not words** (A, B, G families): the test inspects what was *written* through the seam — a Rule with the right shape, an edit not a duplicate — never the chat text.
- **The floor as a spy assertion** (D family): the outward-act spy proves `notify_and_await` fired only with a basis, every act carrying `{who, basis, when}` (D6), and never at all in the no-grant cases (D1, D3, D4).
- **Refusals surfaced, not swallowed** (A4, B5, E family): the stub's `conflict`/`refuse` verdict must reach the surface.
- **Absence asserted structurally** (D9, N2): no tool in the contract declares the `destruction` or `value-transfer` class — a walk of the contract, not a runtime check.
- **Composition pinned** (P1): the compaction pass-through asserts at the end that no tool beyond the §5 contract was called and the harness needed no change.

## Family map

**A** board authoring · **B** rules/elicitation · **C** status latches · **D** the floor (incl. **D10–D11** auto-accept-as-Grant) · **D′** the escalation ladder (**D12–D17**) · **E** M2 gate · **F** conflict/versioning · **G** elicitation store · **H** orders/groups/guest · **I** the cross-owner bind (**I1–I4**) · **K** check-work · **L** context assembly · **N** money · **P** proposal round-trip — all `[MUST]`, all behavioral, all on stubs.

**J family is different.** `[HELD-OUT]` probes run against the *finished* harness and their results are **recorded, pass or fail** — a failure means "which general primitive is missing," never "patch the atom." Do not design or fix toward J.

`[ENGINE]`-tagged parts (e.g. A4's enforcement) assert only the harness's half — the stub's verdict is surfaced; real enforcement is proven later at the swap.

## Done when

All MUST scenarios green on stubs, J results recorded. The harness suite then becomes the **reference exam** every other layer must pass at its swap ([`integration.md`](integration.md)).
