import mongoose, { Schema, Document } from "mongoose";
import { TPost, TComment } from "./post.interface";

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const PostSchema: Schema = new Schema<TPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  images: [{ type: String }],
  upVotes: { type: Number, default: 0 },
  downVotes: { type: Number, default: 0 },
  comments: [CommentSchema],
});

export const Post = mongoose.model<TPost & Document>("Post", PostSchema);
export const Comment = mongoose.model<TComment & Document>(
  "Comment",
  CommentSchema
);
