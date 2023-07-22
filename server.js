import app from "./app.js";
import mongoose from "mongoose";
import cron from "node-cron";
import { updateAuctionsAndTransactions } from "./config/myCronJob.js";
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("strictQuery", true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

// Lên lịch chạy hàm updateAuctionsAndTransactions mỗi 1 phút
// cron.schedule("* * * * *", async () => {
//   try {
//     console.log("Đang chạy cron job...");
//     await updateAuctionsAndTransactions();
//   } catch (error) {
//     console.error("Lỗi khi chạy cron job:", error);
//   }
// });
app.listen(port, async () => {
  // await connect();
  console.log(`listening on ${port}`);
});
