import { defineConfig } from "vitest/config";
import TranscriptReporter from "../deployment/scripts/transcript-reporter.mjs";

// Deterministic by construction: no test reads wall time (the steppable virtual
// clock stands in — INTERFACES.md §5) and no test reaches the network. Any
// replay flake is a harness bug (../TDD.md §Harness).
//
// The transcript reporter writes .tmp/transcripts/harness.txt, which is what
// deployment B9 byte-compares across two runs.
export default defineConfig({
  test: {
    reporters: ["default", new TranscriptReporter("harness")],
  },
});
