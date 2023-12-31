import express from "express";
import {
  placeBid,
  getAuctionById,
  getAllAuction,
  deleteHighestBidder,
  getAuctionByPostId,
} from "../controller/auction.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const auctionRouter = express.Router();

auctionRouter.get("/", authenticate, getAllAuction);
auctionRouter.get("/:id", authenticate, getAuctionById);
auctionRouter.get("/post/:id", authenticate, getAuctionByPostId);

auctionRouter.post("/create", authenticate, placeBid);

auctionRouter.delete("/delete/:id", authenticate, deleteHighestBidder);

export default auctionRouter;
