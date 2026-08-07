import { defineConfig } from "vitest/config";

// convex-test runs engine functions in-memory (no deployment) under the
// edge-runtime environment. Deterministic: no test reads wall time or the
// network — the virtual clock and scripted travel provider (tests/harness.ts)
// stand in. Any replay flake is an engine bug (TDD/engine.md).
export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
  },
});
