import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    transaction_type: {
      type: String,
      enum: ["give", "receive", "paid", "terminate", "auction"],
    },
    transaction_category: {
      type: String,
      enum: ["comment", "post"],
    },
    point: {
      type: Number,
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failure"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transactions = mongoose.model("transactions", transactionSchema);

export default Transactions;
