import type { AppSeam } from "../seams.js";

// AppStub — INTERFACES.md §5: record-and-return spies. Assert the payload and
// its reversibility class; simulate `on_form_return`. Async per the seam's law
// (INTERFACES.md §1) — the spies record synchronously and resolve immediately.
//
// The escalation ladder's per-rung notifications ride this same spy, which is
// why asserting *who was notified, when, on which rung* needs no new stub
// (INTERFACES.md §5).
export class AppStub implements AppSeam {
  readonly calls: Array<{ call: string; payload: unknown }> = [];

  async render(payload: unknown) {
    this.calls.push({ call: "render", payload });
  }

  async publish(payload: unknown) {
    this.calls.push({ call: "publish", payload });
  }

  async send(payload: unknown) {
    this.calls.push({ call: "send", payload });
  }

  async display_settings(diff: unknown): Promise<{ ok: true }> {
    this.calls.push({ call: "display_settings", payload: diff });
    return { ok: true };
  }

  /** The one outward-effect assertion Step 0 already needs a shape for: a
   *  re-entry may re-commit but never re-fires an already-attributed act
   *  (SPEC.md §7). Counting is the whole mechanism. */
  countOf(call: string) {
    return this.calls.filter((c) => c.call === call).length;
  }
}
