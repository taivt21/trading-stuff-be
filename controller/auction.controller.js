import Auction from "../entities/auction.js";
import Posts from "../entities/post.js";
import Users from "../entities/user.js";
import mongoose from "mongoose";

// Hàm kiểm tra điều kiện đủ điểm đấu giá
const checkBidderPoints = async (bidderId, bidAmount) => {
  const bidder = await Users.findById(bidderId);
  if (!bidder || bidder.point <= bidAmount) {
    return false;
  }
  return true;
};

// Hàm kiểm tra giá đấu giá hợp lệ
const checkBidAmountValidity = (totalBidAmount, post) => {
  if (
    totalBidAmount < post.minPoint ||
    (totalBidAmount - post.minPoint) % post.bidStep !== 0
  ) {
    return false;
  }
  return true;
};

const placeBid = async (req, res) => {
  try {
    const postId = req.body.postId;
    const bidAmount = req.body.bidAmount;
    const bidderId = req.user.id;

    // Kiểm tra xem bài đăng có tồn tại không
    const post = await Posts.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ message: "Bài đăng không tồn tại." });
    }

    // Kiểm tra loại bài đăng có phải là đấu giá không
    if (post.typePost !== "auction") {
      return res
        .status(400)
        .json({ message: "Bài đăng không phải là đấu giá." });
    }

    const currentTime = new Date();
    const auctionEndTime = new Date(
      post.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000
    );

    if (currentTime >= auctionEndTime) {
      return res
        .status(400)
        .json({ message: "Thời gian đấu giá đã kết thúc." });
    }

    // Tìm phiên đấu giá dựa trên postId
    let bidderIndex = -1;
    let totalBidAmount = bidAmount;

    const auction = await Auction.findOne({ postId: postId });

    // Kiểm tra xem người đấu giá đã đấu giá hay chưa
    if (auction) {
      bidderIndex = auction.bidders.findIndex(
        (bidder) => bidder.user.equals(bidderId),
        console.log(bidderIndex)
      );

      if (bidderIndex !== -1) {
        // Nếu người đấu giá đã đấu giá trước đó, cộng điểm đấu giá cũ và điểm đấu giá mới được gửi
        totalBidAmount = auction.bidders[bidderIndex].bidAmount + bidAmount;
        console.log(totalBidAmount, bidAmount);
      }
    }

    // Kiểm tra xem người đấu giá có đủ điểm để đấu giá hay không
    const hasEnoughPoints = await checkBidderPoints(bidderId, bidAmount);
    if (!hasEnoughPoints) {
      return res.status(400).json({ message: "Không đủ điểm để đấu giá." });
    }

    // Kiểm tra giá đấu giá có hợp lệ không
    const isBidAmountValid = checkBidAmountValidity(totalBidAmount, post);
    if (!isBidAmountValid) {
      return res.status(400).json({ message: "Giá đấu giá không hợp lệ." });
    }

    // Thêm thông tin đấu giá vào bảng Auction
    if (auction) {
      if (bidderIndex === -1) {
        auction.bidders.push({
          user: bidderId,
          bidAmount: totalBidAmount,
        });
      } else {
        auction.bidders[bidderIndex].bidAmount = totalBidAmount;
      }

      await auction.save();
    } else {
      const newAuction = new Auction({
        postId: postId,
        minPoint: post.minPoint,
        bidStep: post.bidStep,
        bidders: [
          {
            user: bidderId,
            bidAmount: totalBidAmount,
          },
        ],
      });

      await newAuction.save();
    }
    // Trừ điểm của người đấu giá
    const bidder = await Users.findById(bidderId);
    bidder.point -= bidAmount;
    await bidder.save();

    // Lấy danh sách người đấu giá theo thứ tự giảm dần theo điểm
    const bidders = await Auction.findById(auction.id)
      .populate("bidders.user", "username point")
      .sort({ "bidders.bidAmount": -1 });

    return res
      .status(200)
      .json({ message: "Đấu giá thành công.", bidders: bidders.bidders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Hàm xoá người đấu giá cao nhất
const deleteHighestBidder = async (req, res) => {
  try {
    const auctionId = req.params.id;
    const auction = await Auction.findById(auctionId).populate("bidders.user");
    if (auction) {
      const highestBidder = auction.bidders[0];
      if (highestBidder) {
        // Trả lại một nửa số điểm đã đấu giá cho người đấu giá cao nhất
        console.log(highestBidder);
        const refundAmount = Math.floor(highestBidder.bidAmount / 2);
        const bidder = await Users.findById(highestBidder.user.id);
        console.log(bidder);
        bidder.point += refundAmount;
        await bidder.save();

        // Xoá người đấu giá cao nhất khỏi danh sách bidders
        auction.bidders.shift();
        await auction.save();

        // Đánh giá các hoạt động tiếp theo sau khi xoá người đấu giá cao nhất ở đây...
      } else {
        return res.status(500).json("Dont have bidder");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(200).json("Delete successfully");
  }
};

const getAllAuction = async (req, res) => {
  try {
    const auctions = await Auction.find();
    return res.status(200).json(auctions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAuctionById = async (req, res) => {
  try {
    const auctionId = req.params.id;
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Phiên đấu giá không tồn tại." });
    }
    return res.status(200).json(auction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getAuctionByPostId = async (req, res) => {
  const postId = req.params.id;
  try {
    const auctions = await Auction.find({ postId: postId });
    res.status(200).json(auctions);
  } catch (error) {
    console.error("Lỗi khi tìm auctions:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi tìm auctions" });
  }
};
export {
  placeBid,
  deleteHighestBidder,
  getAllAuction,
  getAuctionById,
  getAuctionByPostId,
};
