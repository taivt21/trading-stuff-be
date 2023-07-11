import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    description: { type: String },
    status: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    img: { type: String },
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", commentSchema);

export default Comments;
