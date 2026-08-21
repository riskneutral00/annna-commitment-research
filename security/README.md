# annnä Security — spec package

*The cross-cutting security law: the threat model, the token and PII law, the injection quarantine, the compliance posture — binding all four layers (`../README.md`) and the marketplace. This README doubles as the **external posture statement**; the four files behind it are the build law.*

***This package is engineering preparation, not legal advice. A formal legal review before launch is a named, hard build gate (`BUILD.md` Step 8).***

---

## The posture, in plain words

annnä schedules people's lives and their customers' bookings — which means it holds a person's private time, and documents as sensitive as passports and medical notes, for guests who never made an account. The posture:

- **annnä is a processor for guest data.** The business using annnä (the dive shop, the teacher) is the controller of what its customers submit; annnä handles that data on the business's behalf and gives it the tools to meet its duties — consent capture, retention control, a real deletion path. annnä is a controller only for its own user accounts and store purchases.
- **Built to GDPR as the ceiling**, with Thailand PDPA named (the anchor businesses are Thai) and Taiwan PDPA covered by the same design. Medical data takes explicit consent and dedicated encryption; minors take guardian consent.
- **Guests never get accounts or agents.** A guest touches one tokenized page and one form — the attack surface of a guest is one link, by construction.
- **Sensitive documents live in an encrypted vault with destruction clocks, never in the permanent record.** The permanent record keeps only the attestation — "passport verified, this date." Keep the receipt, shred the document.
- **Every string entering the AI carries its source, and raw non-owner text never reaches the model that can act.** A guest's note is something the owner reads, not something the agent obeys: the raw text is read only by a quarantined, tool-less model, and what remains — a hostile document can still shape the summary — is bounded by the floor, because even a successful injection could only *propose*: every irreversible act requires the owner's explicit basis. *(Reworded 2026-08-21 to §5's own terms — isolation removes the raw-text path, not the summary path, and no restatement may claim otherwise.)*
- **The AI cannot author correctness values, move money, or delete records — structurally.** Deterministic code answers times, prices, and availability; no tool transfers value; no tool deletes. You can persuade a concierge; you cannot persuade the book.
- **The store sells data, never code.** Marketplace items are validated documents; the worst installed item is a bad one, never a program.

## Claim → construction

| Posture claim | Constructed at |
|---|---|
| Processor frame + owner compliance tooling | `SPEC.md §12` |
| GDPR ceiling; named jurisdictions; legal-review gate | `SPEC.md §12`, `BUILD.md` Step 8 |
| Guest surface = one token, one form | `SPEC.md §2–§3`; `../app/SPEC.md §5` |
| Vault, clocks, attestations | `SPEC.md §4`; `INTERFACES.md §2` |
| Injection quarantine | `SPEC.md §5`; harness context assembly |
| AI structurally limited | `../harness/SPEC.md §7` (the floor); `../engine/SPEC.md §4` (handles) |
| Store sells data, never code | `../marketplace/SPEC.md §0` |

## The pentest target list

The honest attack surface, enumerated in advance — each with the scenario family that patrols it (`SCENARIOS.md`):

| Surface | Family |
|---|---|
| Guest token routes (enumeration, reuse, races, caching) | T |
| The guest form — uploads and free text | V, Q, S |
| The email channel (volume, bounce, content) | R |
| The owner session | §2 posture; floor-bounded |
| The admin identity & publish pipeline | M |
| The model's context (injection) | Q |
| The external-client surface (the fifth token class) | T9, harness X-family |
| The shared store's tenant line | N |
| The vault (access, destruction, key handling) | V |
| The closed marketplace service | out of repo scope — named, specced privately |

## Status

**Design complete; the build has begun and is early.** The laws are specced and the suite is written; of the suite, **X1 is built and its canary has been fired for real** (`BUILD.md` Step 0 — the CI secret-grep gate), and everything else waits on the layer steps it rides. *(This line previously said "zero lines of code exist," which Step 0's own record contradicted — corrected 2026-08-21.)* The posture above describes what the build must construct, and the suite is how anyone — including an external reviewer — will know it did.

## For builders: read order

1. **`SPEC.md`** — the laws: threat model, identity, tokens, the vault, quarantine, consent, secrets, DR & exits, tenants, abuse, admin, compliance, invariants.
2. **`INTERFACES.md`** — who owns each control (every one rides an existing seam — zero new verbs); the vault seam, the one new substrate.
3. **`SCENARIOS.md`** — the attack suite, ten families, every scenario MUST.
4. **`BUILD.md`** — when each control lands relative to the four layers' builds, ending at the legal-review gate.
