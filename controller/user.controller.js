import User from "../entities/user.js";

export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

export const getProfile = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

export const editUser = async (req, res) => {
  const { email } = req.user;

  const dto = req.body;

  const updateUser = await User.findOneAndUpdate(
    {
      email: email,
    },
    { ...dto }
  );

  res.status(200).json(updateUser);
};
