import express from "express";
import {
  createComment,
  deleteComment,
  getAllCommentByPost,
  updateComment,
  getAllComment,
} from "../controller/comment.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const commentRoute = express.Router();

commentRoute.get("/:id", getAllCommentByPost);

commentRoute.get("/", getAllComment);

commentRoute.post("/create", authenticate, createComment);

commentRoute.patch("/update/:id", authenticate, updateComment);

commentRoute.delete("/delete/:id", authenticate, deleteComment);

export default commentRoute;
