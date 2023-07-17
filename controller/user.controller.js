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
  const user = await User.findById(id);

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

  console.log("file: user.controller.js:28 ~ getUserInMonth ~ day:", gte);

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - gte);

  const users = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
  ]);

  res.status(200).json({ users });
};
