import Favourite from "../entities/favourite.js";

export const getFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.find().populate(
      "user post",
      "-createdAt -updatedAt -__v"
    );
    res.status(200).json({
      status: "Success",
      messages: "Get favourite successfully!",
      data: favourite,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const getFavouriteByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const favourite = await Favourite.find({ user: id }).populate("user post");

    res.status(200).json({
      status: "Success",
      messages: "Get favourite by userId successfully!",
      data: favourite,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const getFavouriteByPost = async (req, res) => {
  try {
    const favourite = await Favourite.find({ post: req.params.id })
      .select("-__v")
      .populate("user", "fullname")
      .populate("post", " -__v -status");
    res.status(200).json({
      status: "Success",
      messages: "Get favourite by postId successfully!",
      data: favourite,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const createFavouritePost = async (req, res) => {
  try {
    const user = req.user.id;
    const post = req.body.postId;

    // Kiểm tra xem đã tồn tại một mục yêu thích cho bài đăng này chưa
    const existingFavorite = await Favourite.findOne({
      user: user,
      post: post,
    });
    if (existingFavorite) {
      return res.status(400).json({
        status: "Fail",
        messages: "This post has already been favorited by the user",
      });
    }

    const favorite = new Favourite({
      user: user,
      post: post,
    });

    await favorite.save();

    res.status(201).json({
      status: "Success",
      messages: "Favourite post created successfully!",
      data: { favorite },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export const deleteFavourite = async (req, res) => {
  const favouriteId = req.params.id;

  try {
    const favorite = await Favourite.findByIdAndDelete(favouriteId);
    if (!favorite) {
      res.status(404).json({
        status: "Fail",
        messages: "Can not see post favourite",
      });
      return;
    }
    res.status(200).json({
      status: "Success",
      messages: "Favourite post delete successfully!",
      data: { favorite },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};
