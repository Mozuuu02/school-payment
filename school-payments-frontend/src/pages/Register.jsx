import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import registerIllustration from "../assets/register-illustration.svg"; // 🖼️ SVG illustration

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    const res = await register(form.name, form.email, form.password);
    if (res.success) {
      navigate("/"); // ✅ redirect after successful registration
    } else {
      setError(res.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Main container with vibrant shadow */}
      <div
        className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden w-11/12 md:w-3/5"
        style={{
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.15), 0 20px 50px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Section - Teal Gradient Background with Illustration */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-400"></div>
          <img
            src={registerIllustration}
            alt="Register Illustration"
            className="relative w-4/5 max-w-md z-10"
          />
        </div>

        {/* Right Section - Register Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10 bg-white">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Create Account 
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                value={form.name}
              />
            </div>

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
              Register
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
