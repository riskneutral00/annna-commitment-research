# .specs/ — decision-lock interview records

> ⚠️ **Not law, and not a plan.** These are transcripts of the interviews that *pinned* a
> package's open questions before it was written. Where one disagrees with the package it
> produced, **the package `SPEC.md` wins** — the spec is what was built from, the interview
> is only how the decisions were reached. Start at the [root README](../README.md).

Before each layer package was authored, its unresolved design questions were put to the
founder one at a time until the remaining ambiguity was small enough to write from. What
survives here is the record of that: the goal as agreed, the constraints, the non-goals,
the acceptance criteria, and the assumptions that were exposed and then closed.

They are kept for one reason — **to answer "why is it like this?" without guessing.** A
law in a `SPEC.md` that looks arbitrary usually has an answer here, in the founder's own
terms and dated.

| File | Package it locked | Date |
|---|---|---|
| [`deep-interview-engine.md`](deep-interview-engine.md) | [`engine/`](../engine/) — the store and the deterministic math on it | 2026-08-05 |
| [`deep-interview-app.md`](deep-interview-app.md) | [`app/`](../app/) — the one-canvas owner surface, guest pages, delivery | 2026-08-05 |

**Two further interview records exist on the founder's machine and are deliberately not
published** — they are gitignored, not missing. One is a process post-mortem about how two
agent sessions collided over who owned a plan; the other is personal identity material
whose whole value depends on not being public. Neither locks any law in this corpus, and
nothing here cites them. If you grep the `.gitignore` and find their names, that is the
whole of what there is to find.

*Interviews are not run for every package. `harness/`, `model/`, `marketplace/`,
`deployment/` and `security/` were settled in the design history ([`archive/`](../archive/))
or by direct founder ruling ([`RULINGS.md`](../RULINGS.md)).*
