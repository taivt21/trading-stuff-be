import express from "express";
import {
  editUser,
  getProfile,
  getUsers,
} from "../controller/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const userRoute = express.Router();

userRoute.get("/", authenticate, isAdmin, getUsers);

userRoute.get("/me", authenticate, getProfile);

userRoute.put("/edit", authenticate, editUser);

export default userRoute;
