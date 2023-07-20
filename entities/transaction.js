import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    transaction_type: {
      type: String,
      enum: ["give", "receive", "paid"],
    },
    point: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Transactions = mongoose.model("transactions", transactionSchema);

export default Transactions;
