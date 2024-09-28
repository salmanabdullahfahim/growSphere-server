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

export const userServices = {
  getSingleUser,
  updateUser,
};
