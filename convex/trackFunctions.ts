import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Like or unlike track
export const likeOrUnlikeTrack = mutation({
  args: {
    userId: v.id("users"),
    track: v.any(),
    operation: v.union(v.literal("like"), v.literal("dislike")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;
    const currentLiked = user.liked || [];
    let currentLikedIds = [];
    if (user.liked) {
      currentLikedIds = user.liked.map((obj) => obj.song.id) || []; // Handle case where liked doesn't exist yet
    }

    if (args.operation === "like") {
      if (!currentLikedIds?.includes(args.track.id)) {
        await ctx.db.patch("users", args.userId, {
          liked: [
            ...currentLiked,
            { song: args.track, created_at: Date.now() },
          ],
        });
      }
    } else if (args.operation === "dislike") {
      await ctx.db.patch("users", args.userId, {
        liked: currentLiked.filter((t) => t.song.id !== args.track.id),
      });
    }
  },
});

// Save or unsave track
export const saveOrUnsaveTrack = mutation({
  args: {
    userId: v.id("users"),
    track: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;
    const currentSaved = user.saved || []; // Handle case where liked doesn't exist yet
    let savedIds = [];
    if (user.saved) {
      savedIds = user.saved.map((obj) => obj.song.id);
    }

    if (!savedIds.includes(args.track.id)) {
      await ctx.db.patch("users", args.userId, {
        saved: [...currentSaved, { song: args.track, created_at: Date.now() }],
      });
    } else {
      await ctx.db.patch("users", args.userId, {
        saved: currentSaved.filter((t) => t.song.id !== args.track.id),
      });
    }
  },
});
