import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    }, // ID của bài đăng đấu giá
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
    endTime: { type: Date }, // Thời gian kết thúc đấu giá
  },
  { timestamps: true }
);
const Auctions = mongoose.model("auctions", auctionSchema);

export default Auctions;
