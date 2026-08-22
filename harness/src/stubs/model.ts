import type { ModelSeam, SourceTag } from "../seams.js";

// ModelStub — INTERFACES.md §5, harness/BUILD.md Step 0.
//
// FOUR scripted calls, not three: normalize, narrate, judgment-inside-those,
// and summarize (§2.4). Deterministic and scenario-keyed; no real model, no
// randomness, no cost. Async per the seam's law (INTERFACES.md §1).
//
// The failure fixture is the part that is easy to skip and must not be: a
// scenario key whose summarize fails on EVERY attempt including the fallback,
// so L7's fail-closed path is reachable rather than vacuously green. Without
// it L7 passes by never being exercised, which is the failure BUILD.md Step 0
// names in its own words.

export type ModelScript = {
  normalize?: Record<string, { intent: string; fields: Record<string, unknown>; ambiguities: string[] }>;
  narrate?: Record<string, string>;
  summarize?: Record<string, { summary: string; labels: string[] }>;
};

/** The reserved key. `summarize` on this input fails on every attempt including
 *  the fallback — the fixture L7 needs to have anything to fail against. */
export const SUMMARIZE_ALWAYS_FAILS = "__quarantine_always_fails__";

export class ModelStub implements ModelSeam {
  readonly calls: Array<{ call: string; args: unknown[] }> = [];

  constructor(private readonly script: ModelScript = {}) {}

  async normalize(utterance: string, context: unknown) {
    this.calls.push({ call: "normalize", args: [utterance, context] });
    return this.script.normalize?.[utterance] ?? { intent: "unknown", fields: {}, ambiguities: [] };
  }

  async narrate(structure: unknown) {
    this.calls.push({ call: "narrate", args: [structure] });
    return this.script.narrate?.[JSON.stringify(structure)] ?? "";
  }

  async summarize(raw_text: string, source_tag: SourceTag) {
    this.calls.push({ call: "summarize", args: [raw_text, source_tag] });
    if (raw_text === SUMMARIZE_ALWAYS_FAILS) {
      // Rejects rather than resolving anything. A stub that returned a degraded
      // summary here would let the raw text through with a warning attached,
      // which SCENARIOS.md L7 says explicitly fails the scenario.
      throw new Error("summarize failed on every attempt including the fallback");
    }
    const scripted = this.script.summarize?.[raw_text];
    if (!scripted) throw new Error(`summarize has no script for this input — fail closed rather than guess`);
    return scripted;
  }
}
