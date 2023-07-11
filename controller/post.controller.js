import Posts from "../entities/post.js";
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
    const posts = await Posts.find();

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
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.description) {
      post.description = req.body.description;
    }

    if (req.body.img) {
      post.img = req.body.img;
    }
    if (req.body.point) {
      post.point = req.body.point;
    }
    if (req.body.type) {
      post.typePost = req.body.type;
    }

    const updatedPosting = await post.save();

    res.status(200).json({ message: "update success", data: updatedPosting });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "No posts found" });
    } else {
      await post.remove();
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
