# Brief — the external client (an agent as the caller)

**Readiness.** Ready when the founder opens a sitting on the external client. Not before — this brief collects the questions; the sitting supplies the domain.

**The debt this closes.** `../../PRD.md` §4.6 records **RQ-1 through RQ-9** as `owed`, each stating what its probe must show. That is nine of the eleven owed requirements in the register and the single largest probe gap in the corpus.

**Why no existing Situation reaches it.** `../../PRD.md` §2.4 states the fact plainly: *"Every Situation in the corpus has a human at a console; none has an agent as the caller."* The harness X-family and `../../security/SCENARIOS.md T9` specify the tool contract and the credential — they prove the *foundation* another party's agent would need, and they do not prove that an owner lives inside somebody else's client.

## World

An owner already running their business on annnä wants to reach it from somewhere that is not our glass — their own agent, their own script, a client we did not write. The whole of RQ-1 to RQ-9 is about what that reach must be worth: parity with the console, a capability refused rather than improvised, a renderless client getting a complete answer, a continuation picked up by handle from a second client.

**Protagonist:** to be established at the sitting. **Single or multi:** to be established.

## The open question this sitting must resolve, not assume

**Is an owner wiring their own agent a new Situation, or a run inside Situation A?** This is a genuine fork and it belongs to the elicitation. It is not this brief's to decide, and the routing of `/probe-elicit` to `/probe-situation` versus `/probe-persona` depends on the answer.

## Actors — to be established, not assumed

| Actor | Kind | To ask |
|---|---|---|
| The owner | operator-protagonist | Which owner is this? Do they already appear in a Situation, or is this somebody new? |
| Their agent / client | ? | Is it something the owner wrote, something they bought, or something a vendor runs for them? The answer decides whether a second legal person is involved — and FR1 governs that |
| The customer | customer, off-app? | Does the customer ever meet the agent, or only the ordinary link? |

## Rules and their source — to ask

- What does the owner believe they are authorising when they mint a credential for their own agent — and does that belief match the one-credential-per-mutation floor?
- Which acts must a client be *refused*, in the owner's own words, rather than allowed with a warning?
- Whose rules govern when the client is a vendor's rather than the owner's own? FR1's legal review sits here.

## The floor (today, without the app)

To ask: what does this owner do today when they want their booking data somewhere else? Export? Retype? Nothing at all, and the want is hypothetical? A brief that assumes the want is real has already answered the question worth asking.

## Situations to cover — the questions, not the answers

**To elicit as must-work.** For each of RQ-1 to RQ-9, ask the founder for the *concrete moment* in an owner's week where it bites — the row in `../../PRD.md` §4.6 already says what the probe must show, so the sitting supplies the story, not the criterion:

- The owner minting a credential for their own agent at the console, and an agent request being unable to mint one (RQ-1).
- One act performed by console and by client, ending identically (RQ-2).
- A wanted capability refused because it would need a new verb, resolved as a ruling (RQ-3).
- A renderless client obtaining a complete answer no page was read for (RQ-4).
- A continuation picked up by handle from a second client (RQ-5).
- RQ-6 through RQ-9 as their rows state them.

**To elicit as must-be-refused.** Ask what the owner would be *alarmed* to find their agent could do. The refusals in this family are the point of it; a client surface with no refusals is not a probe.

## Held-out predictions to flag, never design to

1. Whether a credential the owner mints for themselves is the same object class as one minted for a second legal person — or whether conflating them is exactly the mistake FR1's review exists to catch.
2. Whether "parity with the console" survives contact with a client that has no console: an act with no rendering may have no confirmation surface, and the confirm-before-outward floor assumes one.

## Hand-off

`/probe-elicit` first, one question per turn. It routes to `/probe-situation` or `/probe-persona` on its own single-versus-multi call, once the fork above is answered. Flipping the `../../PRD.md` §4.6 anchors is the sitting's act, not this folder's — the PRD sits outside this folder's fence.
