import User from "../entities/user.js";

export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

export const getProfile = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);

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
