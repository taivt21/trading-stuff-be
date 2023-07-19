import express from "express";
import {
  createReport,
  deleteReport,
  getAllReports,
  updateReport,
} from "../controller/report.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const reportRouter = express.Router();

reportRouter.get("/", authenticate, isAdmin, getAllReports);

reportRouter.post("/create", authenticate, createReport);

reportRouter.patch("/update/:id", updateReport);

reportRouter.delete("/delete/:id", authenticate, deleteReport);

export default reportRouter;
