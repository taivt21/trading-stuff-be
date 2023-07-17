import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    point: { type: Number },
    img: { type: String },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Invoices = mongoose.model("Invoices", InvoiceSchema);

export default Invoices;
