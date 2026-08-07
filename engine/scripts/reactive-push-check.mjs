// Step 0 reactive-push gate (INTERFACES §2.2, the criterion that degrades
// silently to polling if unchecked): subscribe to a published projection, then
// commit a change, and assert the subscriber is PUSHED the new value without
// asking again. Runs against the real dev deployment (subscriptions are real).
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

await sleep(2000); // initial subscription value (expect 0)
const beforeCount = pushes.length;
await client.mutation(api.scaffold.bump, { key }); // the commit that changes the projection
await sleep(3000); // wait for the server to PUSH the new value
unsub();
await client.close();

const last = pushes[pushes.length - 1];
if (pushes.length > beforeCount && last >= 1) {
  console.log(`REACTIVE-PUSH OK: subscriber received ${JSON.stringify(pushes)} without re-querying`);
  process.exit(0);
}
console.error(`REACTIVE-PUSH FAIL: pushes=${JSON.stringify(pushes)} beforeCount=${beforeCount}`);
process.exit(1);
