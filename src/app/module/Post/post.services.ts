import { Post } from "./post.model";
import { TPost, TComment } from "./post.interface";
import { Types } from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";

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

const getPostsByUser = async (userId: string): Promise<TPost[] | null> => {
  const result = await Post.find({ author: userId })
    .populate("author")
    .sort({ createdAt: -1 });
  return result;
};

const getPosts = async (query: Record<string, unknown>) => {
  const posts = new QueryBuilder(Post.find(), query)
    .search(["content", "category", "title"])
    .filter()
    .paginate()
    .fields()
    .build();

  const result = await posts
    .populate({
      path: "comments",
      populate: {
        path: "commentator", // Populate the user inside each comment
        select: "name profileImage createdAt", // Choose the fields you want to retrieve
      },
    })
    .populate({
      path: "author", // Populate the user of the post
      select: "name profileImage isVerified", // Choose the fields you want to retrieve
    });

  return result;
};

const getAPostFromDB = async (id: string) => {
  const posts = await Post.findById(id).populate("user");

  return posts;
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
  ).populate("comments");
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
  getPostsByUser,
  getPosts,
  addComment,
  vote,
  editComment,
  deleteComment,
};
