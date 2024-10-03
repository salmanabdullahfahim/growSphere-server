import httpStatus from "http-status";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";
import AppError from "../../errors/AppError";
import { createToken } from "./auth.utils";
import config from "../../../config";
import { Document } from "mongoose";

const signUp = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload?.email);
  //  check if the user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // check if the password is matched

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not matched");
  }

  // create access token

  const jwtPayload = {
    // @ts-expect-error
    id: user?._id,
    email: user?.email,
    role: user?.role,
    isVerified: user?.isVerified,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Convert user to Mongoose Document to access toObject methods
  const userDocument = user as Document & TUser & { toObject: () => TUser };
  const userObject = userDocument.toObject();
  delete userObject.password; // Remove password field

  return {
    accessToken,
    user: userObject,
  };
};

export const authService = {
  signUp,
  loginUser,
};
