# The app substrate — what the swap changed, and what it still owes

*The app substrate is **TanStack Start + Cloudflare**, ruled 2026-08-08 as **FD-11** (`../RULINGS.md`). The swap was executed the same day: every site that named Next.js or Vercel now names the current substrate, except the ones deliberately kept as history. **The ruling is not a ratification** — the printed five-criterion check it owes is at `../app/BUILD.md` Step 0 and has not been run. Until it has, no document may call this substrate ratified.*

*This file is not law. It is the swap's record and the research map for the sessions that build against it. Rerun the commands in §6 before trusting any line number here.*

---

## 1. The headline: the swap reached no law

`Vercel` and `Next.js` appeared in **nine files** across the entire folder. **Not one was a `SPEC.md`**, so the swap edited build instructions, two seam tables and two gate scripts — and changed no rule about what any layer *is*.

That was not luck. `app/INTERFACES.md`'s preamble promised it: the spec says what the layer is, and a substrate is named only where a build has to name one. `app/SPEC.md` still describes the one-canvas surface, guest token pages and display projections without naming a framework or a host; `deployment/SPEC.md` still describes rungs, landing law and the spec/code boundary without naming one.

**This is the property to protect, and it is checkable:**

```bash
grep -rniE "next\.?js|vercel|tanstack|cloudflare|wrangler" --include=SPEC.md .   # must stay empty
```

If a future substrate edit lands in any `SPEC.md`, stop. Either the spec grew a substrate leak that should be fixed on its own terms, or the edit belongs in that layer's `INTERFACES.md` or `BUILD.md`. **The next swap is only as cheap as this line staying empty.**

---

## 2. What changed, by kind

### 2.1 The seam tables — where a substrate is *declared*

| Site | Now |
|---|---|
| `../app/INTERFACES.md` | **TanStack Start** (TanStack Router on Vite), carrying the FD-11 citation and pointing at the Step-0 check it owes |
| `../app/INTERFACES.md` | **Cloudflare** (Workers) — hosting, still labelled a pure BUILD concern |
| `INTERFACES.md` | The **Cloudflare** rung row — per-change preview, protected production (R7) |

The requirement each row encodes did not move: one codebase serving an authenticated canvas and unauthenticated token routes; a per-change preview rung; a production rung that refuses anonymous access. **The provider is the current answer to the requirement, never the requirement itself** — which is why these rows now name what they replaced, so the next reader can see that a substitution happened rather than assuming the corpus was always this way.

### 2.2 The build instructions — where a substrate is *used*

`../app/BUILD.md` preamble and Step 0 · `BUILD.md` preamble, Step 2's preview rung, R6's canary, R9's rung-config note · `env-manifest.md`'s preview rung · `README.md`'s substrate list.

`BUILD.md` **Step 2 is still not closed**, and it is the step that stands the preview rung up. **The swap therefore cost only text.** Had it been ruled after Step 2 was worked, it would have cost a rung rebuild — that was the real deadline on this decision, and it was a state, not a date.

### 2.3 The two gate scripts — where a substrate is *asserted in code*

These were not the same job, and treating them as one would have left a hole.

- **`scripts/r9-noindex-nodebug.mjs`** — `RUNG_CONFIGS` is the gate's *definition* of "a rung config." It now lists `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`. The gate still reports **not-yet-constructible**, correctly: no rung config exists until Step 2 writes one. **A host swap that forgets this line leaves the gate hunting a file nothing will ever write — permanently not-yet-constructible, which reads like patience and is a dead gate.**
- **`scripts/r6-deploy-secret-scoping.mjs`** — `CLOUDFLARE` was added to the `DEPLOY_SECRET` pattern, and a `CLOUDFLARE_API_TOKEN` case was added to the selfcheck. **Before that edit the pattern matched no Cloudflare secret at all**, so the swap would have left R6 green while it stopped catching the one thing it exists to catch. `VERCEL` was **kept, not replaced**: a leftover token from a former provider is still a deploy secret, and provider names in a secret matcher should only ever accumulate.

### 2.4 The provenance record — annotated, never rewritten

`../.specs/deep-interview-app.md` is an interview transcript: what was asked and answered on a date. It keeps its original text and carries superseded-by notes. Two things worth knowing:

- Its framework answer rejected **static-first** frameworks for a live authenticated app. TanStack Start is client-first React, so **that reasoning was never overturned** — what changed is the choice inside the live-React family.
- Its line recording hosting as *"Assumed (BUILD-only, flagged not asked)"* is the most load-bearing line in the file: the corpus admitting in its own words that the host was inherited from a default and never chosen. **A flagged assumption is worth more than a quiet one** — that flag is what made this swap cheap to reason about long after the fact.

`.specs/` is **tracked** (`git ls-files .specs/`), despite `../AGENTS.md`'s caveat listing that directory among the gitignored material. Check before assuming either way.

---

## 3. Vocabulary that would leak a framework without naming one

The sweep for framework-flavoured language naming no framework — `middleware`, `edge runtime`, `serverless`, `ISR`, `server component`, `route handler` — returns **one** hit, in `../security/SPEC.md §10`, and it is generic English (*"limits are declared objects… not ad-hoc middleware"*). Nothing to change.

Two places state substrate-independent law a swap must not weaken:

- **`../app/SPEC.md §5` — no guest page is served from a build-time snapshot.** Written as law precisely so no host's build default can defeat token revocation. **Cloudflare's TanStack Start prerendering makes exactly this easy**, which is why the obligation sits on the route and is asserted at the guest-page gate rather than inherited from a default.
- **`../app/SPEC.md §10` and `../app/BUILD.md`'s stub-swap gate** — the app holds no logic and the harness must not notice the app changing. **This is what made the framework cheap to get wrong**, and it stops being true the day the app layer stops being thin.

---

## 4. The ratification this still owes

`../engine/BUILD.md` Step 0 is the pattern: Convex was ruled by founder decision **and then checked**, against five printed criteria, in a table a later reader re-derives instead of inheriting. The rule that came out of it: *the ruling did not exempt the substrate from the check; if any row fails at build time, the ruling reopens.*

**FD-11 owes the same table and does not have a result in it yet.** The five criteria are printed at `../app/BUILD.md` Step 0, fixed before either candidate is tried: Convex live subscriptions reaching the browser · Clerk sessions and unauthenticated token routes in one codebase · the Astryx pin installing and building unmodified · no token route served from a build-time snapshot · a preview rung and a protected production rung.

**Until that table is filled in, the honest word is *ruled*, not *ratified*.** A corpus that describes a check it never ran is the defect this repo has caught in itself repeatedly; do not add another instance.

---

## 5. Where to research TanStack Start and Cloudflare

**Read this before searching the open web.** These are the sources a prior session gathered and read; start here, and treat anything found elsewhere as needing the same verification. Version and pricing facts go stale fast — **re-check every number against the primary source and record the date you checked it**, because a figure copied forward without a date is the drift class this repo's gates exist to catch.

### Primary — the substrate's own documentation

- Cloudflare — TanStack Start framework guide · <https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/>
- Cloudflare Vite plugin · <https://developers.cloudflare.com/workers/vite-plugin/>
- Cloudflare Workers limits · <https://developers.cloudflare.com/workers/platform/limits>
- Cloudflare Workers pricing · <https://developers.cloudflare.com/workers/platform/pricing/>
- TanStack Start hosting guide · <https://tanstack.com/start/latest/docs/framework/react/guide/hosting>

### The integrations that must hold — check these before anything else

The app is only as portable as its three seams, and these are criteria 1–3 of the Step-0 table. **A failure here reopens FD-11; it is not a detail to work around.**

- Convex + TanStack Start · <https://docs.convex.dev/client/tanstack/tanstack-start/>
- Convex + TanStack Start + Clerk · <https://docs.convex.dev/client/tanstack/tanstack-start/clerk>
- StyleX Vite installation · <https://stylexjs.com/docs/learn/installation/vite> — StyleX is Astryx's peer dependency (`../app/INTERFACES.md`), so this is the pin's survival path.

*Known-stale trap — corrected 2026-08-22, and the correction is the sharper lesson: the "Release Candidate" prose was **right** and the npm number was the misleading half. `@tanstack/react-start` rides TanStack Router's shared 1.x version line, so its major number was never a maturity signal; as of 2026-08-22 the framework's own docs still read Release Candidate ("feature-complete, API stable"). **A shared version line makes the major number meaningless as a maturity signal: read the framework's own stability statement, and record the date you read it.** Keep `npm view` for version facts; never as a maturity oracle. (The two rough-edge issues once listed here both closed: workers-sdk#9622 on 2025-10-08, router#4255 on 2025-09-23 — annotated, not deleted, because a closed issue with a date beats an absent one.)*

### Known rough edges — read the failure reports, not only the guides

- Cloudflare changelog — TanStack Start prerendering · <https://developers.cloudflare.com/changelog/2025-12-19-tanstack-start-prerendering> — **read against `../app/SPEC.md §5`**, which forbids on a token route exactly what this makes easy.
- Cloudflare changelog — auxiliary Workers · <https://developers.cloudflare.com/changelog/2026-01-20-auxiliary-workers>
- `cloudflare/workers-sdk#9622` — TanStack Start's Vite migration broke the Workers integration · <https://github.com/cloudflare/workers-sdk/issues/9622>
- `TanStack/router#4255` — server functions with API routes on Cloudflare · <https://github.com/TanStack/router/issues/4255>

### The predecessor's security record — why the comparison had a security half

- Vercel's own postmortem, Next.js middleware bypass (CVE-2025-29927) · <https://vercel.com/blog/postmortem-on-next-js-middleware-bypass>
- JFrog analysis · <https://jfrog.com/blog/cve-2025-29927-next-js-authorization-bypass/>
- Datadog Security Labs analysis · <https://securitylabs.datadoghq.com/articles/nextjs-middleware-auth-bypass/>

*Kept after the swap on purpose: this class of vulnerability — an auth check defeated by a header at the framework's own boundary — is a property of frameworks in general, not of one vendor. The next reader should know what it looks like, not conclude it was left behind.*

### How to check a version or cadence claim

Do not trust a prose description of a release state, in any source, including this file:

```bash
npm view @tanstack/react-start version time.created dist-tags
npm view @astryxdesign/core@0.3.0 peerDependencies dependencies
```

---

## 6. How to re-derive the sweep

Run both. The second exists because a framework can be bound by vocabulary as well as by name.

```bash
grep -rn -iE "vercel|next\.js|nextjs|next\.config|app router" . \
  --exclude-dir=.git --exclude-dir=node_modules
grep -rn -iE "tanstack|cloudflare|wrangler" . \
  --exclude-dir=.git --exclude-dir=node_modules
```

After the swap, the first should return only: FD-11's own text, the two seam rows naming what they replaced, the annotated `.specs/` transcript, `r9`'s explanatory comment, and `r6`'s retained `VERCEL` pattern and fixtures. **Anything else is a survivor.**
