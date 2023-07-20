import Transactions from "../entities/transaction.js";

export const getUserTransaction = async (req, res) => {
  const transactions = await Transactions.find({
    userId: req.user.id,
  }).select("-userId");

  res.status(200).json({
    status: true,
    data: transactions,
  });
};

export const getTransactionByUserId = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      status: false,
      message: "params userid required",
    });

  const transaction = await Transactions.find({
    userId: id,
  }).select("-userId -__v -updatedAt");

  res.status(200).json({
    status: true,
    data: transaction,
  });
};
