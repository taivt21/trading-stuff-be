import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
  exchangeStuff,
} from "../controller/post.controller.js";

import { uploadImage } from "../middlewares/uploadImage.js";
import { authenticate } from "../middlewares/authenticate.js";

const postRoute = express.Router();

postRoute.get("/", getAllPosts);

postRoute.get("/:id", getPostById);

postRoute.post("/create", authenticate, uploadImage, createPost);

postRoute.patch("/update/:id", authenticate, updatePost);

postRoute.delete("/delete/:id", authenticate, deletePost);

postRoute.post("/exchange", authenticate, exchangeStuff);

export default postRoute;
