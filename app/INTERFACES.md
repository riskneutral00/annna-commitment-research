# annnä App — INTERFACES (the seams)

*Two seams: **upward** (satisfy the contract the harness already pinned — `../harness/INTERFACES.md §3`, verbatim) and **downward** (the substrates the app itself stands on). The upward seam is the layer's acceptance boundary: the stub-swap (`BUILD.md` final gate) proves the real app slots in with **zero harness changes**.*

---

## §1. Upward — the harness seam, satisfied

Every obligation of `../harness/INTERFACES.md §3`, mapped to where this package answers it:

| Harness obligation (§3.x) | App answer |
|---|---|
| §3.1 `render(surface: board \| commitment-page \| console, payload)` | `SPEC.md §1` (surface → canvas state, incl. the riser-IS-commitment-page mapping), `§2` (board), `§3` (console) |
| §3.2 `render_generative(schema)` — fixed catalog, LLM composes never invents | `SPEC.md §4` (catalog discipline, rejected-render poka-yoke, manifest) |
| §3.3 `publish(shared, recipients?)` — board-blind export, per-recipient tokens | `SPEC.md §5` (guest pages; blindness by construction) |
| §3.3 `notify_and_await(form_payload, recipient)` — outward, crosses the floor | `SPEC.md §6` (email + hand-me-the-link; card-visible in §3) |
| §3.3 `on_form_return(reply) → Event` — trigger source, token attribution | `SPEC.md §5` (submission), `§6` (recording) |
| §3.4 App-only views, no harness logic | `SPEC.md §7` (the four disowned views plus appearance, read-only by construction) |

**Events the app emits back** — all through existing seam shapes, zero new verbs: form returns (`on_form_return`), delivery results — the immediate outcomes returning on the `notify_and_await` call itself, **and the out-of-band `complaint` / late `delivered-failed`, which the app emits as a delivery-report event that fires the harness's sixth trigger source** (`../harness/INTERFACES.md §3.3`; row completed 2026-08-21 — the complaint previously had no inbound path in either direction of this seam) — owner confirmations/dismissals of surfaced cards (ordinary utterance/act inputs to the loop), and the guest manage-state's cancel/move submissions (`SPEC.md §5`, riding `on_form_return`'s token-attributed shape). The app also stamps each console utterance with the active canvas state — the **view-context** `{surface, visible_range?, selected_ref?}` — so the harness's standing frame carries the correct `surface` **and the deictic referent** ("push this back an hour" resolves against `selected_ref`) (`SPEC.md §1`; `../harness/INTERFACES.md §2.1`). This rides the existing `normalize` context contract, not a new call.

**Zero new seam verbs, zero harness changes.** If building ever demands one, stop and flag — that contradicts the lock in `../.specs/deep-interview-app.md`.

## §2. Downward — the substrates

Named here (and in `BUILD.md`/`DESIGN.md` mechanics) only — `SPEC.md` stays substrate-neutral. Each is a binding the spec constrains but doesn't depend on by name:

- **TanStack Start** (TanStack Router on Vite) — one codebase: the owner canvas (behind auth) + the guest token routes (outside auth). Mobile-first responsive; no native shells v1. **Ruled under FD-11**, replacing Next.js; **the printed five-criterion check it owes is at `BUILD.md` Step 0** — the home, on the Convex precedent (`../engine/BUILD.md` Step 0). *The ruling did not exempt the substrate from the check: if a criterion fails when it is first built against, the ruling reopens.* The requirement this row encodes — one codebase serving an authenticated canvas and unauthenticated token routes — is what `SPEC.md` constrains, and it is framework-independent.
- **Convex** — the reactive backend, **ratified under FR7 at `../engine/BUILD.md` Step 0** (which holds the printed five-criterion check — the home; a substrate change re-runs it there, not here): live subscriptions are what make the board update in real time when a booking lands. What the app subscribes to is **engine-published display projections only** (`../engine/SPEC.md` §0 sole-client carve) — never raw engine truth. The store may end up shared; the readable set never is.
- **Clerk** — owner sessions only. Guests never authenticate: the capability token in the URL is the whole credential (`SPEC.md §5`).
- **Astryx + glass theme** — the component substrate of the fixed catalog (`SPEC.md §4`) and the design-system mechanics in `DESIGN.md`. Strict adoption per the 2026-07-25 ruling; glass rides as a theme. **The pin** *(founder-approved; verified against the npm registry 2026-08-06)*: **`@astryxdesign/core@0.3.0`** with **`@astryxdesign/cli@0.3.0`** (the CLI tracks core exactly) and the theme package pinned to the same version — theme packages peer-pin core **exactly**, not as a range, so all three move together. `@stylexjs/stylex` is a **peer dependency** (`^0.19.0` at core 0.3.0 — re-check per version: earlier releases shipped it as a regular dependency at a different range); React ≥ 19. Cadence, honestly: ~weekly releases with a breaking change in most minors, mitigated by first-party `astryx upgrade` codemods — which is exactly why the churn re-measure law (`BUILD.md`) exists and why the pin never floats.
- **Resend** — the v1 email channel (`SPEC.md §6`). Swappable; the seam shape (send-or-hand-over + recorded result) doesn't change per provider.
- **Cloudflare** (Workers) — hosting. Pure BUILD concern; ruled under FD-11 with TanStack Start. The rung law it has to satisfy is `../deployment/SPEC.md §3`, which names no provider.
- **Marketplace service** (seam spec: `../marketplace/INTERFACES.md`) — the catalog / entitlement / signed-URL source for store skins and templates. The app consumes typed catalog documents and renders them; it never talks payment. **Absent or unreachable → the shipped four skins + Plain, and every installed template keeps working** (installed = local forked data). Mocked in CI, always.
- **The vault** (seam spec: `../security/INTERFACES.md §2`) — the encrypted object store for guest artifacts (passports, medical documents, waivers). Guest uploads stream to it directly; the app serves artifacts only via logged, basis-carrying reads. Mocked in CI (in-memory vault, virtual clock).

## §3. What the app OWNS (and what it must never absorb)

- **Owns:** rendering every surface; the canvas state machine (board/risers/console/islands); the catalog manifest and the schema→component mapping; guest token routes; delivery transport + recording; the four app-only views; starter templates and saved-locations surfaces.
- **Never absorbs:** the floor and grants decisions (harness); elicitation, narration, judgment (harness/model); any deterministic math — availability, gaps, quota, placement (engine); truth of any kind (engine). If the app is computing a value someone could act on, that's a defect.

## §4. Stub strategy — from spies to the real thing

The harness suite runs against app stubs that are **record-and-return spies** (`../harness/INTERFACES.md §5`): they assert the payload and reversibility class, and simulate `on_form_return`. Swap-parity means the real app preserves exactly the **contract-visible** behavior the spies asserted:

- `render`/`render_generative`: the real app accepts every payload the spies accepted and rejects what they rejected (unknown node types) — the visual output is new, the contract behavior identical.
- `publish`: real token URLs replace canned artifacts; blindness and attribution properties hold on real responses.
- `notify_and_await`/`on_form_return`: real email/hand-over replaces the spy's simulation; returns still fire the loop with token attribution.

The app's own `SCENARIOS.md` runs headless where possible (payload/wire assertions) and drives the rendered canvas only where the scenario is about the canvas itself.

The **marketplace service stub** is a canned catalog + entitlement map (`../marketplace/INTERFACES.md §5`); appearance scenarios S6/S7 run against it both present and absent.
