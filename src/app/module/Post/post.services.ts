import { Post } from "./post.model";
import { TPost, TComment } from "./post.interface";
import { Types } from "mongoose";
import { SortOrder } from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { searchableFields } from "../../utils/searchableFields";

const createPost = async (postData: Partial<TPost>): Promise<TPost> => {
  const result = await Post.create(postData);
  return result;
};

const updatePost = async (
  id: string,
  postData: Partial<TPost>
): Promise<TPost | null> => {
  const result = await Post.findByIdAndUpdate(
    id,
    { $set: postData },
    { new: true, runValidators: true }
  );
  return result;
};

const deletePost = async (id: string): Promise<boolean> => {
  const result = await Post.findByIdAndDelete(id);
  return !!result;
};

const getPost = async (id: string): Promise<TPost | null> => {
  const result = await Post.findById(id).populate("author");
  return result;
};

const getPosts = async (
  query: Record<string, unknown>
): Promise<{ posts: TPost[]; total: number; page: number; limit: number }> => {
  const postQuery = new QueryBuilder(Post.find().populate("author"), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [posts, total] = await Promise.all([
    postQuery.modelQuery,
    Post.countDocuments(postQuery.modelQuery.getFilter()),
  ]);

  const { page = 1, limit = 10 } = query;

  return {
    posts,
    total,
    page: Number(page),
    limit: Number(limit),
  };
};

const addComment = async (
  postId: string,
  commentData: TComment
): Promise<TPost | null> => {
  const result = await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: commentData,
      },
    },
    { new: true }
  );
  return result;
};

const vote = async (
  postId: string,
  userId: string,
  voteType: "upvote" | "downvote"
): Promise<TPost | null> => {
  const post = await Post.findById(postId);
  if (!post) return null;

  const hasUpvoted = post.upvotedBy.includes(new Types.ObjectId(userId));
  const hasDownvoted = post.downvotedBy.includes(new Types.ObjectId(userId));

  if (voteType === "upvote") {
    if (hasUpvoted) {
      // User already upvoted, so remove the upvote
      post.upVotes--;
      post.upvotedBy = post.upvotedBy.filter((id) => id.toString() !== userId);
    } else {
      // Add upvote and remove downvote if exists
      post.upVotes++;
      post.upvotedBy.push(new Types.ObjectId(userId));
      if (hasDownvoted) {
        post.downVotes--;
        post.downvotedBy = post.downvotedBy.filter(
          (id) => id.toString() !== userId
        );
      }
    }
  } else if (voteType === "downvote") {
    if (hasDownvoted) {
      // User already downvoted, so remove the downvote
      post.downVotes--;
      post.downvotedBy = post.downvotedBy.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Add downvote and remove upvote if exists
      post.downVotes++;
      post.downvotedBy.push(new Types.ObjectId(userId));
      if (hasUpvoted) {
        post.upVotes--;
        post.upvotedBy = post.upvotedBy.filter(
          (id) => id.toString() !== userId
        );
      }
    }
  }

  return await post.save();
};

const editComment = async (
  postId: string,
  commentId: string,
  userId: string,
  updatedContent: string
): Promise<TPost | null> => {
  const result = await Post.findOneAndUpdate(
    {
      _id: postId,
      "comments._id": commentId,
      "comments.commentator": new Types.ObjectId(userId),
    },
    {
      $set: {
        "comments.$.content": updatedContent,
      },
    },
    { new: true }
  );
  return result;
};

const deleteComment = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<TPost | null> => {
  const result = await Post.findOneAndUpdate(
    {
      _id: postId,
      "comments._id": commentId,
      "comments.commentator": new Types.ObjectId(userId),
    },
    {
      $pull: { comments: { _id: commentId } },
    },
    { new: true }
  );
  return result;
};

export const postServices = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  addComment,
  vote,
  editComment,
  deleteComment,
};
