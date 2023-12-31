import express from "express";
import userRoute from "./user.route.js";
import postRoute from "./post.route.js";
import commentRoute from "./comment.route.js";
import favouriteRoute from "./favourite.route.js";
import authRoute from "./auth.route.js";
import invoiceRoute from "./invoice.route.js";
import reportRoute from "./report.route.js";
import testRoute from "./test.route.js";
import transactionRoute from "./transaction.route.js";
import auctionRoute from "./auction.route.js";
import offerRoute from "./offer.route.js";

const routes = express.Router();

routes.use("/user", userRoute);
routes.use("/post", postRoute);
routes.use("/comment", commentRoute);
routes.use("/favourite", favouriteRoute);
routes.use("/invoice", invoiceRoute);
routes.use("/report", reportRoute);
routes.use("/auth", authRoute);
routes.use("/transaction", transactionRoute);
routes.use("/auction", auctionRoute);
routes.use("/offer", offerRoute);

routes.use("/test", testRoute);
export default routes;
