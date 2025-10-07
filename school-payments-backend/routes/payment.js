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

/**
 * ✅ Create Edviron Payment Link AND Save to MongoDB
 * POST /api/payments/create-collect-request
 */
router.post("/create-collect-request", async (req, res) => {
  const { amount, callback_url, custom_order_id } = req.body;

  if (!amount || !callback_url || !custom_order_id) {
    return res
      .status(400)
      .json({ message: "Amount, callback_url, and custom_order_id are required" });
  }

  try {
    // 1️⃣ Generate JWT
    const signPayload = {
      school_id: SCHOOL_ID,
      amount: amount.toString(),
      callback_url,
    };
    const sign = jwt.sign(signPayload, PG_SECRET_KEY);

    // 2️⃣ Always use DEV Edviron API (per assessment)
    const BASE_URL = "https://dev-vanilla.edviron.com";

    console.log("🌐 Calling DEV Edviron API...");

    const response = await axios.post(
      `${BASE_URL}/erp/create-collect-request`,
      {
        school_id: SCHOOL_ID,
        amount: amount.toString(),
        callback_url,
        sign,
      },
      {
        headers: {
          Authorization: `Bearer ${EDVIRON_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Edviron API response:", response.data);

    // 3️⃣ Extract relevant fields
    const { collect_request_id, payment_link, collect_request_url } = response.data;

    // 4️⃣ Save Order in MongoDB
    const newOrder = new Order({
      collect_id: collect_request_id,
      school_id: SCHOOL_ID,
      gateway: "Edviron",
      order_amount: amount,
      custom_order_id,
    });

    await newOrder.save();

    // 5️⃣ Save initial OrderStatus
    const newStatus = new OrderStatus({
      collect_id: collect_request_id,
      transaction_amount: 0,
      status: "Pending",
    });

    await newStatus.save();

    // 6️⃣ Return response — prefer collect_request_url (sandbox)
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

/**
 * ✅ Check Edviron Payment Status
 * GET /api/payments/check-status/:collect_request_id
 */
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

    // ✅ Update OrderStatus in MongoDB
    const { transaction_amount, status } = response.data;
    await OrderStatus.findOneAndUpdate(
      { collect_id: collect_request_id },
      { transaction_amount, status },
      { new: true }
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
