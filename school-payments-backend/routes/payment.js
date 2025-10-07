const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");

// Load environment variables
const EDVIRON_API_KEY = process.env.EDVIRON_API_KEY;
const PG_SECRET_KEY = process.env.PG_SECRET_KEY;
const SCHOOL_ID = process.env.SCHOOL_ID;

// ===============================
// ✅ 1️⃣ CREATE COLLECT REQUEST
// ===============================
router.post("/create-collect-request", async (req, res) => {
  const { amount, callback_url, custom_order_id } = req.body;

  if (!amount || !callback_url || !custom_order_id) {
    return res
      .status(400)
      .json({ message: "Amount, callback_url, and custom_order_id are required" });
  }

  try {
    // Generate JWT
    const signPayload = {
      school_id: SCHOOL_ID,
      amount: amount.toString(),
      callback_url,
    };
    const sign = jwt.sign(signPayload, PG_SECRET_KEY);

    const BASE_URL = "https://dev-vanilla.edviron.com";
    console.log("🌐 Calling DEV Edviron API...");

    // Create collect request
    const response = await axios.post(
      `${BASE_URL}/erp/create-collect-request`,
      { school_id: SCHOOL_ID, amount: amount.toString(), callback_url, sign },
      {
        headers: {
          Authorization: `Bearer ${EDVIRON_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Edviron API response:", response.data);

    const { collect_request_id, payment_link, collect_request_url } = response.data;

    // ✅ Save or update Order
    await Order.findOneAndUpdate(
      { collect_id: collect_request_id },
      {
        collect_id: collect_request_id,
        school_id: SCHOOL_ID,
        gateway: "Edviron",
        order_amount: amount,
        custom_order_id,
      },
      { upsert: true, new: true }
    );

    // ✅ Create or update initial OrderStatus (avoid duplicates)
    await OrderStatus.findOneAndUpdate(
      { collect_id: collect_request_id },
      { transaction_amount: 0, status: "Pending" },
      { upsert: true, new: true }
    );

    res.json({
      message: "Payment link created and saved successfully",
      data: {
        collect_id: collect_request_id,
        payment_link: payment_link || collect_request_url || null,
      },
    });
  } catch (error) {
    console.error("❌ Error creating payment link:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to create payment link",
      error: error.response?.data || error.message,
    });
  }
});

// ===============================
// ✅ 2️⃣ VERIFY PAYMENT CALLBACK
// ===============================
router.post("/verify", async (req, res) => {
  try {
    const { EdvironCollectRequestId, status: frontendStatus } = req.body;

    if (!EdvironCollectRequestId) {
      return res.status(400).json({ message: "EdvironCollectRequestId is required" });
    }

    console.log("🔍 Verifying payment for:", EdvironCollectRequestId);

    // Fetch status from Edviron
    const signPayload = {
      school_id: SCHOOL_ID,
      collect_request_id: EdvironCollectRequestId,
    };
    const sign = jwt.sign(signPayload, PG_SECRET_KEY);

    const BASE_URL = "https://dev-vanilla.edviron.com";

    const response = await axios.get(
      `${BASE_URL}/erp/collect-request/${EdvironCollectRequestId}?school_id=${SCHOOL_ID}&sign=${sign}`,
      {
        headers: {
          Authorization: `Bearer ${EDVIRON_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { transaction_amount, status: edvironStatus } = response.data;

    console.log("🔍 edvironStatus:", edvironStatus);
    console.log("🔍 frontendStatus:", frontendStatus);

    // Normalize status
    let finalStatus = "Pending";
    if (edvironStatus?.toLowerCase() === "success" || frontendStatus?.toLowerCase() === "success") {
      finalStatus = "Success";
    } else if (
      edvironStatus?.toLowerCase() === "failed" ||
      frontendStatus?.toLowerCase() === "failed" ||
      frontendStatus?.toLowerCase() === "cancelled"
    ) {
      finalStatus = "Failed";
    }

    // ✅ Update DB record safely
    await OrderStatus.findOneAndUpdate(
      { collect_id: EdvironCollectRequestId },
      { transaction_amount, status: finalStatus },
      { upsert: true, new: true }
    );

    console.log("✅ Payment verified successfully:", finalStatus);

    res.json({
      message: "Payment verified successfully",
      data: { status: finalStatus, transaction_amount },
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error.response?.data || error.message);
    res.status(500).json({
      message: "Payment verification failed",
      error: error.response?.data || error.message,
    });
  }
});

// ===============================
// ✅ 3️⃣ CHECK STATUS (manual fetch)
// ===============================
router.get("/check-status/:collect_request_id", async (req, res) => {
  const { collect_request_id } = req.params;

  if (!collect_request_id) {
    return res.status(400).json({ message: "collect_request_id is required" });
  }

  try {
    const signPayload = {
      school_id: SCHOOL_ID,
      collect_request_id,
    };
    const sign = jwt.sign(signPayload, PG_SECRET_KEY);

    const BASE_URL = "https://dev-vanilla.edviron.com";

    const response = await axios.get(
      `${BASE_URL}/erp/collect-request/${collect_request_id}?school_id=${SCHOOL_ID}&sign=${sign}`,
      {
        headers: {
          Authorization: `Bearer ${EDVIRON_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { transaction_amount, status } = response.data;

    await OrderStatus.findOneAndUpdate(
      { collect_id: collect_request_id },
      { transaction_amount, status },
      { upsert: true, new: true }
    );

    res.json({
      message: "Payment status fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Error fetching payment status:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to fetch payment status",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
