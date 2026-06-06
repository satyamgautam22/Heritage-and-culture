import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
     const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/register`,
  { name, email, password },
  { withCredentials: true }
);

      if (res.status === 201 || res.status === 200) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB] px-4">
      <div className="w-full max-w-lg bg-[#FDF7EC] border border-[#E2D7C5] rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-semibold text-[#3A2417] mb-4 text-center">
          Create Your Account
        </h2>
        <p className="text-sm text-[#5C4330] text-center mb-6">
          Join the heritage community and start exploring.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Full Name */}
          <div>
            <label className="text-sm text-[#5C4330]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:outline-none focus:ring-2 focus:ring-[#C58F48]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-[#5C4330]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:outline-none focus:ring-2 focus:ring-[#C58F48]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-[#5C4330]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:outline-none focus:ring-2 focus:ring-[#C58F48]"
            />
          </div>

          {/* Errors */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* Register Button */}
          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-full bg-[#8B5E3C] text-white font-semibold hover:bg-[#6C452A] transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-sm text-[#5C4330] text-center">
          Already have an account?{" "}
          <a href="/login" className="text-[#8B5E3C] hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
