import { defineConfig } from "vitest/config";
import TranscriptReporter from "../deployment/scripts/transcript-reporter.mjs";

// convex-test runs engine functions in-memory (no deployment) under the
// edge-runtime environment. Deterministic: no test reads wall time or the
// network — the virtual clock and scripted travel provider (tests/harness.ts)
// stand in. Any replay flake is an engine bug (TDD/engine.md).
export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    // Writes .tmp/transcripts/engine.txt for deployment B9's twice-run
    // byte-compare. Sorted names and statuses only — no durations.
    reporters: ["default", new TranscriptReporter("engine")],
  },
});
