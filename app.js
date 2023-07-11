import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import mongoose from "mongoose";

const app = express();
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("connect db successfully");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//router
app.use(routes);

export default app;
