# annnä Model layer — spec package (contract-and-exam level)

annnä is four layers — **Model / Harness / Engine / App** (the full map: [`../README.md`](../README.md)) — and this folder is the Model layer. Its only consumer is the **Harness**, which wraps every model call; the model never touches the Engine, the App, or a user directly.

The model layer is the only layer we don't build — **models are selected and steered, not written**. annnä runs on imported LLMs behind the harness's per-call seam. This package defines the **contract** any candidate model must satisfy and the **exam** that proves a given model+prompt combination is good enough. The exam is the product of this layer: it is what makes "swap the brain, keep the body" safe rather than hoped.

Read in this order:

1. **`SPEC.md`** — the contract: the four calls (producer side), the intent vocabulary, ambiguity calibration, narration fidelity, judgment boundaries, voice, supply & routing (OpenRouter primary; ChatGPT-subscription slot — cut, FD-65; BYO API keys, FR5 — attended-only, FR31, **narrowed so that `narrate` a third party reads is always app-supplied** *(status: drafted at its home §7)*), failure behavior — **one ladder for every failure, and the cost cap's outcome** *(status: drafted at its home §8)* — and what this layer must never do.
2. **`INTERFACES.md`** — the two seams: upward (satisfy `../harness/INTERFACES.md §2`) and downward (the provider seam: **the adapter contract every provider enum member satisfies**, plus the routing config and the judge block beside it).
3. **`EVALS.md`** — the exam (this layer's SCENARIOS equivalent — **graded, statistical**, not deterministic pass/fail): eval sets per call type, thresholds, and the qualification procedure every model/prompt/routing change must pass before going live.
4. **`BUILD.md`** — the ordered plan. **Dependency-honest:** most steps want the *built* harness (real prompts against real traffic); only the eval scaffold and seed sets are useful before it. Step 0 also carries the **snapshot-custody mechanism** — part of **FD-84** (Drafted 2026-08-28, not ratified — pending FD-84), as Step 0 itself records; how a recorded firing is made, kept and replayed keylessly — and the footprint of the spike's eventual removal.

**Definition of done (for this layer, eventually):** a qualified routing config — every call type bound to a model that passes its EVALS thresholds, with a fallback, at acceptable cost — plus the qualification procedure wired so any later swap re-runs the exam.

**Deliberately NOT here:** prompt text (waits for the built harness), model training/fine-tuning (never), correctness logic (engine), permission logic (harness floor).

**Why the package stops at this shape — recorded, not asked** *(2026-08-29)*. `model/` sits at the ruled package shape and goes no smaller. `../AGENTS.md` §Package shape is law, and `../deployment/scripts/package-shape.mjs` enforces it across all seven packages — **declaring this package's `EVALS.md`-for-`SCENARIOS.md` substitution as the one deviation, in the gate's own source**, alongside its model-specific assertions. Collapsing below that shape would red that gate and strand every reader of the seven-package symmetry, which is the thing that makes any package here predictable to open. `spike/` stays for the same kind of reason: it is a **live referent** — `../deployment/egress-allowlist.md`'s caller row, `../deployment/env-manifest.md`'s `MODEL` row and DR-7's close condition all name it — and its removal is `BUILD.md` Step 0's build-time act, with its footprint written down there, not a consolidation act (FD-5: it spends money on every execution and is deliberately unrun). Wanting this package below the ruled shape is a change to `../AGENTS.md` and to the gate — a ruling, not a tidy-up.

Glossary for M1/M2/M3/T2/H1/H2: `../harness/README.md`.
