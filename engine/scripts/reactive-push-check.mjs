// Step 0 reactive-push gate (INTERFACES §2.2, the criterion that degrades
// silently to polling if unchecked): subscribe to a published projection, then
// commit a change, and assert the subscriber is PUSHED the new value without
// asking again. Runs against the real dev deployment (subscriptions are real).
//
// THE PRE-MUTATION ZERO (deployment/SPEC.md §7a item 10, fixed 2026-08-21).
// `beforeCount` used to be sampled after a fixed two-second sleep and nothing
// asserted what it held: if the subscription's first callback had not arrived
// yet, the mutation fired, one callback arrived carrying the new value, and the
// check reported OK on `pushes.length > beforeCount` — which proves a query
// result was delivered once, not that a change was PUSHED to a subscriber who
// never asked again. That is exactly the silent degradation to polling the
// criterion exists to catch. The subscription's own first value is now WAITED
// for rather than slept for, and asserted zero before the mutation is allowed
// to fire; a first callback that already carries a non-zero value fails the
// check rather than passing it.
//
// Usage: node reactive-push-check.mjs <deployment-url>
import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const url = process.argv[2];
if (!url) {
  console.error("FAIL: pass the deployment URL as argv[2]");
  process.exit(2);
}

const key = `reactive-${Date.now()}`;
const client = new ConvexClient(url);
const pushes = [];
const unsub = client.onUpdate(api.scaffold.liveN, { key }, (n) => pushes.push(n));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (cond, ms) => {
  for (const deadline = Date.now() + ms; Date.now() < deadline && !cond(); ) await sleep(100);
  return cond();
};

async function stop(code, message) {
  unsub();
  await client.close();
  (code ? console.error : console.log)(message);
  process.exit(code);
}

// 1. the subscription's own first value — waited for, then asserted zero.
if (!(await until(() => pushes.length > 0, 15000))) {
  await stop(1, `REACTIVE-PUSH FAIL: no initial subscription value in 15s. The subscription never delivered anything, so nothing below can be read as a push.`);
}
const beforeCount = pushes.length;
if (beforeCount !== 1 || pushes[0] !== 0) {
  await stop(
    1,
    `REACTIVE-PUSH FAIL: the pre-mutation state is not a single zero — pushes=${JSON.stringify(pushes)}. ` +
      `The key is fresh, so anything else means this run cannot tell a pushed change from a first read that already contained it.`,
  );
}

// 2. the commit that changes the projection, and the push it must produce.
await client.mutation(api.scaffold.bump, { key });
const pushed = await until(() => pushes.length > beforeCount, 15000);
const last = pushes[pushes.length - 1];
if (pushed && last >= 1) {
  await stop(0, `REACTIVE-PUSH OK: subscriber saw ${JSON.stringify(pushes)} — a pre-mutation zero, then the new value pushed without re-querying`);
}
await stop(1, `REACTIVE-PUSH FAIL: pushes=${JSON.stringify(pushes)} beforeCount=${beforeCount}`);
