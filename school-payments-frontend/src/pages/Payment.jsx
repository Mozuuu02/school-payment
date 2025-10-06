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

    try {
      // Corrected endpoint to match backend
      const res = await api.post("/payments/create-order", { amount: Number(amount) });
      console.log("Order created:", res.data);
      setSuccess("Payment order created successfully!");
      // You can now call Razorpay here if integrated
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Payment failed. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handlePayment} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}
        <input
          type="number"
          placeholder="Amount"
          className="input mb-4 w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Pay
        </button>
      </form>
    </div>
  );
}
