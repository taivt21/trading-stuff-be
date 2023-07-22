import Transactions from "../entities/transaction.js";
import User from "../entities/user.js";
import { TRANSACTION_TYPE } from "../types/type.js";
import Posts from "../entities/post.js";

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

  const transaction = await Transactions.findById(req.params.id).populate(
    "post"
  );

  // console.log(await User.findById(transaction.post.user));
  if (!transaction)
    return res.status(400).json({
      status: false,
      message: "transaction not found",
    });

  // cong diem cho nguoi post
  await User.findByIdAndUpdate(transaction.post.user, {
    $inc: {
      point: transaction.point,
    },
  });

  await transaction.updateOne({
    status: "success",
  });

  // if (transaction.transaction_type === TRANSACTION_TYPE.GIVE) {
  //   //currentUser
  //   await User.findByIdAndUpdate(id, {
  //     $inc: {
  //       point: transaction.point,
  //     },
  //   });
  //   //user transaction
  //   await User.findByIdAndUpdate(transaction.post.user, {
  //     $inc: {
  //       point: -transaction.point,
  //     },
  //   });
  // }
  // if (transaction.transaction_type === TRANSACTION_TYPE.RECEIVE) {
  //   //currentUser
  //   await User.findByIdAndUpdate(id, {
  //     $inc: {
  //       point: -transaction.point,
  //     },
  //   });
  //   //user transaction
  //   await User.findByIdAndUpdate(transaction.post.user, {
  //     $inc: {
  //       point: transaction.point,
  //     },
  //   });
  // }

  res.status(200).json({
    status: true,
    message: "update transaction success",
  });
};
export const rejectTransaction = async (req, res) => {
  const transaction = await Transactions.findByIdAndUpdate(req.params.id, {
    status: "failure",
    transaction_type: "terminate",
  }).populate("post");

  if (transaction.post.typePost === "receive") {
    //currentUser
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        point: -transaction.post.point,
      },
    });
    // //user transaction
    // await User.findByIdAndUpdate(transaction.post.user, {
    //   $inc: {
    //     point: transaction.post.point,
    //   },
    // });
  }
  if (transaction.post.typePost === "give") {
    //currentUser
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        point: transaction.post.point,
      },
    });
    // //user transaction
    // await User.findByIdAndUpdate(transaction.post.user, {
    //   $inc: {
    //     point: -transaction.post.point,
    //   },
    // });
  }

  await Posts.findByIdAndUpdate(transaction.post, {
    status: "published",
  });

  res.status(204).json({
    status: true,
    message: "update transaction success",
  });
};
