import express from "express";
import {
  getFavourite,
  getFavouriteByUser,
  createFavouritePost,
  deleteFavourite,
  getFavouriteByPost,
} from "../controller/favourite.controller.js";
// const authenticate = require("../middlewares/authenticate");
const favouriteRoute = express.Router();

favouriteRoute.get("/", getFavourite);

favouriteRoute.get(
  "/user",
  //  authenticate,
  getFavouriteByUser
);

favouriteRoute.get("/post/:id", getFavouriteByPost);

favouriteRoute.post("/create", createFavouritePost);

favouriteRoute.delete(
  "/delete/:id",
  //   authenticate,
  deleteFavourite
);

export default favouriteRoute;
