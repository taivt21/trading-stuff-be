import express from "express";
import User from "../entities/user.js";

const testRoute = express.Router();

testRoute.get("/:id", async (req, res) => {
  console.log(req.params.id);

  res.status(200).json({
    msg: "hello word",
  });
});

export default testRoute;
