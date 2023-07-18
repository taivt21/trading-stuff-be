import express from "express";
import User from "../entities/user.js";

const testRoute = express.Router();

testRoute.get("/", async (req, res) => {
  const users = await User.find({}).select("point");

  // tổng điểm hiện có trong hệ thống
  let totalPoint = 0;

  for (let index = 0; index < users.length; index++) {
    totalPoint += users[index].point;
  }

  res.status(200).json({
    msg: "hello word",
  });
});

export default testRoute;
