import express from "express";
import { placeBid } from "../controller/auction.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const auctionRouter = express.Router();

// auctionRouter.get("/", authenticate);

auctionRouter.post("/create", authenticate, placeBid);

// auctionRouter.patch("/update/:id", updateReport);

// auctionRouter.delete("/delete/:id", authenticate, deleteReport);

export default auctionRouter;
