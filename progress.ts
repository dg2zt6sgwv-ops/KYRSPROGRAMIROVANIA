import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Get current user's progress; returns a default shape when nothing stored yet. */
export const getProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const doc = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!doc) {
      return { userId, lessonSlugs: [] as string[] };
    }
    return doc;
  },
});

/** Mark a lesson as completed for the current user (idempotent). */
export const completeLesson = mutation({
  args: { lessonSlug: v.string() },
  handler: async (ctx, { lessonSlug }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Требуется вход в систему");
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      if (existing.lessonSlugs.includes(lessonSlug)) return;
      await ctx.db.patch(existing._id, {
        lessonSlugs: [...existing.lessonSlugs, lessonSlug],
      });
    } else {
      await ctx.db.insert("progress", {
        userId,
        lessonSlugs: [lessonSlug],
      });
    }
  },
});

/** Un-complete a lesson (e.g. to redo the homework). */
export const resetLesson = mutation({
  args: { lessonSlug: v.string() },
  handler: async (ctx, { lessonSlug }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Требуется вход в систему");
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        lessonSlugs: existing.lessonSlugs.filter((s) => s !== lessonSlug),
      });
    }
  },
});
