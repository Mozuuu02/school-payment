const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
  collect_id: String, // same as in Order
  transaction_amount: Number,
  status: String, // e.g. "SUCCESS", "FAILED", etc.
});

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
