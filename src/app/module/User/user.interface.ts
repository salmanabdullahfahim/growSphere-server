/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  name: string;
  email: string;
  profileImage: string;
  password: string;
  phone: string;
  role: "user" | "admin";
  followers: TUser[];
  following: TUser[];
  isVerified?: boolean;
}

export interface UserModel extends Model<TUser> {
  // myStaticMethod(): number;
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    planeTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
