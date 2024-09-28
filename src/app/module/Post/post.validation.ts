import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  category: z.string(),
  tags: z.array(z.string()),
  isPremium: z.boolean(),
  images: z.array(z.string().url()),
});

const updatePostSchema = createPostSchema.partial();

const commentSchema = z.object({
  content: z.string().min(1),
});

const voteSchema = z.object({
  type: z.enum(["upvote", "downvote"]),
});

export const postValidations = {
  createPostSchema,
  updatePostSchema,
  commentSchema,
  voteSchema,
};
