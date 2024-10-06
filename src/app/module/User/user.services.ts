import { User } from "./user.model";
import { TUser } from "./user.interface";
import { Post } from "../Post/post.model";
import { initiatePayment } from "../Payment/payment.utils";

const getSingleUser = async (email: string) => {
  const result = await User.findOne({ email: email })
    .populate("favoritesPosts")
    .populate("following")
    .populate("followers");
  return result;
};

const getUserById = async (id: string) => {
  const result = await User.findById(id)
    .populate("followers")
    .populate("following");
  return result;
};

const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

const updateUser = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).select("-password");

  return result;
};

const changeUserStatus = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  return result;
};

const verifyUser = async (id: string) => {
  // Check if the user has at least one post with 1 or more upvotes
  const eligiblePost = await Post.findOne({ author: id, upVotes: { $gte: 1 } });

  if (!eligiblePost) {
    throw new Error(
      "You aren't eligible for verification: requires post with at least 1 upVote"
    );
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User is already verified");
  }

  // Initiate payment
  const paymentData = {
    transactionId: `TRXN-${id}-${Date.now()}`,
    totalAmount: "1200",
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
  };

  const paymentSession = await initiatePayment(paymentData);

  // Return the payment URL for the frontend to redirect the user

  return paymentSession;
};

const followUser = async (followerId: string, followingId: string) => {
  const result = await User.findByIdAndUpdate(
    followerId,
    { $addToSet: { following: followingId } },
    { new: true }
  );

  await User.findByIdAndUpdate(followingId, {
    $addToSet: { followers: followerId },
  });

  return result;
};

const unfollowUser = async (followerId: string, followingId: string) => {
  const result = await User.findByIdAndUpdate(
    followerId,
    { $pull: { following: followingId } },
    { new: true }
  );

  await User.findByIdAndUpdate(followingId, {
    $pull: { followers: followerId },
  });

  return result;
};

const favoritePost = async (userId: string, postId: string) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoritesPosts: postId } },
    { new: true }
  );

  return result;
};

const unfavoritePost = async (userId: string, postId: string) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoritesPosts: postId } },
    { new: true }
  );

  return result;
};

const getUserFavorites = async (userId: string) => {
  const result = await User.findById(userId).populate("favoritesPosts");
  return result?.favoritesPosts;
};

export const userServices = {
  getSingleUser,
  getUserById,
  getAllUsers,
  updateUser,
  changeUserStatus,
  verifyUser,
  followUser,
  unfollowUser,
  favoritePost,
  unfavoritePost,
  getUserFavorites,
};
