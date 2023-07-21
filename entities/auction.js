import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    minPoint: { type: Number }, // Giá min để đấu giá
    bidStep: { type: Number }, // Bước nhảy giá khi đấu giá
    bidders: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        }, // ID của người đấu giá
        bidAmount: { type: Number }, // Giá đấu giá của người đấu giá
      },
    ],
    status: { type: String, enum: ["done", "ongoing"], default: "ongoing" },
  },
  { timestamps: true }
);
// Tạo chỉ mục cho trường createdAt
auctionSchema.index({ createdAt: 1 });
const Auctions = mongoose.model("auctions", auctionSchema);

export default Auctions;
