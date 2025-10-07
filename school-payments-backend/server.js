const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Import routes
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment"); // single file handles everything
const webhookRoutes = require("./routes/webhook");
const transactionRoutes = require("./routes/transactions");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes); // ✅ handles create + verify
app.use("/api/webhook", webhookRoutes);
app.use("/api/transactions", transactionRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ API Server Running");
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ✅ MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));

module.exports = app;
