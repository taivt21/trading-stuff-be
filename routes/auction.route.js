import express from "express";
import {
  placeBid,
  getAuctionById,
  getAllAuction,
  deleteHighestBidder,
  getAuctionByPostId,
  aprroveAuction,
  rejectAuction,
} from "../controller/auction.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const auctionRouter = express.Router();

auctionRouter.get("/", authenticate, getAllAuction);
auctionRouter.get("/:id", authenticate, getAuctionById);
auctionRouter.get("/post/:id", authenticate, getAuctionByPostId);

auctionRouter.post("/create", authenticate, placeBid);

auctionRouter.post("/approve/:transactionId", authenticate, aprroveAuction);
auctionRouter.post("/reject/:transactionId", authenticate, rejectAuction);

auctionRouter.delete("/delete/:id", authenticate, deleteHighestBidder);

export default auctionRouter;
