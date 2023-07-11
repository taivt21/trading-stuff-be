import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorites", FavoriteSchema);

export default Favorite;
