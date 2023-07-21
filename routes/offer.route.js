import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  approveOffer,
  createOffer,
  rejectOffer,
  getOfferByPost,
  editOffer,
} from "../controller/offer.controller.js";

const offerRoute = express.Router();

offerRoute.get("/post/:id", getOfferByPost);

offerRoute.post("/create", authenticate, createOffer);

offerRoute.put("/approve/:id", authenticate, approveOffer);

offerRoute.put("/reject/:id", authenticate, rejectOffer);

offerRoute.put("/edit/:id", authenticate, editOffer);

export default offerRoute;
