import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Get the current user
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Get the current user + oauth providers theyre connected to
export const getUserWithAccounts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const accounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const platforms = accounts.map((account) => account.provider);

    return {
      ...user,
      platforms,
    };
  },
});

// Update the user's email (right now kind of pointless since only oauth is available)
export const updateUserEmail = mutation({
  args: { userId: v.id("users"), newEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;

    await ctx.db.patch("users", args.userId, {
      email: args.newEmail,
    });
  },
});

// Update the user's username
export const updateUserName = mutation({
  args: { userId: v.id("users"), newName: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;

    await ctx.db.patch("users", args.userId, {
      name: args.newName,
    });
  },
});

// Disconnect the user from a specific platform (just delete the oauth field their account is connected with)
export const deletePlatform = mutation({
  args: { userId: v.id("users"), platform: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;

    const accounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const platform = accounts.find(
      (account) => account.provider === args.platform,
    );

    if (!platform) {
      return null;
    } else {
      await ctx.db.delete("authAccounts", platform?._id);
    }
  },
});

// Delete the user
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Delete the user from the authAccounts table
    const authAccounts = ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    for (const acc of await authAccounts) {
      await ctx.db.delete("authAccounts", acc._id);
    }

    // Delete the user from authSessions
    const authSessions = ctx.db
      .query("authSessions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    for (const acc of await authSessions) {
      ctx.db.delete("authSessions", acc._id);
    }

    // Delete the user from the "users" table
    await ctx.db.delete("users", args.userId);
  },
});
