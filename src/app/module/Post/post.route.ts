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

export const postRoutes = router;
