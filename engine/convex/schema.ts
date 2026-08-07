import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Bootstrap schema. The real engine object model (SPEC §1) lands in Step 1
// of the build; the `scaffold` table exists only to back the Step 0
// reactive-push gate (a published projection a subscriber watches).
export default defineSchema({
  scaffold: defineTable({ key: v.string(), n: v.number() }).index("by_key", ["key"]),
});
