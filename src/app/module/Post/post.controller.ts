import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { postServices } from "./post.services";

const createPost = catchAsync(async (req, res) => {
  const result = await postServices.createPost(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
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
  const result = await postServices.vote(req.params.id, req.body.voteType);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vote recorded successfully",
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
};
