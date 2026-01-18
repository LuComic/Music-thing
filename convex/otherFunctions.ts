import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Update the discover field with a new array of customizations
export const updateDiscover = mutation({
  args: {
    userId: v.id("users"),
    customizations: v.array(
      v.object({
        title: v.string(),
        query: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;

    await ctx.db.patch("users", args.userId, {
      discover: args.customizations,
    });
  },
});
