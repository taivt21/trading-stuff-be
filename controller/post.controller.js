import Posts from "../entities/post.js";
import Users from "../entities/user.js";
import { sendExchangeInfoEmail } from "../config/sendmail.js";
export const createPost = async (req, res) => {
  try {
    const post = new Posts({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id,
      img: req.body.img,
      point: req.body.point,
      typePost: req.body.type,
    });

    await post.save();

    res.status(201).json({
      status: "Success",
      messages: "Post created successfully!",
      data: { post },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Posts.find().populate("user");

    res.status(200).json({
      status: "Success",
      messages: "Get posts successfully from database!",
      data: { posts },
    });
    // }
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
    // }
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
      await post.deleteOne;
      res.status(200).json({
        message: "delete post success",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const exchangeStuff = async (req, res) => {
  try {
    const postId = req.body.id;
    const message = req.body.message;

    const post = await Posts.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({ message: "Bài đăng không tồn tại." });
    }

    const userId = req.user.id;
    const user = await Users.findById(userId);

    // Kiểm tra loại bài đăng
    if (post.typePost === "give") {
      if (user.point < post.point) {
        return res.status(400).json({ message: "Dont enought point" });
      }
      // Trừ điểm của người dùng
      user.point -= post.point;

      // Cộng điểm cho người đăng
      const userPost = post.user;
      userPost.point += post.point;
      await userPost.save();
      await user.save();

      //gửi mail
      const email = userPost.email;
      sendExchangeInfoEmail(email, postId, message);
    } else if (post.typePost === "receive") {
      // Cộng điểm của người dùng
      user.point += post.point;

      //Trừ điểm người đăng
      const userPost = post.user;
      userPost.point -= post.point;
      await userPost.save();
      await user.save();

      //gửi mail
      const email = userPost.email;
      sendExchangeInfoEmail(email, postId, message);
    } else {
      return res.status(400).json({ message: "Error" });
    }

    // Cập nhật trạng thái bài đăng
    post.status = "hidden";
    await post.save();

    return res.status(200).json({ message: "Exchange successfully." });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
