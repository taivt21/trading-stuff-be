import User from "../entities/user.js";

export const getUsers = async (req, res) => {
  const query = req.query;

  const totalUser = await User.count();

  const limit = query.limit ?? {};

  const page = query.page ?? {};

  const skip = totalUser - limit * page;

  const users = await User.find({}).limit(limit).skip(skip);

  res.status(200).json(users);
};

export const getProfile = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id)
    .populate("followedBy")
    .populate("following");

  res.status(200).json(user);
};

export const editUser = async (req, res) => {
  const { id } = req.user;

  const dto = req.body;

  await User.findByIdAndUpdate(id, { ...dto });

  res.status(200).json({
    user: await User.findById(id),
  });
};

export const getUserInWithinDay = async (req, res) => {
  const { gte } = req.query;

  if (!gte) {
    res.status(400).json({
      msg: "gte params can not be empty",
    });
    return;
  }

  const date = new Date();

  date.setDate(date.getDate() - gte);

  const users = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: date },
      },
    },
  ]);

  res.status(200).json({ users });
};

export const followingUser = async (req, res) => {
  const { id } = req.user;

  try {
    const currentUser = await User.findById(id);

    const { userId } = req.params;

    const userToFollow = await User.findById(userId);

    if (currentUser.following.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ success: false, message: "User is already followed" });
    }

    currentUser.following.push(userToFollow._id);

    await User.findByIdAndUpdate(userId, {
      $push: {
        followedBy: currentUser._id,
      },
    });

    await currentUser.save();

    res
      .status(200)
      .json({ success: true, message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const unfollowUser = async (req, res) => {
  const { id } = req.user;

  try {
    const { userId } = req.params;

    const currentUser = await User.findById(id);

    if (!currentUser.following.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "User is not followed" });
    }

    currentUser.following = currentUser.following.filter(
      (followedUserId) => followedUserId.toString() !== userId
    );

    await User.findByIdAndUpdate(userId, {
      $pull: { followedBy: currentUser._id },
    });

    await currentUser.save();

    res
      .status(200)
      .json({ success: true, message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getFollowedUser = async (req, res) => {
  const { id } = req.user;

  try {
    const currentUser = await User.findById(id).populate(
      "followedBy",
      "email fullname img "
    );

    const followedUsers = currentUser.followedBy;

    res.status(200).json({ success: true, data: followedUsers });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
