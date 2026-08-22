import type { AppSeam, SendOutcome } from "../seams.js";

// AppStub — INTERFACES.md §5: record-and-return spies. Assert the payload and
// its reversibility class; simulate `on_form_return`. Async per the seam's law
// (INTERFACES.md §1) — the spies record synchronously and resolve immediately.
//
// The escalation ladder's per-rung notifications ride this same spy, which is
// why asserting *who was notified, when, on which rung* needs no new stub
// (INTERFACES.md §5).
//
// Extended to the printed §3.3 roster 2026-08-22 (the review's U-022): the
// contract's return legs are load-bearing — `publish`'s minted[] digest leg,
// `send`'s immediate outcome union, `import_fetch` — and the file previously
// pinned void where the suite must assert a return. The contract stood; the
// code moved.
export class AppStub implements AppSeam {
  readonly calls: Array<{ call: string; payload: unknown }> = [];

  /** Scripted next outcomes, settable per test; defaults are the happy path. */
  nextSendOutcome: SendOutcome = { outcome: "sent" };
  nextImportFetch:
    | { items: unknown[]; provider_status: string }
    | { unavailable: true }
    | { timeout: true } = { items: [], provider_status: "ok" };

  /** The inbound rides (INTERFACES.md §3.3): a test registers the harness's
   *  trigger entry here, then drives `simulateFormReturn` / the delivery-event
   *  fixture below. The stub owns no routing — it hands the event over. */
  onFormReturn?: (reply: unknown) => void;
  onDeliveryReport?: (event: unknown) => void;

  private mintCounter = 0;

  async render(payload: unknown) {
    this.calls.push({ call: "render", payload });
  }

  async publish(payload: unknown, recipients?: unknown) {
    this.calls.push({ call: "publish", payload: { payload, recipients } });
    const list = Array.isArray(recipients) ? recipients : [];
    return {
      artifact: payload,
      minted: list.map((r) => ({
        digest: `digest-${++this.mintCounter}`,
        bound_to: String(r),
      })),
    };
  }

  async send(payload: unknown, recipient?: unknown): Promise<SendOutcome> {
    this.calls.push({ call: "send", payload: { payload, recipient } });
    return this.nextSendOutcome;
  }

  async import_fetch(connection_ref: unknown) {
    this.calls.push({ call: "import_fetch", payload: connection_ref });
    return this.nextImportFetch;
  }

  async display_settings(diff: unknown): Promise<{ ok: true }> {
    this.calls.push({ call: "display_settings", payload: diff });
    return { ok: true };
  }

  /** Simulated form return — the trigger source the guest flow rides. */
  simulateFormReturn(reply: unknown) {
    this.onFormReturn?.(reply);
  }

  /** The delivery-event fixture: an out-of-band `complaint` or late
   *  `delivered-failed` arriving AFTER a send resolved — the sixth trigger
   *  source (SPEC.md §4), previously unsimulatable from this stub. */
  simulateDeliveryReport(event: { kind: "complaint" | "delivered-failed"; ref: unknown }) {
    this.onDeliveryReport?.(event);
  }

  /** The one outward-effect assertion Step 0 already needs a shape for: a
   *  re-entry may re-commit but never re-fires an already-attributed act
   *  (SPEC.md §7). Counting is the whole mechanism. */
  countOf(call: string) {
    return this.calls.filter((c) => c.call === call).length;
  }
}
