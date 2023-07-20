import Comments from "../entities/comment.js";
import User from "../entities/user.js";
import Transactions from "../entities/transaction.js";
import { TRANSACTION_TYPE } from "../types/type.js";

export const createComment = async (req, res) => {
  try {
    const POINT = 2;
    const id = req.user.id;

    if (
      req.body.description.trim().length <= 0 ||
      req.body.postId.trim().length <= 0
    ) {
      return res.status(400).json({
        status: false,
      });
    }

    const check = await Comments.findOne({
      post: req.body.postId,
      user: id,
    });

    if (check) {
      return res.status(400).json({
        status: false,
        message: "you can only have 1 comment per post",
      });
    }

    const postComment = new Comments({
      description: req.body.description,
      user: id,
      post: req.body.postId,
    });

    //add point to user
    await User.findByIdAndUpdate(id, {
      $inc: { point: POINT },
    });

    await Transactions.create({
      userId: id,
      transaction_type: TRANSACTION_TYPE.RECEIVE,
      point: POINT,
    });

    // Save the post to the database
    await postComment.save();

    res.status(201).json({
      status: "Success",
      messages: "Comment created successfully!",
      data: { postComment },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const getAllCommentByPost = async (req, res) => {
  try {
    const postingId = req.params.id;
    const postingComments = await Comments.find({ post: postingId }).populate(
      "post user"
    );
    res.status(200).json({
      status: "Success",
      messages: "Get postings successfully!",
      data: { postingComments },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};
export const getAllComment = async (req, res) => {
  try {
    const postingComments = await Comments.find().populate("post user");
    res.status(200).json({
      status: "Success",
      messages: "Get postings successfully!",
      data: { postingComments },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comments.findByIdAndUpdate(
      req.params.id,
      {
        description: req.body.description,
      },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Update success", data: comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "No posts found" });
    } else {
      await comment.deleteOne;
      res.status(200).json({
        message: "delete comment success",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
