---
name: probe-elicit
description: "Run an annnä elicitation sitting: interview the founder one question at a time from a question brief in user-stories/_briefs/ (or a fresh domain), then hand the answers to probe-situation to be written as a Situation run. Use when starting or extending a falsification-probe use case for annnä. annnä-specific."
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion, Write
user-invocable: true
---

# /probe-elicit: get a use case out of the founder's head

Interview the founder (Matt) to capture a **falsification-probe** use case for annnä, from a question brief or a fresh domain, and hand the answers to `probe-situation`, which writes them as a Situation run. This is the front end of the `probe-*` pair.

**First:** read `user-stories/README.md`, the law for every story (probes not targets, the Situation folder shape, voice, provenance registers, the invented-and-justified register). Then read `.agents/skills/probe-situation/METHOD.md` for the elicitation discipline and the setup-story shape. Paths here are repo-relative to the annnä repository root.

## When to use
- A brief in `user-stories/_briefs/` is ready (its readiness line is met) and Matt opens a sitting on it.
- Matt says "let's do a new use case / situation," "interview me on X," or hands a rough domain with no brief yet.

## When NOT to use
- The answers are already recorded → go straight to `probe-situation`.
- Matt is editing an existing Situation → edit it directly, under `user-stories/README.md`'s change rules.

## Workflow

### 1. Orient (no questions yet)
- Read `user-stories/README.md` and the brief the sitting runs from, if any (`user-stories/_briefs/README.md` says what a brief is).
- Skim every existing `user-stories/Situations/Situation-*/README.md` storybook and `user-stories/COVERAGE.md`, so you know what is already covered and **don't propose a use case an existing Situation already absorbs**.
- Note the known gaps and owed beats in `user-stories/README.md` and `COVERAGE.md` as candidate territory.

### 2. Interview: one question at a time
Follow the elicitation discipline in METHOD §9: **one question per turn, with a recommended answer; no batched prose.** Prefer `AskUserQuestion` with a recommended option first. Use free text when Matt wants to talk at length. If a brief exists, its questions are the agenda.

**Do NOT ask Matt what his _users_ should decide** (METHOD §9). Ask the policy shape; route user choices to "the system asks its user and stores it once."

Extraction checklist (drive toward each; stop asking once you could act):
1. **The world**: what is this domain, in one concrete sentence? Who's the protagonist?
2. **The actors**: list every party. For each, is it a **one-of-one resource** (supplies one thing) or a **taker/operator** (orchestrates, depends on resources)? Is the customer off-app?
3. **One protagonist or a market**: is this one or two actors (a single-protagonist Situation with a `story-<name>.md` telling) or a market of many that must be coordinated (a multi-stakeholder Situation)?
4. **The rules/limits**: the hard constraints, and **where they come from** (an outside standard, or the operator's own choice?).
5. **The floor**: how does this work **today, without annnä**? The manual mess. (This becomes the current-reality run.)
6. **The failure modes**: what **must be refused** and what **must work**. Push for the cancellations, races, expiries, scarcity dead-ends.
7. **New primitive pressure**: does anything here strain annnä's known primitives? If so, note it as a **held-out prediction** (don't design to it).

### 3. Record the answers, not the brief
A brief stays a list of questions (`user-stories/_briefs/README.md`: "do not reshape a question brief into that voice"); never write answers into it. Keep the sitting's answers in your working notes and hand them to `probe-situation`, which writes them as a Situation run (new or extended folder) with its provenance register declared in-file (`user-stories/README.md` §Provenance), normally *elicited-blind* or *elicited-to-design*.

### 4. Hand off
End by recommending the exact invocation:
- `probe-situation <slug>` (optionally `stage=map` first for a market of many).

Do not write the Situation here.
