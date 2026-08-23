# INDEX — every tracked markdown file, and what it decides

*One row per tracked `.md`, in `git ls-files` order. Read this before grepping: a recursive search surfaces `archive/` first, so a naive hit is likely to be superseded material. The **Tier** column says how much authority a file has before you open it. `deployment/scripts/index-complete.mjs` fails the build if this list and `git ls-files '*.md'` ever disagree.*

**Tiers** — what this file's Tier column means. The vocabulary is closed and is defined here; the authority order it grades against is `AGENTS.md` §Authority order.

| Tier | Means |
|---|---|
| `SPEC` | Source of truth. Build from it. Where anything disagrees with a `SPEC`, the `SPEC` wins. |
| `derived` | Derived from a `SPEC` or from `user-stories/`. Authoritative about its own subject, never about the law it derives from. |
| `index` | Says where things live. Never a home itself — follow it to the home and read that. |
| `history` | Records how the design was reached. There to *justify*, never to build from. |
| `never` | Explicitly non-authoritative. A scratchpad. Build from the `SPEC` instead. |

*What this file does not do: it does not say whether a description is still accurate. The gate checks that every file has a row, not that the row is true. If a row and its file disagree, the file wins — and fix the row.*

---

| File | Tier | What it decides |
|---|---|---|
| .specs/README.md | history | What the `.specs/` interview transcripts are, and that they are neither law nor plan |
| .specs/deep-interview-app.md | history | The interview that pinned the app's open design decisions before its spec was authored |
| .specs/deep-interview-engine.md | history | The interview that pinned the engine's open design decisions, incl. location and travel |
| AGENTS.md | SPEC | The operating law for agents: authority order, package shape, citation conventions, ruling vocabularies. Injected every turn |
| INDEX.md | index | This file — every tracked markdown file and its authority tier |
| PR/BRAND.md | SPEC | The visible identity: palette, marks, containment rules. Derives from the koi skin and `app/DESIGN.md` |
| PR/BRIEF.md | SPEC | The investor/grant compression — mostly pointers to homes, and the corpus's only success criteria and only risk register |
| PR/IDENTITY.md | SPEC | Who annnä is. The source every outward claim must trace to |
| PR/LANDING.md | SPEC | The public landing page and the three states it deploys in |
| PR/MESSAGING.md | SPEC | The reusable outward copy: taglines, pitches, channel angles, objection answers |
| PR/NOTES.md | never | PR backlog scratchpad |
| PR/README.md | derived | The PR package's read order and its FROZEN status |
| PR/REPO-FACADE.md | SPEC | How the repository itself presents as the storefront: description, topics, README's job, commercial silence |
| PR/VOICE.md | SPEC | The tone law for every outward word — "neutral like water", and the banned registers |
| PRD.md | SPEC | That annnä is an agent-first commitment harness for peace of mind — both senses of agent-first, capability parity for the owner's own agents, and the requirement that a full board not read as a wall |
| README.md | derived | The repo's front page: what annnä is, the one-week-run-twice proof, the layer map, current build state |
| RULINGS.md | index | The FR and FD ruling registry — what each ruling decided and which file holds it. Never a home itself |
| TDD.md | derived | The testing strategy: the five kinds of test, the four laws, which kind each layer's criteria become, and the swap sequence integration is proven by rather than by a new suite |
| app/BUILD.md | derived | The app's ordered build steps, each gated by its scenarios and the design-law checklist; ends at the stub-swap |
| app/DESIGN.md | SPEC | The visual and interaction law for every app surface. Ruled here, not carried — the prior build was released as law 2026-08-09 (FD-20) |
| app/INTERFACES.md | derived | The app's two seams: upward to the harness contract, downward to its substrates |
| app/NOTES.md | never | App backlog scratchpad — the five original ideas are absorbed and calendar import is closed; **five items still open, three of them captured founder wants** (2026-08-23: the hour-grid board mode, the routines page, goal-setting) alongside the untested direct-manipulation bet and perceived write-path latency. `npm run check:status` prints the open set, wants first |
| app/README.md | derived | The app package's purpose and read order |
| app/SCENARIOS.md | derived | The app's deterministic acceptance suite — payloads, mappings, wire contents, state transitions |
| app/SPEC.md | SPEC | The human-facing layer: what it renders, what it collects, and that it holds zero harness logic, engine math, or model calls |
| archive/01-commitment-anatomy.md | history | The founding research on what a commitment is, from philosophy and contract law |
| archive/02-data-models-event-vs-task.md | history | The founding research on real calendar and task data models, and where event and task blur |
| archive/03-model-fields-and-board.md | history | The originally proposed one-object N-axis model, field catalog, and board rendering |
| archive/04-use-cases-and-board-model.md | history | The original domain capture and the model those use cases implied |
| archive/05-post-critique-decisions.md | history | The strategic forks settled after the first adversarial critique |
| archive/06-round-two-decisions.md | history | The harness decisions after round two — where lifecycle statuses became latched, attributed events |
| archive/07-elicitation-mechanism.md | history | The original ask-once-apply-forever machinery, since absorbed into the harness SPEC |
| archive/CRITIQUE-BRIEF-2.md | history | The verbatim prompt given to the round-two adversarial reviewer |
| archive/CRITIQUE-BRIEF.md | history | The verbatim prompt given to the round-one adversarial reviewer |
| archive/CRITIQUE-FINDINGS-2.md | history | Round two's 48 findings against the revised harness: 26 killed, 22 survived |
| archive/CRITIQUE-FINDINGS.md | history | Round one's 45 findings against the original harness: 4 killed, 40 survived |
| archive/DESIGN.md | history | The original living design doc. Superseded — read for reasoning, never for the current model |
| archive/README.md | history | What `archive/` holds, and that the layer SPECs beat it wherever they disagree |
| archive/appendix-raw-research.md | history | The four blind research streams verbatim, with their source citations |
| assets/README.md | derived | The shipped skin assets, where they came from, and how the pack pipeline builds them |
| deployment/BUILD.md | derived | Deployment's ordered steps, and that Steps 0–1 close before any layer's build begins |
| deployment/INTERFACES.md | derived | Deployment's four seams, and that it owns the space *between* layers and nothing inside one |
| deployment/NOTES.md | never | Deployment backlog scratchpad |
| deployment/README.md | derived | The deployment package's purpose, and the per-gate roster behind `npm run check` |
| deployment/SCENARIOS.md | derived | The process suite: what is enforced continuously by a named mechanism, and what is drilled deliberately |
| deployment/SPEC.md | SPEC | The discipline of the build: repos, environments, the spec/code boundary, what may land on main |
| deployment/egress-allowlist.md | SPEC | The enumeration of record for outbound network calls — a file not listed here may not make one |
| deployment/env-manifest.md | SPEC | The enumeration of record for secrets: name, rung, owner, rotation. A variable absent here is a defect wherever it appears |
| deployment/substrate-swap.md | derived | What the TanStack Start + Cloudflare swap changed, and the five-criterion check it still owes |
| engine/BUILD.md | derived | The engine's ordered build steps, and that Convex is the substrate from the start |
| engine/INTERFACES.md | derived | The engine's three seams: the harness contract above, travel and storage below, the display projection sideways |
| engine/README.md | derived | The engine package's purpose and read order |
| engine/SCENARIOS.md | derived | The engine's deterministic acceptance suite — every item holds or the build fails |
| engine/SPEC.md | SPEC | The store and the math of record: commitments, latches, the rule menu, availability, travel, placement |
| harness/BUILD.md | derived | How a fresh session turns the harness SPEC into a working tested harness, against stubs only |
| harness/COMPAT.md | SPEC | The RQ-13 compatibility policy and the closed refusal-reason vocabulary — the one home for both, authored ahead of Step 8 so stub declines have a contract |
| harness/INTERFACES.md | derived | The contracts the harness depends on across three seams, the stubs that stand in for them, and the inbound external-client surface |
| harness/NOTES.md | never | Harness backlog scratchpad — only what is still genuinely open |
| harness/README.md | derived | The harness package's read order — the first thing a builder opens |
| harness/SCENARIOS.md | derived | The harness acceptance suite in Given/When/Then, tagged `[MUST]` and `[HELD-OUT]` |
| harness/SPEC.md | SPEC | The harness layer's law: the loop, the tool contract, elicitation, the clarify/permission floor, the assisted off-app path, the external-client surface |
| marketplace/BUILD.md | derived | That the marketplace builds last, after all four layers, and what must be green first |
| marketplace/INTERFACES.md | derived | The marketplace's four seams, under the constraint of zero new seam verbs |
| marketplace/NOTES.md | never | Marketplace backlog scratchpad, including the open rulings OR-28 and OR-29 |
| marketplace/README.md | derived | The marketplace package's read order and its FROZEN status |
| marketplace/SCENARIOS.md | derived | The marketplace acceptance suite, run against the service mock only |
| marketplace/SPEC.md | SPEC | The open half of the store: skins and templates on shared publish/browse/install rails, and the authorship law |
| model/BUILD.md | derived | The model layer's ordered steps, and that Steps 1–5 want a built harness first |
| model/EVALS.md | derived | The model's exam: the sets, seed items, thresholds, and grading rules — graded, not pass/fail |
| model/INTERFACES.md | derived | The model's two seams — harness above, providers below — neither side trusted |
| model/README.md | derived | The model package's purpose: contract-and-exam level, consumed only by the harness |
| model/SPEC.md | SPEC | What any candidate model must satisfy, the BYO confinement, and that `summarize` is app-supplied always |
| model/spike/README.md | derived | What `run-nset.mjs` measures, and that it is one number rather than a qualification |
| security/BUILD.md | derived | Security's ordered steps, each naming its scenario gate and the foreign build step it rides |
| security/INTERFACES.md | derived | Who owns each security control, under the constraint of zero new seam verbs |
| security/README.md | derived | The security package's read order, doubling as the external posture statement |
| security/SCENARIOS.md | derived | The attack suite: each scenario an adversary move that must fail, or a guarantee that must hold |
| security/SPEC.md | SPEC | The cross-cutting security law: threat model, token and PII law, the injection quarantine, compliance posture |
| user-stories/README.md | SPEC | That the Situations are the requirements source-of-truth, are founder proof scripts, and are never deleted |
| user-stories/Situations/Situation-A-prime/README.md | SPEC | The marketplace probe, solo half — what installing from the store must do for one person |
| user-stories/Situations/Situation-A-prime/situation-1.md | SPEC | The install run: suggestion, ghost preview, blanked-parameter install, first booking, uninstall, one refusal |
| user-stories/Situations/Situation-A/README.md | SPEC | The whole-life probe: one person's entire life on one board, no market, no other operator |
| user-stories/Situations/Situation-A/customer.md | SPEC | What the off-app student experiences — a link, and only the outward slice of Sofia's board |
| user-stories/Situations/Situation-A/situation-1.md | SPEC | The clean run: Sofia's life and work on one board, students booking into time she is genuinely free |
| user-stories/Situations/Situation-A/situation-2.md | SPEC | The same week before annnä, across four apps that never share a truth |
| user-stories/Situations/Situation-A/situation-3.md | SPEC | Situation A's edges — what must work, and what must be refused |
| user-stories/Situations/Situation-A/situation-4.md | SPEC | The correction run: a wrong normalization caught at read-back, a rule edit's blast radius shown first, a draft abandoned harmlessly (scripted) |
| user-stories/Situations/Situation-A/situation-5.md | SPEC | Months later: the ledger's month rolls over, a series reaches week twenty, and a dense board finally tests the peace promise (scripted) |
| user-stories/Situations/Situation-A/story-sofia.md | SPEC | Sofia's own first-person telling — the whole-life requirement stated as lived experience |
| user-stories/Situations/Situation-B/README.md | SPEC | The self-service rental probe: interchangeable units, and a customer who pulls rather than books |
| user-stories/Situations/Situation-B/customer.md | SPEC | What the off-app traveller does — drives the booking themselves, against a hold with a clock |
| user-stories/Situations/Situation-B/operator-shop.md | SPEC | How a rental shop sets up: publishes an inventory link and lets the customer pull |
| user-stories/Situations/Situation-B/resource-bike.md | SPEC | How the motorbike sets up, and the unit state machine holds, buffers, and license classes ride on |
| user-stories/Situations/Situation-B/situation-1.md | SPEC | The clean run: four concurrent pulls, every hold clearing, a race resolved silently |
| user-stories/Situations/Situation-B/situation-2.md | SPEC | The same afternoon on a paper ledger, a WhatsApp thread, and keys on a hook |
| user-stories/Situations/Situation-B/situation-3.md | SPEC | Situation B's edges — the state machine at its boundaries, and the app saying no out loud |
| user-stories/Situations/Situation-C-prime/README.md | SPEC | The marketplace probe, multi-resource half — a dive center's board standing up from an empty account |
| user-stories/Situations/Situation-C-prime/situation-1.md | SPEC | Standing the shop up from the dive-center bundle, and the refusal guarding the door |
| user-stories/Situations/Situation-C/README.md | SPEC | The dive-economy probe: the cast, the market, and the fiction notice governing every name in it |
| user-stories/Situations/Situation-C/customer.md | SPEC | What the off-app diver does — one form, one language, and never the app again |
| user-stories/Situations/Situation-C/operator-agent.md | SPEC | How a referral agent sets up: owns nothing, sells only what a center it refers to can run |
| user-stories/Situations/Situation-C/operator-dive-center-second-seat.md | SPEC | The second seat at Hug Ocean — Fon and Gop under one board, and the questions a plural desk surfaces (scripted) |
| user-stories/Situations/Situation-C/operator-dive-center.md | SPEC | How a dive center sets up, and that it adds its own resources through the same forms a one-of-one fills |
| user-stories/Situations/Situation-C/resource-air.md | SPEC | How a fill station sets up, over the shared air template |
| user-stories/Situations/Situation-C/resource-boat.md | SPEC | How a day boat sets up — the one resource whose setup genuinely differs, because each runs a different weekly route |
| user-stories/Situations/Situation-C/resource-divemaster.md | SPEC | That a divemaster is an instructor with a narrower rating, not a separate resource kind |
| user-stories/Situations/Situation-C/resource-gear.md | SPEC | How a rental gear shop sets up, over the shared gear template |
| user-stories/Situations/Situation-C/resource-instructor.md | SPEC | How an instructor sets themselves up: rating, languages, specialties, free/busy |
| user-stories/Situations/Situation-C/resource-pool.md | SPEC | How a training pool sets up, over the shared pool template |
| user-stories/Situations/Situation-C/situation-1.md | SPEC | The clean run: a whole week placed in one pass, own resources first, reaching past only when they cannot cover |
| user-stories/Situations/Situation-C/situation-2.md | SPEC | The same week as the industry runs it today — close to two dozen phone calls |
| user-stories/Situations/Situation-C/situation-3.md | SPEC | Specialty matching down three axes at once: rating, then language, then who is actually free |
| user-stories/Situations/Situation-C/situation-4.md | SPEC | The honest dead-end: no match exists, and annnä says so instead of promising |
| user-stories/Situations/Situation-C/situation-5.md | SPEC | The realistic middle — the minimal-adoption world v1 launches into, where the prepared call replaces the reach |
| user-stories/Situations/Situation-C/situation-6.md | SPEC | The second-seat run: TingTing goes home and the desk keeps working — two humans on one board for the first time (scripted) |
| user-stories/Situations/Situation-D/README.md | SPEC | The location probe: a schedule that moves through space, where the gap between commitments is a drive |
| user-stories/Situations/Situation-D/customer.md | SPEC | What the off-app patient sees — when *and where* Debra can treat, never the route behind it |
| user-stories/Situations/Situation-D/situation-1.md | SPEC | The clean run, centered on the compaction: a cancellation becomes a checked proposal and a reclaimed afternoon |
| user-stories/Situations/Situation-D/situation-2.md | SPEC | The same week on a paper book, a phone, and a head that holds the map |
| user-stories/Situations/Situation-D/situation-3.md | SPEC | Situation D's edges — predictions to verify that the general primitives absorb location |
| user-stories/Situations/Situation-D/story-debra.md | SPEC | Debra's own first-person telling — "a schedule that knows where I am" |
| user-stories/Situations/Situation-E/README.md | SPEC | The held-out ER probe: annnä was deliberately not designed to this domain, so every claim is a prediction |
| user-stories/Situations/Situation-E/customer.md | SPEC | The ER case as it arrives — a prediction to verify, not a met requirement |
| user-stories/Situations/Situation-E/operator-er.md | SPEC | The autonomy envelope an institution authors, so annnä can run the board unattended inside it |
| user-stories/Situations/Situation-E/resource-room.md | SPEC | The prediction that a room is expressible as an admission rule plus capacity on existing atoms |
| user-stories/Situations/Situation-E/resource-staff.md | SPEC | Two held-out primitives: an ordering over principals (seniority), and a competitive request that can lose (the bid) |
| user-stories/Situations/Situation-E/situation-1.md | SPEC | The predicted ceiling — what annnä would make possible if the four primitives are truly general |
| user-stories/Situations/Situation-E/situation-2.md | SPEC | The same ER today: a human scheduler, a magnetic whiteboard, and a phone tree |
| user-stories/Situations/Situation-E/situation-3.md | SPEC | The must-work predictions, one primitive at a time — a failure names which general primitive is missing |
| user-stories/Situations/Situation-E/situation-4.md | SPEC | The must-refuse predictions, and the one that matters most: an autonomous annnä stops at the edge of its authority |
| user-stories/_briefs/situation-d-debra.md | history | The elicitation brief that produced Situation D, written to pressure-test the engine |
