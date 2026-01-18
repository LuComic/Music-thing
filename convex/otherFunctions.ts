import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Add customization in the discover field
export const customizeDiscover = mutation({
  args: {
    userId: v.id("users"),
    customization: v.object({
      title: v.string(),
      query: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;
    const currentDiscover = user.discover || [];

    await ctx.db.patch("users", args.userId, {
      discover: [...currentDiscover, args.customization],
    });
  },
});
