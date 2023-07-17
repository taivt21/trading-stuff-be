import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
  postWithinDay,
} from "../controller/post.controller.js";

import { uploadImage } from "../middlewares/uploadImage.js";
import { authenticate } from "../middlewares/authenticate.js";

const postRoute = express.Router();

postRoute.get("/", getAllPosts);

postRoute.post("/create", authenticate, uploadImage, createPost);

postRoute.patch("/update/:id", authenticate, updatePost);

postRoute.delete("/delete/:id", authenticate, deletePost);

postRoute.get("/statis", postWithinDay);

export default postRoute;
