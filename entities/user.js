import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phoneNumber: { type: String, default: "N/A" },
    fullname: { type: String },
    img: { type: String },
    status: { type: Boolean, default: true },
    roleName: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    point: { type: Number, default: 0 },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    followedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

export default User;
