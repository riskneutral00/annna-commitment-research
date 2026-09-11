# annnä Security — spec package

*The cross-cutting security law: the threat model, the token and PII law, the injection quarantine, the compliance posture — binding all four layers (`../README.md`) and the marketplace. This README doubles as the **external posture statement**; the four files behind it are the build law.*

***This package is engineering preparation, not legal advice. A formal legal review before launch is a named, hard build gate (`BUILD.md` Step 8).***

---

## The posture, in plain words

annnä schedules people's lives and their customers' bookings. Its specification protects private time, contact details, structured sensitive answers and consent evidence, including data from guests who never made an account. Owner/guest file uploads and participant-document authentication are excluded from v1 (`SPEC.md §4`). These are build requirements; implemented proof and remaining gates are stated below.

- **Roles are conditional on the actual operating entity and relationship.** For admitted guest data, the owner's business is the controller and annnä is the processor where that relationship applies; annnä's own account and marketplace processing is assessed separately. The actual operating entity, markets, purposes, recipients and lawful duties require the reviewed matrix and formal legal review (`SPEC.md §12`, `BUILD.md` Step 8).
- **Privacy coverage follows the actual operating entity, markets and data flows.** GDPR, Thailand PDPA and Taiwan PDPA are among the regimes to research where relevant; adopting one regime's design does not declare another jurisdiction covered. Medical data takes explicit consent and dedicated encryption; age/minor and guardian treatment follows the legally reviewed entity/market/minor matrix (`SPEC.md §12`).
- **Guests use scoped links without accounts.** The same page offers a form, availability and template-bound console (`../harness/SPEC.md §2`; `../app/SPEC.md §5`). Credential-derived data and executor limits (`SPEC.md §3`), source quarantine (§5) and finite conversation bounds (§10) keep it within the authorized request; it is no unrestricted guest assistant. Saved contacts confer neither access nor send authority.
- **Sensitive-data custody and finite retention remain required.** `SPEC.md §4` distinguishes admitted answers, attributed reports and approved source forms from excluded uploads. Stored policy provenance and start/deadline coverage apply to completed and unfinished flows; owners choose within permitted bounds. An attestation records who declared a class and when, never participant authentication. Artifact bytes stay outside engine/seam payloads, identifying history takes keyed erasure, and vault encryption keys remain outside the store they unlock (`INTERFACES.md §2`; X4).
- **Every string entering the AI carries its source, and raw non-owner text never reaches the model that can act.** A guest's note is something the owner reads, not something the agent obeys: the raw text is read only by a quarantined, tool-less model, and what remains — a hostile document can still shape the summary — is bounded by the floor, because even a successful injection could only *propose*: every irreversible act requires the acting party's valid explicit basis (`../harness/SPEC.md §7`); guest permission stays within `SPEC.md §3`. *(Reworded 2026-08-21 to §5's own terms — isolation removes the raw-text path, not the summary path, and no restatement may claim otherwise.)*
- **The AI cannot author correctness values, move money, or delete records — structurally.** Deterministic code answers times, prices, and availability; no tool transfers value; no model/tool performs general domain deletion. Security §3's engine-owned cleanup is the narrow exception for expired, unused single-visitor records, with activity, holds, bookings, history and management access fenced from it. You can persuade a concierge; you cannot persuade the book.
- **The store sells data, never code.** Marketplace items are validated documents; the worst installed item is a bad one, never a program.

## Claim → construction

| Posture claim | Constructed at |
|---|---|
| Processor frame + owner compliance tooling | `SPEC.md §12` |
| Applicable roles, regimes, jurisdictions and legal-review gate | `SPEC.md §12`, `BUILD.md` Step 8 |
| Guest surface = credential-scoped form, availability and template-bound console | `SPEC.md §2–§3`; `../app/SPEC.md §5` |
| Unused visitor passes expire after 24 hours; narrow cleanup only | `SPEC.md §3`; `SCENARIOS.md` T7; `../app/SCENARIOS.md` G5/G8/G9 |
| Exclusion, admitted-data custody, policy-bound clocks and attributed receipts | `SPEC.md §4`; `INTERFACES.md §2` |
| Injection quarantine | `SPEC.md §5`; harness context assembly |
| AI structurally limited | `../harness/SPEC.md §7` (the floor); `../engine/SPEC.md §4` (handles) |
| Store sells data, never code | `../marketplace/SPEC.md §0` |

## The pentest target list

The honest attack surface, enumerated in advance — each with the scenario family that patrols it (`SCENARIOS.md`):

| Surface | Family |
|---|---|
| Guest token routes (enumeration, reuse, races, caching) | T |
| The guest form and scoped console — admitted fields, free text, model-context isolation and limits | V, Q, S, R |
| The email channel (volume, bounce, content) | R |
| The owner session | §2 posture; floor-bounded |
| The separately authenticated admin identity, publish pipeline and non-forgeable internal ops/clock authority | M |
| The model's context (injection) | Q |
| The external-client surface (the fifth token class) | T9, harness X-family |
| The shared store's tenant line | N |
| The vault (access, destruction, key handling) | V |
| The closed marketplace service | out of repo scope — named, specced privately |

## Status

**Source contracts and scenario obligations are specified; application security is not established by those documents.** `BUILD.md` Step 0 records X1's implemented secret-grep gate and previously fired canary. That evidence covers its declared file/identifier scan only; it does not establish X2–X5, a working guest page, vault retention/erasure, quarantine or provider behavior. Admitted-data clocks and key custody remain Step 3 obligations, guest capture remains app Step 5, and quarantine remains security Step 1 at harness Step 5. Upload-dependent fixture arms defer with the excluded feature; their custody protections survive. Provider obligations, the compliance pack and formal legal review remain at their named gates, including Step 8. No design-complete or launch-ready claim follows from a green offline repository check.

## For builders: read order

1. **`SPEC.md`** — the laws: threat model, identity, tokens, the vault, quarantine, consent, secrets, DR & exits, tenants, abuse, admin, compliance, invariants.
2. **`INTERFACES.md`** — who owns each control (every one rides an existing seam — zero new verbs); the vault seam, the one new substrate.
3. **`SCENARIOS.md`** — the attack suite, with active obligations and explicitly deferred upload-dependent fixture arms.
4. **`BUILD.md`** — when each control lands relative to the four layers' builds, ending at the legal-review gate.
