import express from "express";
import {
  createComment,
  deleteComment,
  getAllCommentByPost,
  updateComment,
} from "../controller/comment.controller.js";

const commentRoute = express.Router();

commentRoute.get("/", getAllCommentByPost);

commentRoute.post("/create", createComment);

commentRoute.patch("/update/:id", updateComment);

commentRoute.delete("/delete/:id", deleteComment);

export default commentRoute;
