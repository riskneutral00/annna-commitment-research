# annnä

**annnä is an agent-first commitment harness.** You talk; it holds what you promised and does the work the promise implies. The aim is a schedule that feels like there is nothing on it, because the coordination no longer lives in your head.

> **This repository contains specifications and early code, not a working application.** The engine and harness have Step-0 scaffolds and test suites. Product behavior described below remains to be implemented and verified.

**Planning status, 2026-09-20:** project-phase definitions and current authorization are in [AGENTS.md](AGENTS.md#project-phases). The [Phase 1 exit review](blastoff.md) separates complete planning from future build and live-verification evidence.

## The product

A commitment holds a promise and its conditions. Personal appointments, lessons, routines and shared plans belong on one board, where the people and resources they need can be checked together.

The approved v1 direction includes:

- **Native iPhone and web** for owners to enter commitments, choose skins and author reusable templates through conversation.
- **Template discovery and authoring:** look for a suitable template, adapt one when available, or create one from scratch when the catalog is empty. Owners can publish a reusable shape without publishing their personal data.
- **Scoped guest access:** account-free booking and consent pages, with a template-bound console for completing a request and asking about availability. Guests see the published slice, never the owner's private board.
- **An owner's own agents** using the same permitted tools, within the authorization boundaries in the [requirements](PRD.md).

Calendar import is manual, at the owner's request, with no write-back. V1 excludes owner and guest file uploads and participant-document verification. The [app specification](app/SPEC.md) and [security specification](security/SPEC.md) are the implementation homes and now carry that exclusion and the scoped guest door; what they describe is specified behavior, still owed at the build gates that name it.

## Start reading

1. [Matt schedules English lessons](user-stories/Situations/Situation-A/story-matt.md) — the detailed first-use story, from personal commitments to template authoring and student booking. It is scripted end-state behavior; the [verification companion](user-stories/Situations/Situation-A/story-matt-verification.md#layer-debt) records the contracts and tests still owed.
2. [Product requirements](PRD.md) — the general capabilities the stories test.
3. [INDEX.md](INDEX.md) lists every markdown file tracked in this repository with its authority tier.

Agents start with [AGENTS.md](AGENTS.md), then INDEX.md. Once development is explicitly authorized, builders start with [harness/BUILD.md](harness/BUILD.md), against stubs, following the existing [build dependencies](deployment/SPEC.md).

## One week, run twice

The established proof script follows one busy week at a small Phuket dive center: the same four customer parties, shared equipment, boat clashes and suppliers falling through.

**Today:** close to two dozen phone calls, a second boat arranged on the morning it is needed, rewritten manifests and equipment chased across town.

**The end-state script:** with everyone connected, the week is placed against instructors, boats, pools, tanks and gear together. This is the ceiling the story explores, not a demonstrated v1 capability.

**The minimal-network script:** annnä checks what it can reach, prepares the calls it cannot make and records the answers. Two dozen calls become a handful of prepared ones. V1 placement remains per goal, with honest refusals; the [story scope notes](user-stories/README.md) distinguish that from the ceiling.

Read [the clean run](user-stories/Situations/Situation-C/situation-1.md), [current reality](user-stories/Situations/Situation-C/situation-2.md) and [the middle case](user-stories/Situations/Situation-C/situation-5.md). These are authored accounts, not results from a running app.

The situations in [user-stories](user-stories/README.md) test the general commitment model.

## Architecture

The model handles language and judgment. The engine supplies correctness-critical times, availability and capacity; the harness controls what may act on them.

| Package | Responsibility |
|---|---|
| [Harness](harness/README.md) | Agent loop, tools, clarification and permission boundaries |
| [Engine](engine/README.md) | Persistent record and deterministic scheduling calculations |
| [App](app/README.md) | Owner surfaces, guest pages and delivery |
| [Model](model/README.md) | Model contracts and qualification exams |
| [Marketplace](marketplace/README.md) | Reusable template and skin formats, publishing and installation contracts |
| [Security](security/README.md) | Privacy, scoped access, hostile-input handling and security acceptance |
| [Deployment](deployment/README.md) | Build discipline, verification and environment boundaries |

The specifications require an explicit permission basis for acts affecting other people. Saving a contact grants no sending or access authority. Private commitments constrain availability without exposing their contents; changed rules preserve the terms of existing commitments. These are requirements to prove, not claims of completed enforcement. See the [harness law](harness/SPEC.md), [engine law](engine/SPEC.md) and [security build gates](security/BUILD.md).

## Check the repository

Use Node.js 22, as in [CI](.github/workflows/check.yml). From the repository root on macOS or Linux:

```sh
npm ci --prefix engine
npm ci --prefix harness
git config core.hooksPath .githooks
env -u CONVEX_URL npm run check
npm run check:status
```

The check runs the process gates and scaffold suites. The command above excludes the live reactive-push probe; its explicit skip is not evidence that reactive delivery works. A green check does not establish a working app or launch readiness. See [the gate reference](deployment/README.md) and [test strategy](TDD.md).

For decisions, use [RULINGS.md](RULINGS.md).

## License

[MIT](LICENSE) © 2026 Matthew Lee
