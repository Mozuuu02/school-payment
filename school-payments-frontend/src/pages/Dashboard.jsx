import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // Axios instance

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transactions");
        setPayments(res.data); // transactions.js returns an array
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredPayments = payments.filter((p) =>
    (p.custom_order_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Payment History
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Search & Add Payment */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2 w-full md:w-1/2 mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Search(Order ID...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select className="border border-gray-300 rounded p-2">
              <option>Filter By</option>
              <option>Status</option>
              <option>School</option>
            </select>
          </div>
          <button
            onClick={() => navigate("/payment")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          >
            Add Payment
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg border-separate border-spacing-y-1">
            <thead className="bg-blue-0 text-gray-800 font-semibold">
              <tr>
                <th className="px-3 py-2 text-center">Sr.No</th>
                <th className="px-3 py-2 text-center">Collect ID</th>
                <th className="px-3 py-2 text-center">School ID</th>
                <th className="px-3 py-2 text-center">Gateway</th>
                <th className="px-3 py-2 text-center">Order Amount</th>
                <th className="px-3 py-2 text-center">Transaction Amount</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-center">Custom Order ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p, idx) => (
                  <tr
                    key={p.collect_id}
                    className="bg-blue-50 text-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                  >
                    <td className="px-3 py-2 text-center">{idx + 1}</td>
                    <td className="px-3 py-2 text-center">{p.collect_id}</td>
                    <td className="px-3 py-2 text-center">{p.school_id}</td>
                    <td className="px-3 py-2 text-center">{p.gateway}</td>
                    <td className="px-3 py-2 text-center">{p.order_amount}</td>
                    <td className="px-3 py-2 text-center">{p.transaction_amount}</td>
                    <td className="px-3 py-2 text-center text-yellow-500 font-semibold">
                      {p.status}
                    </td>
                    <td className="px-3 py-2 text-center">{p.custom_order_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
