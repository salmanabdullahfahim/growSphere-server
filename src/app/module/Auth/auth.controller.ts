import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

const signUp = catchAsync(async (req, res) => {
  const result = await authService.signUp(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);
  const { accessToken } = result;
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: accessToken,
    data: result.user,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { id, password } = req.body;
  const result = await authService.changePassword(id, password);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgetPassword(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reset password link is generated successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

export const authController = {
  signUp,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
