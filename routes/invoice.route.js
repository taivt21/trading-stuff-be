import express from "express";
import {
  getInvoce,
  createInvoice,
  deleteInvoice,
  rejectedInvoice,
  approvedInvoice,
} from "../controller/invoice.controller.js";
import { uploadImage } from "../middlewares/uploadImage.js";
import { authenticate } from "../middlewares/authenticate.js";

const invoiceRouter = express.Router();

invoiceRouter.get("/", getInvoce);

invoiceRouter.post("/create", authenticate, uploadImage, createInvoice);

invoiceRouter.patch("/reject/:id", authenticate, rejectedInvoice);

invoiceRouter.patch("/approve/:id", authenticate, approvedInvoice);

invoiceRouter.delete("/delete/:id", authenticate, deleteInvoice);

export default invoiceRouter;
