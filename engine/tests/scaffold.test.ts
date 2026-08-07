import { test, expect } from "vitest";
import { engine, makeClock, makeTravel } from "./harness";
import { api } from "../convex/_generated/api";

// Step 0 scaffold proof: the in-memory runner boots, a write reads back, and
// the determinism stubs behave. The real scenario families (A..O) land from
// Step 1 onward; attribution/provenance is proven with the §1 object model.

test("S0 in-memory store boots, a write reads back", async () => {
  const t = engine();
  expect(await t.query(api.scaffold.liveN, { key: "k" })).toBe(0); // empty store boots
  await t.mutation(api.scaffold.bump, { key: "k" }); // a write (diff)
  expect(await t.query(api.scaffold.liveN, { key: "k" })).toBe(1); // reads back
});

test("S0 virtual clock steps deterministically", () => {
  const clock = makeClock(1000);
  expect(clock.now()).toBe(1000);
  clock.advance(500);
  expect(clock.now()).toBe(1500);
});

test("S0 scripted travel provider: hit returns duration, miss is unavailable", () => {
  const travel = makeTravel({ "A|B|0": 600_000 });
  expect(travel("A", "B", 0)).toBe(600_000);
  expect(travel("A", "B", 999)).toBeNull(); // miss = unavailable → engine fails closed
});
