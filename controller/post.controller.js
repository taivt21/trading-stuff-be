import Posts from "../entities/post.js";
import Users from "../entities/user.js";
import Transactions from "../entities/transaction.js";
import { sendExchangeInfoEmail } from "../config/sendmail.js";
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../types/type.js";
import Auctions from "../entities/auction.js";

export const createPost = async (req, res) => {
  try {
    const typePost = req.body.type;
    if (typePost !== "auction") {
      // Nếu typePost không phải là "auction", tạo bài đăng thông thường
      const post = new Posts({
        ...req.body,
        user: req.user.id,
        typePost,
      });
      await post.save();
      // Tạo transaction liên quan đến bài đăng
      await Transactions.create({
        id: req.user.id,
        point: req.body.point,
        transaction_type: typePost,
        transaction_category: TRANSACTION_CATEGORY.POST,
        post: post._id,
      });
      res.status(201).json({
        status: "Success",
        messages: "Post created successfully!",
        data: { post },
      });
    } else {
      // Nếu typePost là "auction", tạo bài đăng và phiên đấu giá
      const post = new Posts({
        ...req.body,
        user: req.user.id,
        typePost,
      });
      await post.save();
      console.log(post);
      // Tạo phiên đấu giá
      const newAuction = new Auctions({
        postId: post._id,
        minPoint: req.body.minPoint,
        bidStep: req.body.bidStep,
        bidders: [],
      });
      await newAuction.save();

      // Tạo transaction liên quan đến bài đăng
      await Transactions.create({
        id: req.user.id,
        point: req.body.point,
        transaction_type: typePost,
        transaction_category: "post",
        post: post._id,
      });

      res.status(201).json({
        status: "Success",
        messages: "Auction created successfully!",
        data: { post },
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  const query = req.query;
  console.log();

  const limit = query.limit ?? {};

  const page = query.page ?? {};

  console.log(await Posts.count());

  const skip = (await Posts.count()) - limit * page;

  try {
    const posts = await Posts.find({})
      .populate("user", "-createdAt -updatedAt -__v -roleName")
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      status: "Success",
      messages: "Get posts successfully from database!",
      data: { posts },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.id).populate("user");

    res.status(200).json({
      status: "Success",
      messages: "Get posts successfully from database!",
      data: { posts },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Posts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Update success", data: post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log(post);
    if (!post) {
      res.status(404).json({ message: "No posts found" });
    } else {
      await post.deleteOne();
      res.status(200).json({
        message: "delete post success",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const exchangeStuff = async (req, res) => {
  try {
    const { postId, message } = req.body;

    const post = await Posts.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({ message: "Bài đăng không tồn tại." });
    }

    const userId = req.user.id;
    //current user
    const user = await Users.findById(userId);

    // Kiểm tra loại bài đăng
    if (post.typePost === "give") {
      if (user.point < post.point) {
        return res.status(400).json({ message: "Dont enought point" });
      }

      await Transactions.create({
        userId: req.user.id,
        transaction_type: TRANSACTION_TYPE.GIVE,
        point: post.point,
        post: postId,
        transaction_category: TRANSACTION_CATEGORY.POST,
      });

      //gửi mail
      const email = post.user.email;
      sendExchangeInfoEmail(email, postId, message);
    } else if (post.typePost === "receive") {
      await Transactions.create({
        userId: req.user.id,
        transaction_type: TRANSACTION_TYPE.RECEIVE,
        point: post.point,
        post: postId,
        transaction_category: TRANSACTION_CATEGORY.POST,
      });

      //gửi mail
      const email = post.user.email;
      sendExchangeInfoEmail(email, postId, message);
    } else {
      return res.status(400).json({ message: "Error in exchange" });
    }

    // Cập nhật trạng thái bài đăng
    // post.status = "hidden";
    await post.save();

    return res.status(200).json({ message: "Exchange successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postWithinDay = async (req, res) => {
  const { gte } = req.query;

  if (!gte) {
    res.status(400).json({
      message: "gte params required",
    });
    return;
  }

  const date = new Date();

  date.setDate(date.getDate() - gte);

  const posts = await Posts.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date,
        },
      },
    },
  ]);

  res.status(200).send({
    data: posts,
  });
};
