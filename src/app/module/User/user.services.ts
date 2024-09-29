import { User } from "./user.model";
import { TUser } from "./user.interface";

const getSingleUser = async (email: string) => {
  const result = await User.findOne({ email: email });
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
  updateUser,
  followUser,
  unfollowUser,
  favoritePost,
  unfavoritePost,
  getUserFavorites,
};
