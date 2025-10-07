import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginIllustration from "../assets/login-illustration.svg"; // 🖼️ SVG illustration

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Both email and password are required.");
      return;
    }

    const res = await login(form.email, form.password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Main container */}
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden w-11/12 md:w-3/5">
        
        {/* Left Section - Blue Gradient Background with Illustration */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-400"></div>
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="relative w-4/5 max-w-md z-10"
          />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10 bg-white">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 whitespace-pre-line text-left">
            {"Hello,\nWelcome Back!"}
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                value={form.email}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                value={form.password}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
