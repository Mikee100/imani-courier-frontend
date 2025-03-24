import React, { useState, useContext } from "react";
import { AuthContext } from "../General/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // New state for overlay

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const redirectPath = await login(email, password);
      
      setShowOverlay(true); // Show overlay immediately after success
      setSuccess("Login successful!");

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 2000); // Delay redirect by 2 seconds
    } catch {
      setError("Invalid email or password");
      setLoading(false); // Ensure loading stops if login fails
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Left Side - Image */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/pexels-photo-6169634.webp')" }}
      ></div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 shadow-lg">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h2>

          {/* Success and Error Messages */}
          {error && (
            <div className="text-red-600 text-center p-2 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-center p-2 bg-green-100 rounded-md">
              {success}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="mb-5 relative">
              <label className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-5">
              <a href="/forgot-password" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

     
{showOverlay && (
  <div className="overlay">
    <div className="spinner"></div>
  </div>
)}


    </div>
  );
};

export default LoginPage;
