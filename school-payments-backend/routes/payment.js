const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment"); // your payment model
const { protect } = require("../middleware/auth");
const Razorpay = require("razorpay");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order route
router.post("/create-order", protect, async (req, res) => {
  const { amount } = req.body;

  if (!amount) return res.status(400).json({ message: "Amount is required" });

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save in DB (optional)
    const payment = await Payment.create({
      user: req.user._id,
      orderId: order.id,
      amount,
      status: "created",
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ message: "Server error creating order" });
  }
});

// Get payments for logged-in user
router.get("/user", protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
