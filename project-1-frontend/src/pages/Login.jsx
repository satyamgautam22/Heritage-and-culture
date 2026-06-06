import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);

      // SUCCESS TOAST
      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (err) {
      // ERROR TOAST
      toast.error( "Login failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB] px-4">
      <div className="w-100 max-w-4xl bg-white rounded-2xl shadow-xl border border-[#E2D7C5] overflow-hidden">

        <div className="p-8 flex flex-col justify-center bg-[#FDF7EC]">
          <h2 className="text-2xl font-semibold text-[#3A2417] mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="text-sm text-[#5C4330]">Email</label>
              <input
                
                value={email}
                type="email"
                name="email"
                autoComplete="username"
                
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:outline-none focus:ring-2 focus:ring-[#C58F48]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-[#5C4330]">Password</label>
              <input
               
               
               type="password"
                 name="password"
               autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:outline-none focus:ring-2 focus:ring-[#C58F48]"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-full bg-[#8B5E3C] text-white font-semibold hover:bg-[#6C452A] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Login"}
              
            </button>
          </form>

          <p className="text-sm text-[#5C4330] mt-4">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#8B5E3C] font-medium hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
