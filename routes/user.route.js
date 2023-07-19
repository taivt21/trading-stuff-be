import express from "express";
import {
  editUser,
  getProfile,
  getUsers,
  getUserInWithinDay,
  followingUser,
  getFollowedUser,
  unfollowUser,
  getFollowingUser,
  getUserById,
  banUser,
} from "../controller/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const userRoute = express.Router();

userRoute.get("/", authenticate, isAdmin, getUsers);

userRoute.get("/info/:id", getUserById);

userRoute.get("/me", authenticate, getProfile);

userRoute.put("/edit", authenticate, editUser);

userRoute.get("/statis", authenticate, isAdmin, getUserInWithinDay);

userRoute.get("/follow/:userId", authenticate, followingUser);

userRoute.get("/me/followed_by", authenticate, getFollowedUser);

userRoute.get("/me/following", authenticate, getFollowingUser);

userRoute.delete("/follow/:userId", authenticate, unfollowUser);

userRoute.get("/ban/:id", authenticate, isAdmin, banUser);

export default userRoute;
