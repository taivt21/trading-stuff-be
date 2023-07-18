import express from "express";
import {
  editUser,
  getProfile,
  getUsers,
  getUserInWithinDay,
  followingUser,
  getFollowedUser,
  unfollowUser,
} from "../controller/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const userRoute = express.Router();

userRoute.get("/", authenticate, isAdmin, getUsers);

userRoute.get("/me", authenticate, getProfile);

userRoute.put("/edit", authenticate, editUser);

userRoute.get("/statis", authenticate, isAdmin, getUserInWithinDay);

userRoute.get("/follow/:userId", authenticate, followingUser);

userRoute.get("/me/follow", authenticate, getFollowedUser);

userRoute.delete("/follow/:userId", authenticate, unfollowUser);

export default userRoute;
