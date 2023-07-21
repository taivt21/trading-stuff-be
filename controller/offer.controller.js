import Offer from "../entities/offfer.js";
import Post from "../entities/post.js";

export const createOffer = async (req, res, next) => {
  const userId = req.user.id;
  const { postId, point } = req.body;

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

export const approveOffer = async (req, res) => {
  const offerId = req.params.id;

  const offer = await Offer.findById(offerId);

  if (!offer)
    return res.status(404).json({
      message: "offer not found",
    });

  await Post.findByIdAndUpdate(offer.post_id, {
    status: "hidden",
  });

  await offer.updateOne({
    status: "approved",
  });

  res.status(204);
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

  res.status(204);
};
export const getOffByPost = async (req, res) => {
  const postId = req.params.id;

  const check = await Offer.findById(postId);

  if (!check)
    return res.status(404).json({
      status: falss,
      message: "not found",
    });

  return res.status(200).json({
    status: true,
    data: await Offer.findOne({
      post_id: postId,
    }),
  });
};
