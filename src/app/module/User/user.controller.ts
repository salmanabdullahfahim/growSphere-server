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

export const userController = {
  getUserByEmail,
  updateUser,
};
