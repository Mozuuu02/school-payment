const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  collect_id: String,
  school_id: String,
  gateway: String,
  order_amount: Number,
  custom_order_id: String,
});

module.exports = mongoose.model("Order", orderSchema);
