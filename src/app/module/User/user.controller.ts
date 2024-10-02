import { Request, Response } from "express";
import { userServices } from "./user.services";

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getUserByEmail = catchAsync(async (req, res) => {
  const result = await userServices.getSingleUser(req.params.email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.updateUser(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your profile updated successfully",
    data: result,
  });
});

const verifyUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.verifyUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User verified successfully",
    data: result,
  });
});

const followUser = catchAsync(async (req: Request, res: Response) => {
  const { followerId } = req.body;
  const followingId = req.params.id;

  const result = await userServices.followUser(followerId, followingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User followed successfully",
    data: result,
  });
});

const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const { followerId } = req.body;
  const followingId = req.params.id;

  const result = await userServices.unfollowUser(followerId, followingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User unfollowed successfully",
    data: result,
  });
});

// favorite post
const favoritePost = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const postId = req.params.id;

  const result = await userServices.favoritePost(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post added to favorites successfully",
    data: result,
  });
});

// unfavorite post
const unfavoritePost = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const postId = req.params.id;

  const result = await userServices.unfavoritePost(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post removed from favorites successfully",
    data: result,
  });
});

// get user favorites posts
const getUserFavoritesPosts = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result = await userServices.getUserFavorites(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User favorites retrieved successfully",
      data: result,
    });
  }
);

export const userController = {
  getUserByEmail,
  getAllUsers,
  updateUser,
  verifyUser,
  followUser,
  unfollowUser,
  favoritePost,
  unfavoritePost,
  getUserFavoritesPosts,
};
