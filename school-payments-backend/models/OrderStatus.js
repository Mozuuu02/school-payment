const mongoose = require("mongoose");

// ✅ Normalize status (always title-case)
function normalizeStatus(value) {
  if (!value) return value;
  const s = value.toUpperCase();
  if (s === "SUCCESS") return "Success";
  if (s === "FAILED") return "Failed";
  if (s === "PENDING") return "Pending";
  return value;
}

const orderStatusSchema = new mongoose.Schema(
  {
    collect_id: {
      type: String,
      unique: true, // ✅ ensures only one record per transaction
      required: true,
    },
    transaction_amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

// ✅ Format status before saving
orderStatusSchema.pre("save", function (next) {
  this.status = normalizeStatus(this.status);
  next();
});

// ✅ Format status before updates (used by findOneAndUpdate / updateOne)
orderStatusSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  if (this._update.status) {
    this._update.status = normalizeStatus(this._update.status);
  }
  next();
});

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
