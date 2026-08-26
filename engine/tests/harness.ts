// The determinism harness for the engine scenario suite (../TDD.md §Engine).
// Every scenario runs the real engine in-memory against these stubs: a virtual
// clock and a scripted travel provider (INTERFACES §4). Nothing sleeps or reads
// wall time; a replay flake is an engine bug.
import { convexTest } from "convex-test";
import schema from "../convex/schema";

// convex-test discovers function modules via import.meta.glob (vitest feature).
const modules = import.meta.glob("../convex/**/*.*s");

/** A fresh in-memory engine store for one scenario. */
export function engine() {
  return convexTest(schema, modules);
}

/** Virtual clock — steppable, deterministic. Injected wherever the engine
 *  would read time (holds, expiry, horizon jobs, min-occupancy triggers). */
export function makeClock(startMs: number) {
  let now = startMs;
  return {
    now: () => now,
    advance: (ms: number) => (now += ms),
    set: (ms: number) => (now = ms),
  };
}

/** Scripted travel provider — the INTERFACES §2.1 stub. A table keyed by
 *  `${a}|${b}|${atBucketMs}` → duration(ms). A miss returns null =
 *  `unavailable`, which the engine treats as unknown and fails closed. */
export function makeTravel(table: Record<string, number>) {
  return (a: string, b: string, atBucketMs: number): number | null => {
    const key = `${a}|${b}|${atBucketMs}`;
    return table[key] ?? null;
  };
}
