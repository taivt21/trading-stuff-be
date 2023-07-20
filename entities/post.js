import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["published", "limited", "hidden"],
      default: "published",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    img: { type: String },
    point: { type: Number },
    typePost: { type: String, enum: ["receive", "give", "auction"] },
    minPoint: { type: Number },
    bidStep: { type: Number },
    offer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);

export default Posts;
