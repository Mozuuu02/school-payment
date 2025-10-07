const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");

/**
 * 1️⃣ Fetch All Transactions
 * GET /transactions
 */
router.get("/", async (req, res) => {
  try {
    const transactions = await Order.aggregate([
      {
        $lookup: {
          from: "orderstatuses",
          localField: "collect_id",    // ✅ match string field
          foreignField: "collect_id",  // ✅ match string field
          as: "status_info",
        },
      },
      { $unwind: "$status_info" },
      {
        $project: {
          _id: 0,
          collect_id: 1,
          school_id: 1,
          gateway: 1,
          order_amount: 1,
          transaction_amount: "$status_info.transaction_amount",
          status: "$status_info.status",
          custom_order_id: 1,
          created_at: "$status_info.created_at" // ✅ Added this line only
        },
      },
    ]);

    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 2️⃣ Fetch Transactions by School
 * GET /transactions/school/:schoolId
 */
router.get("/school/:schoolId", async (req, res) => {
  const { schoolId } = req.params;

  try {
    const transactions = await Order.aggregate([
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "collect_id",    // ✅
          foreignField: "collect_id",  // ✅
          as: "status_info",
        },
      },
      { $unwind: "$status_info" },
      {
        $project: {
          _id: 0,
          collect_id: 1,
          school_id: 1,
          gateway: 1,
          order_amount: 1,
          transaction_amount: "$status_info.transaction_amount",
          status: "$status_info.status",
          custom_order_id: 1,
          created_at: "$status_info.created_at" // ✅ Added this line only
        },
      },
    ]);

    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by school:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 3️⃣ Check Transaction Status
 * GET /transaction-status/:custom_order_id
 */
router.get("/transaction-status/:custom_order_id", async (req, res) => {
  const { custom_order_id } = req.params;

  try {
    const transaction = await Order.aggregate([
      { $match: { custom_order_id } },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "collect_id",    // ✅
          foreignField: "collect_id",  // ✅
          as: "status_info",
        },
      },
      { $unwind: "$status_info" },
      {
        $project: {
          _id: 0,
          collect_id: 1,
          school_id: 1,
          order_amount: 1,
          transaction_amount: "$status_info.transaction_amount",
          status: "$status_info.status",
          custom_order_id: 1,
          created_at: "$status_info.created_at" // ✅ Added this line only
        },
      },
    ]);

    if (!transaction.length) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction[0]);
  } catch (err) {
    console.error("Error checking transaction status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
