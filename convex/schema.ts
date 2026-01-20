import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    liked: v.optional(
      v.array(
        v.object({
          song: v.any(),
          created_at: v.number(),
        }),
      ),
    ),
    saved: v.optional(
      v.array(
        v.object({
          song: v.any(),
          created_at: v.number(),
        }),
      ),
    ),
    discover: v.optional(
      v.array(
        v.object({
          title: v.string(),
          query: v.string(),
        }),
      ),
    ),
    // other "users" fields...
  }).index("email", ["email"]),
});
