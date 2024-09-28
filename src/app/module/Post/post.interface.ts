import { Types } from "mongoose";

export type TPost = {
  title: string;
  content: string;
  author: Types.ObjectId;
  category: string;
  isPremium: boolean;
  images: string[];
  upVotes: number;
  downVotes: number;
  comments?: TComment[];
};

export type TComment = {
  content: string;
  author: Types.ObjectId;
};
