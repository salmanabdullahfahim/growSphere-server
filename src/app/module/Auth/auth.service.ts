import httpStatus from "http-status";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";
import AppError from "../../errors/AppError";
import { createToken } from "./auth.utils";
import config from "../../../config";
import { Document } from "mongoose";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

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

  if (user?.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This user account has been blocked"
    );
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

const changePassword = async (id: string, password: string) => {
  // Hash the new password
  const saltRounds = Number(config.bcrypt_salt_rounds);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Update the user with the hashed password
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user?.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This user account has been blocked"
    );
  }

  // create access token
  const jwtPayload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
    isVerified: user?.isVerified,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetPasswordLink = `${config.reset_pass_ui_link}/reset-password/${user?._id}/${resetToken}`;

  try {
    await sendEmail(user.email, resetPasswordLink);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send reset password email"
    );
  }
};

const resetPassword = async (payload: {
  id: string;
  token: string;
  password: string;
}) => {
  const user = await User.findById(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const decoded = jwt.verify(
    payload.token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload.id !== decoded?.id) {
    throw new AppError(httpStatus.FORBIDDEN, "User does not exist");
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.password,
    Number(config.bcrypt_salt_rounds)
  );

  console.log(
    "user, decoded, hashed password",
    user,
    decoded,
    newHashedPassword
  );

  await User.findOneAndUpdate(
    {
      _id: decoded?.id,
      role: decoded?.role,
    },
    {
      password: newHashedPassword,
    }
  );
};

export const authService = {
  signUp,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
