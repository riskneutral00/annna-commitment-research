# annnä Model layer — spec package (contract-and-exam level)

annnä is four layers — **Model / Harness / Engine / App** (the full map: [`../README.md`](../README.md)) — and this folder is the Model layer. Its only consumer is the **Harness**, which wraps every model call; the model never touches the Engine, the App, or a user directly.

The model layer is the only layer we don't build — **models are selected and steered, not written**. annnä runs on imported LLMs behind the harness's per-call seam. This package defines the **contract** any candidate model must satisfy and the **exam** that proves a given model+prompt combination is good enough. The exam is the product of this layer: it is what makes "swap the brain, keep the body" safe rather than hoped.

Read in this order:

1. **`SPEC.md`** — the contract: the three calls (producer side), the intent vocabulary, ambiguity calibration, narration fidelity, judgment boundaries, voice, supply & routing (OpenRouter primary; ChatGPT-subscription slot), failure behavior, and what this layer must never do.
2. **`INTERFACES.md`** — the two seams: upward (satisfy `../harness/INTERFACES.md §2`) and downward (the provider seam: OpenRouter + the routing config contract).
3. **`EVALS.md`** — the exam (this layer's SCENARIOS equivalent — **graded, statistical**, not deterministic pass/fail): eval sets per call type, thresholds, and the qualification procedure every model/prompt/routing change must pass before going live.
4. **`BUILD.md`** — the ordered plan. **Dependency-honest:** most steps want the *built* harness (real prompts against real traffic); only the eval scaffold and seed sets are useful before it.

**Definition of done (for this layer, eventually):** a qualified routing config — every call type bound to a model that passes its EVALS thresholds, with a fallback, at acceptable cost — plus the qualification procedure wired so any later swap re-runs the exam.

**Deliberately NOT here:** prompt text (waits for the built harness), model training/fine-tuning (never), correctness logic (engine), permission logic (harness floor).

Glossary for M1/M2/M3/T2/H1/H2: `../harness/README.md`.
