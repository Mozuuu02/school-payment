const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "created" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
