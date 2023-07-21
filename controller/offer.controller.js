import { sendExchangeInfoEmail } from "../config/sendmail.js";
import Offer from "../entities/offfer.js";
import Post from "../entities/post.js";
import Transactions from "../entities/transaction.js";
import User from "../entities/user.js";
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../types/type.js";

export const createOffer = async (req, res, next) => {
  const userId = req.user.id;
  const { postId, point } = req.body;

  const user = await User.findById(userId);

  if (user.point < point) {
    return res.status(400).json({
      message: "you dont have enough points to make offer",
    });
  }

  const checkPost = await Post.findById(postId);

  if (!checkPost)
    return res.status(401).json({
      message: "Not Found Post",
    });

  if (!postId || !point) {
    return res.status(404).json({
      status: false,
      message: "postId and point is required",
    });
  }

  const checkOffer = await Offer.findOne({
    post_id: postId,
    user_id: userId,
  });

  if (checkOffer) {
    await Offer.findOneAndUpdate(
      {
        post_id: postId,
        user_id: userId,
      },
      {
        point: point,
      }
    );
    return res.status(200).json({
      message: "Offer updated successfully",
    });
  }

  const newOffer = new Offer({
    user_id: userId,
    post_id: postId,
    point: point,
  });

  await newOffer.save();

  res.status(201).json({
    message: "create offer successfully",
    data: newOffer,
  });
};

export const editOffer = async (req, res) => {
  const offerId = req.params.id;

  const offer = await Offer.findById(offerId);

  const { point } = req.body;

  if (!offer)
    return res.status(404).json({
      message: "offer not found",
    });

  offer.updateOne({
    point: point,
  });

  offer.save();

  res.status(204);
};

export const approveOffer = async (req, res) => {
  const user = await User.findById(req.user.id);

  const offerId = req.params.id;

  const offer = await Offer.findById(offerId);

  const message = "offer success";

  if (!offer)
    return res.status(404).json({
      message: "offer not found",
    });

  const post = await Post.findById(offer.post_id).populate("user", "email");

  // Kiểm tra loại bài đăng
  if (post.typePost === "give") {
    await Transactions.create({
      userId: req.user.id,
      transaction_type: TRANSACTION_TYPE.GIVE,
      point: offer.point,
      post: post._id,
      transaction_category: TRANSACTION_CATEGORY.POST,
    });

    //gửi mail
    const email = post.user.email;
    sendExchangeInfoEmail(email, post._id, message);
  } else if (post.typePost === "receive") {
    await Transactions.create({
      userId: req.user.id,
      transaction_type: TRANSACTION_TYPE.RECEIVE,
      point: offer.point,
      post: post._id,
      transaction_category: TRANSACTION_CATEGORY.POST,
    });

    //gửi mail
    const email = post.user.email;

    sendExchangeInfoEmail(email, post._id, message);
  }

  await post.updateOne({
    status: "hidden",
    point: offer.point,
  });

  await post.save();
  console.log("file: offer.controller.js:104 ~ approveOffer ~ post:", post);

  await offer.updateOne({
    status: "approved",
  });

  res.status(204).json({});
};
export const rejectOffer = async (req, res) => {
  const offerId = req.params.id;

  const offer = await Offer.findById(offerId);

  if (!offer)
    return res.status(404).json({
      message: "offer not found",
    });

  await offer.updateOne({
    status: "rejected",
  });

  res.status(204).json({});
};

export const getOfferByPost = async (req, res) => {
  const postId = req.params.id;

  const offersByPost = await Offer.find({
    post_id: postId,
  }).populate("user_id", "email fullname img  ");

  if (!offersByPost)
    return res.status(404).json({
      status: false,
      message: "not found",
    });

  return res.status(200).json({
    status: true,
    data: offersByPost,
  });
};
