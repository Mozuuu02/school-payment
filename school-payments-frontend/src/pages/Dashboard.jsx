import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's payment history from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments/user"); // endpoint should return payments for this user
        setPayments(res.data.payments || []);
      } catch (err) {
        console.log("Error fetching payments:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPayments();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNewPayment = () => {
    navigate("/payment"); // redirect to payment page
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user._id}</p>
        </div>

        {/* New Payment Button */}
        <button
          onClick={handleNewPayment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
        >
          Make a New Payment
        </button>

        {/* Payment History */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Payment History</h2>
          {loading ? (
            <p>Loading payments...</p>
          ) : payments.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Order ID</th>
                  <th className="border-b p-2">Amount</th>
                  <th className="border-b p-2">Status</th>
                  <th className="border-b p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="border-b p-2">{p.order_id}</td>
                    <td className="border-b p-2">₹{p.amount}</td>
                    <td
                      className={`border-b p-2 ${
                        p.status === "success" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {p.status}
                    </td>
                    <td className="border-b p-2">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
