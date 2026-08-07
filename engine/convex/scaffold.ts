import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// A published projection (read-only view a subscriber watches) and a commit
// that changes it. Used only to prove reactive push at Step 0 (SPEC §0 carve,
// INTERFACES §2.2 hard criterion). Superseded by the real §1 objects in Step 1.

export const liveN = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const row = await ctx.db
      .query("scaffold")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    return row?.n ?? 0;
  },
});

export const bump = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const row = await ctx.db
      .query("scaffold")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (row) await ctx.db.patch(row._id, { n: row.n + 1 });
    else await ctx.db.insert("scaffold", { key, n: 1 });
  },
});
