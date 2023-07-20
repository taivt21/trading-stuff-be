import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    point: {
      type: Number,
      require: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offers", offerSchema);

export default Offer;
