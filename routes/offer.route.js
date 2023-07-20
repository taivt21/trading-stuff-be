import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  approveOffer,
  createOffer,
  getOffByPost,
  rejectOffer,
} from "../controller/offer.controller.js";

const offerRoute = express.Router();

offerRoute.get("/post/:id", getOffByPost);

offerRoute.post("/create", authenticate, createOffer);
offerRoute.put("/approve/:id", authenticate, approveOffer);
offerRoute.put("/reject/:id", authenticate, rejectOffer);

export default offerRoute;
