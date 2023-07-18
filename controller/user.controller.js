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

  const {id} = req.user
  
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
