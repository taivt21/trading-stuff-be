import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
} from "../controller/post.controller.js";

import { uploadImage } from "../middlewares/uploadImage.js";
import { authenticate } from "../middlewares/authenticate.js";

const postRoute = express.Router();

postRoute.get("/", getAllPosts);

postRoute.post("/create", authenticate, uploadImage, createPost);

postRoute.patch("/update/:id", updatePost);

postRoute.delete("/delete/:id", deletePost);

export default postRoute;
