---
name: probe-elicit
description: "Interview a new annnä use case out of the user's head, one question at a time, and write a domain brief. Decides single-persona vs multi-stakeholder Situation and hands off to probe-situation. Use when starting a new user-story falsification-probe persona (Person F, G, …) for annnä. annnä-specific."
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion, Write
user-invocable: true
---

# /probe-elicit: get a new annnä use case out of the user's head

Interview the user (Matt) to capture a new **falsification-probe** use case for annnä's user-story requirements, then write a **domain brief** and route to the builder. This is the front-end of the `probe-*` suite.

**First:** read `~/.claude/skills/probe-situation/METHOD.md`, it holds the invariants (probes-not-targets, the taxonomy, POV rules, annnä substrate). Everything below assumes it.

## When to use
- Starting a new persona in `$HOME/Projects/annna/annnä-commitment-research/user-stories/` (Person F, G, H… or a fresh idea).
- Matt says "let's do a new use case / persona / situation," "interview me on X," or hands a rough domain.

## When NOT to use
- The domain is already written down in a brief → skip to `probe-situation`.
- Matt is editing an existing persona/situation → edit it directly.

## Workflow

### 1. Orient (no questions yet)
- Read `METHOD.md` and the gold references it names.
- Read `user-stories/README.md` and skim existing `user-stories/person-*.md` + `user-stories/Situations/*/` so you know what's already covered, **so you don't propose a persona another already absorbs** (the Person-B-into-Sofia move).
- Note the "known gap" in `user-stories/README.md` (e.g. no pure personal-life persona yet) as candidate territory.

### 2. Interview: one question at a time
Follow the elicitation discipline in METHOD §9: **one question per turn, with a recommended answer; no batched prose.** Prefer `AskUserQuestion` with a recommended option first. Use free-text when Matt wants to talk at length.

**Do NOT ask Matt what his _users_ should decide** (METHOD §9). Ask the policy shape; route user-choices to "the system asks its user and stores it once."

Extraction checklist (drive toward each; stop asking once you could act):
1. **The world**: what is this domain, in one concrete sentence? Who's the protagonist?
2. **The actors**: list every party. For each, is it a **one-of-one resource** (supplies one thing) or a **taker/operator** (orchestrates, depends on resources)? Is the customer off-app?
3. **Single vs multi**: is this one/two actors (a persona) or a market of many that must be coordinated (a Situation)? (This is the routing decision.)
4. **The rules/limits**: the hard constraints, and **where they come from** (an agency/standards doc? the operator's own choice?).
5. **The floor**: how does this work **today, without annnä**? The manual mess. (This becomes the "even if the app didn't exist" run.)
6. **The failure modes**: what **must be refused** (poka-yoke), and what **must work**. Push for the cancellations, races, expiries, scarcity dead-ends.
7. **New primitive pressure**: does anything here strain annnä's known primitives? If so, note it as a **held-out prediction** (don't design to it).

### 3. Decide single vs multi
State the call with a one-line reason (per METHOD §3). If it's a market of many coordinated stakeholders → Situation. If one/two actors → persona.

### 4. Write the brief
Write `$HOME/Projects/annna/annnä-commitment-research/user-stories/_briefs/<slug>.md` with:
- **World** (one paragraph), **protagonist**, **single|multi** + reason.
- **Actors** table: name · resource|operator|customer · what they supply / do.
- **Rules & their source** (agency doc vs operator choice).
- **The floor** (how it works today, no app).
- **Situations to cover**: must-work + must-be-refused (bullet list).
- **Held-out predictions** (anything that may need a new general primitive, flagged, not designed to).

### 5. Hand off
End by recommending the next skill and the exact invocation:
- single → `probe-situation <slug>` (a Situation folder with one protagonist)
- multi → `probe-situation <slug>` (optionally `stage=map` first)

Do not build the artifact here, just the brief.
