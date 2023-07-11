import express from "express";

const testRoute = express.Router();

testRoute.get("/", (req, res) => {
  res.status(200).json({
    msg: "hello word",
  });
});

export default testRoute;
