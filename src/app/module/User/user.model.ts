import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    phone: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    favoritesPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// password hashing
userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// remove password field from response
userSchema.post("save", function (doc, next) {
  (doc as any).password = undefined;
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  planeTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(planeTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
