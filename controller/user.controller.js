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
    .populate("followedBy", "email phoneNumber img fullname")
    .populate("following", "email phoneNumber img fullname");

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

export const getFollowingUser = async (req, res) => {
  const { id } = req.user;

  try {
    const users = await User.findById(id)
      .populate("following", "email fullname img")
      .select("following");

    res.status(200).json({
      status: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id)
      .populate()
      .select("-point -createdAt -updatedAt -__v -role -status");

    res.status(200).json({
      status: true,
      data: user,
    });
    res.status(500).json({ status: false, error });
  } catch (error) {}
};

export const banUser = async (req, res) => {
  const id = req.params.id;
  console.log("file: user.controller.js:184 ~ banUser ~ id:", id);

  const check = await User.findById(id);
  if (check.status === false) {
    return res.status(400).json({
      msg: "User is already banned",
    });
  }

  await User.findByIdAndUpdate(id, {
    status: false,
  });

  return res.status(200).json({
    msg: "update status success",
  });
};
export const unbanUser = async (req, res) => {
  const id = req.params.id;

  const check = await User.findById(id);
  if (check.status === true) {
    return res.status(400).json({
      msg: "User is already unbanned",
    });
  }

  await User.findByIdAndUpdate(id, {
    status: true,
  });

  return res.status(200).json({
    msg: "update status success",
  });
};
