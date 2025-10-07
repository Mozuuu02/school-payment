const express = require("express");
const router = express.Router();
const WebhookLog = require("../models/WebhookLog");
const OrderStatus = require("../models/OrderStatus");

// 🧩 Receive Webhook from Edviron
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const orderInfo = body.order_info || {};

    // ✅ Log the webhook (keep your existing functionality)
    await WebhookLog.create({
      event: body.event || "payment_update",
      payload: body,
    });

    // ✅ Update OrderStatus collection (as per Edviron doc)
    if (orderInfo.order_id) {
      await OrderStatus.findOneAndUpdate(
        { collect_id: orderInfo.order_id },
        {
          transaction_amount: orderInfo.transaction_amount || 0,
          status: orderInfo.status || "unknown",
        },
        { new: true }
      );
    }

    console.log("✅ Webhook received for:", orderInfo.order_id);
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 🧩 Get webhook logs (admin protected)
const { protect, admin } = require("../middleware/auth");
router.get("/", protect, admin, async (req, res) => {
  const logs = await WebhookLog.find().sort({ createdAt: -1 });
  res.json(logs);
});

module.exports = router;
