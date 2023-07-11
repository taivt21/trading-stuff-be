import express from "express";
import userRoute from "./user.route.js";
import postRoute from "./post.route.js";
import commentRoute from "./comment.route.js";
import favouriteRoute from "./favourite.route.js";
import authRoute from "./auth.route.js";
import testRoute from "./test.route.js";

const routes = express.Router();

routes.use("/user", userRoute);
routes.use("/post", postRoute);
routes.use("/comment", commentRoute);
routes.use("/favourite", favouriteRoute);
routes.use("/test", testRoute);

routes.use("/auth", authRoute);

export default routes;
