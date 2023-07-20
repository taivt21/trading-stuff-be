import Auction from "../entities/auction.js";
import Posts from "../entities/post.js";
import Users from "../entities/user.js";

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

    // Kiểm tra loại bài đăng có phải đấu giá không
    if (post.typePost !== "auction") {
      console.log(post.typePost);
      return res
        .status(400)
        .json({ message: "Bài đăng không phải là đấu giá." });
    }

    // Kiểm tra thời gian đấu giá đã kết thúc chưa
    const currentTime = new Date();
    const auctionEndTime = new Date(
      post.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000
    );

    if (currentTime >= auctionEndTime) {
      return res
        .status(400)
        .json({ message: "Thời gian đấu giá đã kết thúc." });
    }

    // Kiểm tra xem người đấu giá có đủ điểm không
    const bidder = await Users.findById(bidderId);

    let totalBidAmount = bidAmount;

    // Nếu bài đăng đã được đấu giá, kiểm tra xem người đấu giá đã đấu giá hay chưa
    const auction = await Auction.findOne({ postId: postId });

    if (auction) {
      const bidderIndex = auction.bidders.findIndex((bidder) =>
        bidder.user.equals(bidderId)
      );

      if (bidderIndex !== -1) {
        // Nếu người đấu giá đã đấu giá, cộng điểm đấu giá cũ và điểm đấu giá mới được gửi
        totalBidAmount += auction.bidders[bidderIndex].bidAmount;
        totalBidAmount += req.body.pointAdd || 0; // Cộng thêm pointAdd nếu có
      }
    }

    if (!bidder || bidder.point < totalBidAmount) {
      return res.status(400).json({ message: "Không đủ điểm để đấu giá." });
    }

    console.log(post.minPoint, post.bidStep);
    // Kiểm tra giá đấu giá phải lớn hơn giá min và là bội số của bước nhảy
    if (
      totalBidAmount < post.minPoint ||
      (totalBidAmount - post.minPoint) % post.bidStep !== 0
    ) {
      return res.status(400).json({ message: "Giá đấu giá không hợp lệ." });
    }

    // Thêm thông tin đấu giá vào bidders của phiên đấu giá (nếu đã tồn tại)
    if (auction) {
      if (bidderIndex === -1) {
        // Nếu người đấu giá chưa đấu giá, thêm người đấu giá mới vào mảng bidders
        auction.bidders.push({
          user: bidderId,
          bidAmount: bidAmount,
        });
      } else {
        // Nếu người đấu giá đã đấu giá, cộng điểm đấu giá cũ và điểm đấu giá mới được gửi
        bidder.point += auction.bidders[bidderIndex].bidAmount;
        auction.bidders[bidderIndex].bidAmount = totalBidAmount;
      }

      await auction.save();
    } else {
      // Nếu chưa tồn tại phiên đấu giá, tạo mới và thêm thông tin đấu giá
      const newAuction = new Auction({
        postId: postId,
        minPoint: post.minPoint,
        bidStep: post.bidStep,
        bidders: [
          {
            user: bidderId,
            bidAmount: bidAmount,
          },
        ],
      });

      await newAuction.save();
    }

    // Trừ điểm của người đấu giá
    bidder.point -= totalBidAmount;
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

export { placeBid };
