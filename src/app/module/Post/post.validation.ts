import { z } from "zod";

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1),
    author: z.string({ required_error: "Author is required" }),
    category: z.string(),
    isPremium: z.boolean(),
    images: z.array(z.string().url()),
  }),
});

const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    content: z.string().min(1).optional(),
    category: z.string().optional(),
    isPremium: z.boolean().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

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
