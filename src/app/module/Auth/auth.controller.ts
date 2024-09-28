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

export const authController = {
  signUp,
  loginUser,
};
