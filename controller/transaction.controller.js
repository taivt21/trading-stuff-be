import Transactions from "../entities/transaction.js";
import Users from "../entities/user.js";
import { TRANSACTION_TYPE } from "../types/type.js";
import Posts from "../entities/post.js";
import Auctions from "../entities/auction.js";

export const getUserTransaction = async (req, res) => {
  const transactions = await Transactions.find({
    userId: req.user.id,
  }).select("-userId");

  res.status(200).json({
    status: true,
    data: transactions,
  });
};

export const getTransactionByUserId = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      status: false,
      message: "params userid required",
    });

  const transaction = await Transactions.find({
    userId: id,
  }).select("-userId -__v -updatedAt");

  res.status(200).json({
    status: true,
    data: transaction,
  });
};

export const confirmTransaction = async (req, res) => {
  // const id = req.user.id;
  const transaction = await Transactions.findOne({
    id: req.params.id,
    status: "pending",
  }).populate("post");
  console.log(transaction);

  // console.log(await User.findById(transaction.post.user));
  if (!transaction)
    return res.status(400).json({
      status: false,
      message: "transaction not found",
    });

  if (transaction.transaction_type === TRANSACTION_TYPE.GIVE) {
    // cong diem cho nguoi post
    await Users.findByIdAndUpdate(transaction.post.user, {
      $inc: {
        point: transaction.point,
      },
    });
  }
  if (transaction.transaction_type === TRANSACTION_TYPE.AUCTION) {
    //cộng điểm cho user post
    // tìm user post bài của transaction có postId trùng với postId bên auction có status "done"
    //sau đó cộng điểm transaction point qua point của user post bài đó
    const doneAuction = await Auctions.findOne({
      postId: transaction.post._id,
      status: "done",
    }).populate("postId bidders.user");

    if (!doneAuction) {
      return res.status(400).json({
        status: false,
        message: "Không tìm thấy phiên đấu giá đã hoàn thành",
      });
    }

    const userPost = await Users.findById(doneAuction.postId.user);

    if (!userPost) {
      return res.status(400).json({
        status: false,
        message: "Không tìm thấy người dùng",
      });
    }

    userPost.point += doneAuction.bidders[0]?.bidAmount;
    // console.log(" point:", userPost.point);

    await userPost.save();
    await Posts.findByIdAndUpdate(transaction.post, { status: "hidden" });
  }

  await transaction.updateOne({
    status: "success",
  });
  res.status(200).json({
    status: true,
    message: "update transaction success",
  });
};

export const rejectTransaction = async (req, res) => {
  const transaction = await Transactions.findOneAndUpdate(
    { id: req.params.id, status: "pending" },
    {
      status: "failure",
      transaction_type: "terminate",
    }
  ).populate("post");

  if (transaction.post.typePost === "receive") {
    //currentUser
    await Users.findByIdAndUpdate(req.user.id, {
      $inc: {
        point: -transaction.post.point,
      },
    });
  }
  if (transaction.post.typePost === "give") {
    //currentUser
    await Users.findByIdAndUpdate(req.user.id, {
      $inc: {
        point: transaction.post.point,
      },
    });
  }
  if (transaction.post.typePost === "auction") {
    // Check if the currentUser is a bidder in the auction
    const auction = await Auctions.findOne({
      postId: transaction.post.id,
      "bidders.user": req.user.id,
    });
    console.log("auction:", auction);

    if (!auction) {
      return res.status(400).json({
        status: false,
        message: "You are not a bidder in this auction",
      });
    }

    // Add points back to the currentUser for "auction" transactions
    await Users.findByIdAndUpdate(req.user.id, {
      $inc: {
        point: auction.bidders[0]?.bidAmount,
      },
    });
  }

  await Posts.findByIdAndUpdate(transaction.post, {
    status: "published",
  });

  return res.status(204).json({
    status: true,
    message: "update transaction success",
  });
};
