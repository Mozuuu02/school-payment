import { useState } from "react";
import api from "../utils/api";

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const res = await api.post("/payments/create-collect-request", {
       amount: Number(amount),
       callback_url: `${process.env.REACT_APP_BASE_URL}/payment-callback`,
      custom_order_id: `ORD-${Date.now()}`,
      });

      console.log("💬 Backend response:", res.data);

      // extract link (either from dev or live)
      const link =
        res.data?.data?.payment_link ||
        res.data?.data?.collect_request_url ||
        null;

      if (!link) {
        setError("No payment link returned from Edviron. Please check backend response.");
        console.error("⚠️ No payment link found:", res.data);
        return;
      }

      setSuccess("Redirecting to Edviron payment gateway...");
      console.log("✅ Redirecting to:", link);

      // redirect to Edviron payment page
      window.location.href = link;
    } catch (err) {
      console.error("❌ Error creating order:", err.response?.data || err.message);
      setError("Payment failed. Please check the console for more details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handlePayment}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Make Payment</h2>

        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

        <input
          type="number"
          placeholder="Amount"
          className="mb-4 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Pay
        </button>
      </form>
    </div>
  );
}
