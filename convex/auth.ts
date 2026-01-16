import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      profile(githubProfile) {
        return {
          id: String(githubProfile.id),
          name: githubProfile.name,
          email: githubProfile.email,
          image: githubProfile.avatar_url,
        };
      },
    }),
    Google({
      profile(googleProfile) {
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      const { email, name, image } = args.profile as {
        email?: string;
        name?: string;
        image?: string;
      };

      if (args.existingUserId) {
        // Your “don’t overwrite name/image” policy here
        // e.g. only patch if currently null:
        const existing = await ctx.db.get(args.existingUserId);
        if (!existing) return args.existingUserId;

        const patch: any = {};
        if (!existing.name && name) patch.name = name;
        if (!existing.image && image) patch.image = image;

        if (Object.keys(patch).length > 0) {
          await ctx.db.patch(args.existingUserId, patch);
        }
        return args.existingUserId;
      }

      // Your custom account-linking logic (e.g. by email)
      if (email) {
        const byEmail = await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", email))
          .unique();
        if (byEmail) return byEmail._id;
      }

      return ctx.db.insert("users", {
        name: name ?? undefined,
        email: email ?? undefined,
        image: image ?? undefined,
        emailVerificationTime: args.profile.emailVerified
          ? Date.now()
          : undefined,

        // any other fields in your custom users schema
      });
    },
  },
});
