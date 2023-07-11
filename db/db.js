import mongoose from "mongoose";
mongoose.set("strictQuery", true);

async function connect() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("connect db successfully");
    return connection;
  } catch (error) {
    const { code, hostname } = error;
    if (code == 8000) {
      console.error(
        "Database's username or password is wrong. Please check again"
      );
    }
    if (code == "ENOTFOUND") {
      console.error(
        "Database's username or password is wrong. Please check again",
        hostname
      );
    }

    console.error("Cannot connect to MongoDB");
  }
}
export default connect;
