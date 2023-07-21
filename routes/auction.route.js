import express from "express";
import {
  placeBid,
  getAuctionById,
  getAllAuction,
  deleteHighestBidder,
} from "../controller/auction.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const auctionRouter = express.Router();

auctionRouter.get("/", authenticate, getAllAuction);
auctionRouter.get("/:id", authenticate, getAuctionById);

auctionRouter.post("/create", authenticate, placeBid);

// auctionRouter.patch("/update/:id", updateReport);

auctionRouter.delete("/delete/:id", authenticate, deleteHighestBidder);

export default auctionRouter;
