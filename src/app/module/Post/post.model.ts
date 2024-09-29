import mongoose, { Schema, Document } from "mongoose";
import { TPost, TComment } from "./post.interface";

const CommentSchema: Schema = new Schema<TComment>(
  {
    content: { type: String, required: true },
    commentator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const PostSchema: Schema = new Schema<TPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    images: [{ type: String }],
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export const Post = mongoose.model<TPost & Document>("Post", PostSchema);
