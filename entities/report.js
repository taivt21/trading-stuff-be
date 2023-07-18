import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Reports = mongoose.model("Reports", reportSchema);

export default Reports;
