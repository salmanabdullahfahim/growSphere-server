import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { postValidations } from "./post.validation";
import { postController } from "./post.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/create-post",

  auth(USER_ROLE.user),
  validateRequest(postValidations.createPostSchema),
  postController.createPost
);

router.patch(
  "/update-post/:id",

  auth(USER_ROLE.user),
  validateRequest(postValidations.updatePostSchema),
  postController.updatePost
);

router.delete(
  "/:id",

  auth(USER_ROLE.user, USER_ROLE.admin),

  postController.deletePost
);

router.get("/:id", auth(USER_ROLE.user), postController.getPost);

router.get("/", auth(USER_ROLE.user, USER_ROLE.admin), postController.getPosts);

router.get("/user/:id", auth(USER_ROLE.user), postController.getPostsByUser);

router.post(
  "/:id/comments",

  validateRequest(postValidations.commentSchema),
  postController.addComment
);

router.post(
  "/:id/vote",

  auth(USER_ROLE.user),
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
