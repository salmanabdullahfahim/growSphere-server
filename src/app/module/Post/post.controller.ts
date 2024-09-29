import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { postServices } from "./post.services";

import AppError from "../../errors/AppError";

const createPost = catchAsync(async (req, res) => {
  const result = await postServices.createPost(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post created successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const result = await postServices.updatePost(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const result = await postServices.deletePost(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: result,
  });
});

const getPost = catchAsync(async (req, res) => {
  const result = await postServices.getPost(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: result,
  });
});

const getPosts = catchAsync(async (req, res) => {
  const result = await postServices.getPosts(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: result,
  });
});

const addComment = catchAsync(async (req, res) => {
  const result = await postServices.addComment(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment added successfully",
    data: result,
  });
});

const vote = catchAsync(async (req, res) => {
  const postId = req.params.id;

  const { voteType, userId } = req.body;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const result = await postServices.vote(postId, userId.toString(), voteType);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vote recorded successfully",
    data: result,
  });
});

const editComment = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const result = await postServices.editComment(
    postId,
    commentId,
    userId.toString(),
    content
  );

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Comment not found or you are not authorized to edit this comment"
    );
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const result = await postServices.deleteComment(
    postId,
    commentId,
    userId.toString()
  );

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Comment not found or you are not authorized to delete this comment"
    );
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const postController = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  addComment,
  vote,
  editComment,
  deleteComment,
};
