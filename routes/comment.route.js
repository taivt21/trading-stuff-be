import express from "express";
import {
  createComment,
  deleteComment,
  getAllCommentByPost,
  updateComment,
} from "../controller/comment.controller.js";
import { uploadImage } from "../middlewares/uploadImage.js";

const commentRoute = express.Router();

commentRoute.get("/", getAllCommentByPost);

commentRoute.post("/create", uploadImage, createComment);

commentRoute.patch("/update/:id", uploadImage, updateComment);

commentRoute.delete("/delete/:id", deleteComment);

export default commentRoute;
