import express from "express";
import {
  getFavourite,
  getFavouriteByUser,
  createFavouritePost,
  deleteFavourite,
  getFavouriteByPost,
} from "../controller/favourite.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
const favouriteRoute = express.Router();

favouriteRoute.get("/", getFavourite);

favouriteRoute.get("/user", authenticate, getFavouriteByUser);

favouriteRoute.get("/post/:id", authenticate, getFavouriteByPost);

favouriteRoute.post("/create", authenticate, createFavouritePost);

favouriteRoute.delete("/delete/:id", authenticate, deleteFavourite);

export default favouriteRoute;
