import type { AppSeam, Clock, EngineSeam, ModelSeam } from "./seams.js";
import { makeClock } from "./clock.js";
import { EngineStub } from "./stubs/engine.js";
import { ModelStub, type ModelScript } from "./stubs/model.js";
import { AppStub } from "./stubs/app.js";

// THE INJECTION POINT (BUILD.md Step 0). The stubs slot in now and the real
// adapters slot in at the swap, with ZERO harness changes — that is what makes
// the stub-swap a drop-in rather than an edit (engine/SCENARIOS.md Z2).
//
// The same point injects the virtual clock the stubs and the real engine share,
// which is why it is one `wire()` and not three unrelated factories: a clock
// handed to the harness but not to the engine would let the two disagree about
// what time it is, and every expiry scenario rests on them agreeing.

export type Harness = { engine: EngineSeam; model: ModelSeam; app: AppSeam; clock: Clock };

export function makeEngine(canned: Record<string, unknown> = {}): EngineSeam {
  return new EngineStub(canned);
}

export function makeModel(script: ModelScript = {}): ModelSeam {
  return new ModelStub(script);
}

export function makeApp(): AppSeam {
  return new AppStub();
}

/** Assemble a harness. Every argument is optional and defaults to a stub, so a
 *  test that cares about one seam does not have to construct the other two —
 *  and an adapter can be passed for any single seam without touching the rest,
 *  which is the property Step 0's verify asserts. */
export function wire(parts: Partial<Harness> = {}): Harness {
  return {
    engine: parts.engine ?? makeEngine(),
    model: parts.model ?? makeModel(),
    app: parts.app ?? makeApp(),
    clock: parts.clock ?? makeClock(),
  };
}
