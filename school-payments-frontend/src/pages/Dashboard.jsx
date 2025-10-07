import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const itemsPerPage = 9;

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.getAll("status") || []
  );

  const [sortConfig, setSortConfig] = useState({
    key: searchParams.get("sortKey") || "",
    direction: searchParams.get("sortDir") || "asc",
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transactions");
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const params = {};

    if (search) params.search = search;
    if (statusFilter.length) params.status = statusFilter;
    if (sortConfig.key) {
      params.sortKey = sortConfig.key;
      params.sortDir = sortConfig.direction;
    }
    params.page = currentPage;

    setSearchParams(params);
  }, [search, statusFilter, sortConfig, currentPage]);

  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) =>
        (p.custom_order_id || "").toLowerCase().includes(search.toLowerCase())
      )
      .filter((p) =>
        statusFilter.length ? statusFilter.includes(p.status) : true
      );
  }, [payments, search, statusFilter]);

  const sortedPayments = useMemo(() => {
    if (!sortConfig.key) return filteredPayments;
    return [...filteredPayments].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPayments, sortConfig]);

  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
  const currentPayments = sortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter([]);
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Filters Row */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-wrap justify-between items-center">
          {/* Left Side: Search, Status, Sort, Reset */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 md:w-56 p-2  bg-blue-50 border-gray-800 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder:text-gray-700 placeholder:opacity-100"
            />

            {/* Status Filter */}
            <select
              value={statusFilter[0] || ""}
              onChange={(e) => {
                const value = e.target.value;
                setStatusFilter(value ? [value] : []);
                setCurrentPage(1);
              }}
              className="bg-blue-50 border-gray-800 rounded p-2 w-40"
            >
              <option value="">Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split("-");
                setSortConfig({ key, direction });
              }}
              className="bg-blue-50  border-gray-800 rounded p-2 w-52"
            >
              <option value="">Sort By</option>
              <option value="order_amount-asc">Order Amount (Low → High)</option>
              <option value="order_amount-desc">Order Amount (High → Low)</option>
              <option value="transaction_amount-asc">
                Transaction Amount (Low → High)
              </option>
              <option value="transaction_amount-desc">
                Transaction Amount (High → Low)
              </option>
              <option value="created_at-asc">Date (Oldest First)</option>
              <option value="created_at-desc">Date (Newest First)</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="bg-blue-50 border-gray-800 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Right Side: Add Payment */}
          <button
            onClick={() => navigate("/payment")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition"
          >
            Add Payment
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="min-w-full table-auto bg-white shadow-md  px-2 rounded-lg border-separate border-spacing-y-1">
            <thead className=" text-gray-500 font-medium text-sm">
              <tr>
                {[
                  "Sr.No",
                  "Collect ID",
                  "School ID",
                  "Gateway",
                  "Order Amount",
                  "Transaction Amount",
                  "Status",
                  "Custom Order ID",
                ].map((label) => (
                  <th key={label} className="px-3 py-2 text-center">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">
                    Loading...
                  </td>
                </tr>
              ) : currentPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentPayments.map((p, idx) => (
                  <tr
                    key={p.collect_id}
                    className="bg-blue-50 text-sm hover:-translate-y-1 hover:shadow-md transition-transform hover:bg-blue-100"
                  >
                    {/* 🟢 Rounded left edge */}
                    <td className="px-3 py-2 text-center rounded-l-sm">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>

                    <td className="px-3 py-2 text-center">{p.collect_id}</td>
                    <td className="px-3 py-2 text-center">{p.school_id}</td>
                    <td className="px-3 py-2 text-center">{p.gateway}</td>
                    <td className="px-3 py-2 text-center">{p.order_amount}</td>
                    <td className="px-3 py-2 text-center">
                      {p.transaction_amount}
                    </td>
                    <td
                      className={`px-3 py-2 text-center font-semibold ${
                        p.status === "Success"
                          ? "text-green-600"
                          : p.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {p.status}
                    </td>

                    {/* 🟢 Rounded right edge */}
                    <td className="px-3 py-2 text-center rounded-r-sm">
                      {p.custom_order_id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredPayments.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center border border-gray-600 rounded-full px-3 py-1 ${
                currentPage === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="ml-1 text-sm font-medium">Prev</span>
            </button>

            <span className="text-sm font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`flex items-center border border-gray-600 rounded-full px-3 py-1 ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="mr-1 text-sm font-medium">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
