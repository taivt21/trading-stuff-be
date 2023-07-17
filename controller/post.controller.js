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
      post.type = req.body.type;
    }

    const updatedPost = await post.save();

    res.status(200).json({ message: "update success", data: updatedPost });
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
