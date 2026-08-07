# Harness — ideas captured from the user stories

*Backlog file. On **2026-08-05** the six original items were folded into the spec package (with the video-lens findings and this session's story primitives) — each now lives in `SPEC.md` with scenario coverage. What remains below is only what is still genuinely open.*

## Folded (pointers, not content)

| Former item | Now lives at |
|---|---|
| Sharing availability = sharing inventory | SPEC §3.2 (Board), §3.6 (Shared = published inventory) |
| Generative-UI template-matching + Lego customization | SPEC §5 (generative-UI row), §6 (T2 authoring) · SCENARIOS G6 |
| Flexible constraints ("max per day") | SPEC §3.5 `quota` rule type (limit over a recurring window, scoped — merged with Sofia's per-student monthly allowance) · SCENARIOS B5. The old "for me / per student / per link" question is the quota's **scope** parameter, resolved per rule by propose-with-scope |
| Per-recipient unique identifier | SPEC §3.6 (per-recipient token) · INTERFACES §3.3 · SCENARIOS H6 |
| Implicit recurrence + cancel→rebook + the asymmetry | SPEC §6 (implicit recurrence), §7 (cancellation asymmetry) · SCENARIOS H7–H8 |
| Events consume availability; tasks don't | already structural (SPEC §3.4 roles) · SCENARIOS A5 |
| Token generation/securing for per-recipient links | `../security/SPEC.md §3` (the capability-token law: minting, digests, lifetimes, revocation, enumeration safety) · app pointer at `../app/SPEC.md §5`. The harness contract still only requires attribution (H6). *(Folded 2026-08-06.)* |

## Still open

- **`engine/SPEC.md §1.3` gains an `owner` author member when next edited.** Provenance's `author` vocabulary gained `owner` at its one normative home (`SPEC.md §3.4`), so no `engine/` edit was made from this pass. `../engine/SPEC.md §1.3` stays true as written — its inline author list is illustrative, and §3.4 is the home — but whoever next edits that section should add `owner` where it enumerates authors. Not a blocker: nothing in the engine spec enumerates the full vocabulary.
