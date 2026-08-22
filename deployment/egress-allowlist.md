# Egress allowlist

*The floor path named in `SPEC.md §7`. Outbound network calls in tracked code are confined to the files listed below; `scripts/egress-lint.mjs` fails the build on any other. **Adding a line here is a floor act** — a human reads it before it lands.*

**Why this file is markdown.** It is spec-class, so S2 (`SCENARIOS.md`) refuses to let a widened allowlist ride in the same commit as the code that widens it. The permission lands first, alone, where it is the only thing to read. A `.json` or `.txt` allowlist would be code-class and an agent could grant itself egress and use it in one commit — which is the exact move this floor exists to catch (`NOTES.md` S4: *a prompt-injected builder needs a network path out*).

## Allowed

| Path | What it calls, and why it is allowed |
|---|---|
| `engine/scripts/reactive-push-check.mjs` | Subscribes to a live Convex deployment to prove the reactive-push criterion (`../engine/BUILD.md` Step 0, I4). It is a **process gate, not product code** — it never ships, and it is the one check that cannot be proven in memory (`SPEC.md §8` DR-6). |
| `model/spike/run-nset.mjs` | Calls OpenRouter and **spends money on every execution** (FD-5; `SPEC.md §8` DR-7). Deliberately unrun, kept out-of-band from the wave order, and never on a product path. |

## Reserved — rows that land with a named build step

- **The calendar importer** (`../app/BUILD.md` Step 6a; FD-49, 2026-08-22): when the importer module exists, its three provider paths — the Google Calendar API, Microsoft Graph, and owner-supplied ICS hosts — join the Allowed table, **each row landing as its own floor act at that time**. The note exists now because the audit found the v1-ruled import capability with no presence in this document at all: a reader of the floor should meet the forthcoming rows before the code that needs them does.
- **The LINE delivery channel** (`../app/SPEC.md §6`; FD-61, 2026-08-22): when the automated-LINE send module exists, the LINE Messaging API path joins the Allowed table as its own floor act — the same discipline as the importer rows, for the same reason.
- **The WhatsApp delivery channel** (`../app/SPEC.md §6`; FD-74, 2026-08-23): when the automated-WhatsApp send module exists, the WhatsApp Business (Meta Graph) API path joins the Allowed table as its own floor act — the same discipline as the LINE row. WeChat and Instagram get **no reserved row**: their §6 hard-point records are the reason, and a row appears only if a record is lifted.
- **The Resend mail send path** (`../app/BUILD.md` Step 6; added 2026-08-22): when the delivery module exists, the Resend API path joins the Allowed table as its own floor act — the same discipline as the importer rows, for the same reason.

## Not on the list, deliberately

- **`engine/convex/**`** — Convex functions run *inside* the deployment; they make no outbound call today and needing one would be a design change, not a lint exception.
- **`deployment/scripts/**`** — every process gate is static and local by construction (`SPEC.md §1`, S3: no gate fetches what it checks). A gate that reached the network could be lied to by the network.
- **`assets/make-pack.mjs`** — reads and writes local files only.

## Bound

The lint reads **imports and call sites in tracked non-markdown files**. It does not and cannot prove network *absence* at runtime — that is S3's stated limit too (`SCENARIOS.md` S3: *egress absence is not provable on shared runners*). What it buys is that adding a network path to product code is a visible, separately-landed act rather than a line nobody noticed. Gated at **S3 clause (b)** (`SCENARIOS.md`, 2026-08-21).

**What the lint itself excludes** *(printed 2026-08-21 — the script's real exclusions and this document's "Not on the list" section were disjoint sets, so the human reading this floor document before widening egress never saw what the mechanism already waves through)*: the lint skips **its own source**, any path containing **`/_generated/`** (substrate-generated code), and a **binary/lockfile extension skip-list** (`.lock` among them). The "Not on the list" paths above pass today because they contain no matching call — they are *not* excluded, and a call appearing in one fails the lint, which is the correct direction. Known mechanism gap: **bare package specifiers are exempted from the import half** (`SPEC.md §7a` item 7) — a store client imported by package name passes until the sprint closes it.
