import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  confirmTransaction,
  getTransactionByUserId,
  getUserTransaction,
} from "../controller/transaction.controller.js";

const transactionRoute = express.Router();

transactionRoute.get("/me", authenticate, getUserTransaction);

transactionRoute.get(
  "/users/:id",
  authenticate,
  isAdmin,
  getTransactionByUserId
);

transactionRoute.put("/confirm/:id", authenticate, confirmTransaction);

export default transactionRoute;
