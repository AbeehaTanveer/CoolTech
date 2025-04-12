import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const res = await axios.post("http://localhost:1010/login", formData);
      const { token, user } = res.data;
  
      // Store in localStorage
      localStorage.setItem("fullName", user.fullName);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("roles", user.roles); // Optional but helpful
  
      // 👉 Check role and navigate
      if (user.roles === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1a1a2e] p-4">
      <div className="relative w-full max-w-md">
        {/* Background shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#4f46e5] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#a855f7] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Login card */}
        <div className="relative bg-[#1e1e2e] bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden p-8 border border-[#2d3748]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#e2e8f0]">Welcome Back</h2>
            <p className="text-[#94a3b8]">Login to your Cool Tech account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#cbd5e1] mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2d3748] bg-opacity-70 border border-[#4a5568] rounded-lg text-[#e2e8f0] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#cbd5e1] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2d3748] bg-opacity-70 border border-[#4a5568] rounded-lg text-[#e2e8f0] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${loading ? 'bg-[#4f46e5] opacity-70 cursor-not-allowed' : 'bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:opacity-90'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Log In'}
            </button>

            <div className="text-center text-sm text-[#94a3b8]">
              Don't have an account?{' '}
              <a href="/register" className="text-[#818cf8] hover:text-[#6366f1] transition-colors">
                Register here
              </a>
            </div>
          </form>
        </div>
      </div>


    </div>
  );
};

export default Login;