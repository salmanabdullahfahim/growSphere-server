import { Post } from "./post.model";
import { TPost, TComment } from "./post.interface";

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
  filter: any = {},
  sort: any = { createdAt: -1 }
): Promise<TPost[]> => {
  const result = await Post.find(filter).sort(sort).populate("author");
  return result;
};

const addComment = async (
  postId: string,
  commentData: Omit<TComment, "createdAt" | "updatedAt">
): Promise<TPost | null> => {
  const result = await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: {
          ...commentData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    { new: true }
  ).populate("author");
  return result;
};

const vote = async (
  postId: string,
  voteType: "upvote" | "downvote"
): Promise<TPost | null> => {
  const update =
    voteType === "upvote"
      ? { $inc: { upVotes: 1 } }
      : { $inc: { downVotes: 1 } };
  const result = await Post.findByIdAndUpdate(postId, update, { new: true });
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
};
