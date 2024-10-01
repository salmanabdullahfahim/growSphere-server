import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { postValidations } from "./post.validation";
import { postController } from "./post.controller";

const router = express.Router();

router.post(
  "/create-post",

  validateRequest(postValidations.createPostSchema),
  postController.createPost
);

router.patch(
  "/update-post/:id",

  validateRequest(postValidations.updatePostSchema),
  postController.updatePost
);

router.delete(
  "/:id",

  postController.deletePost
);

router.get("/:id", postController.getPost);

router.get("/", postController.getPosts);

router.get("/user/:id", postController.getPostsByUser);

router.post(
  "/:id/comments",

  validateRequest(postValidations.commentSchema),
  postController.addComment
);

router.post(
  "/:id/vote",

  validateRequest(postValidations.voteSchema),
  postController.vote
);

router.patch(
  "/:postId/comments/:commentId",

  validateRequest(postValidations.editCommentSchema),
  postController.editComment
);

router.delete("/:postId/comments/:commentId", postController.deleteComment);

export const postRoutes = router;
