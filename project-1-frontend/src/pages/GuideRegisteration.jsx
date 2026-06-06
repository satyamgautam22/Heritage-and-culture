import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GuideRegistration = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [languages, setLanguages] = useState(""); // comma separated
  const [experience, setExperience] = useState(""); // in years

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!location.trim()) return "Location is required.";
    if (!gender) return "Please select your gender.";
    const ageNum = Number(age);
    if (!age || Number.isNaN(ageNum) || ageNum < 10 || ageNum > 120)
      return "Enter a valid age (10-120).";
    if (!languages.trim())
      return "Languages field is required (e.g. Hindi, English).";
    const expNum = Number(experience);
    if (experience === "" || Number.isNaN(expNum) || expNum < 0)
      return "Enter a valid experience (>= 0).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationMsg = validate();
    if (validationMsg) return setError(validationMsg);

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        location: location.trim(),
        gender,
        age: Number(age),
        languages: languages.trim(),
        experience: Number(experience),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/guide/register`,
        payload,
        { withCredentials: true }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/logingguide"), 1200);
      } else {
        setError(res.data?.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2EB] via-[#FDF7EC] to-[#EFE2D0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side (Info Panel) */}
        <div className="hidden lg:block">
          <div className="rounded-3xl p-10 bg-[#2E1B0F] text-white shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl" />

            <h2 className="text-4xl font-extrabold tracking-tight">
              Become a Verified Guide ✨
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Join our heritage travel platform and help tourists explore India’s
              culture with local knowledge, stories and safe travel support.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <p className="text-sm text-white/80">
                  Build trust with verified profile & experience.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <p className="text-sm text-white/80">
                  Get booking requests directly from travelers.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <p className="text-sm text-white/80">
                  Earn with secure payments and flexible schedule.
                </p>
              </div>
            </div>

            <p className="mt-10 text-xs text-white/60">
              Note: Your details will be securely stored and used for bookings only.
            </p>
          </div>
        </div>

        {/* Right Side (Form Card) */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-[#E2D7C5] rounded-3xl shadow-2xl p-7 sm:p-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#3A2417]">
              Guide Registration
            </h2>
            <p className="text-sm text-[#5C4330] mt-2">
              Register to become a local guide and start earning with tourism.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5 mt-8"
            noValidate
          >
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-[#5C4330]">
                Full Name
              </label>
              <input
                type="text"
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-[#5C4330]">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-[#5C4330]">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-[#5C4330]">
                Location
              </label>
              <input
                type="text"
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City / State"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-[#5C4330]">
                Gender
              </label>
              <select
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male" className="text-black">
                  Male
                </option>
                <option value="Female" className="text-black">
                  Female
                </option>
                <option value="Other" className="text-black">
                  Other
                </option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="text-sm font-medium text-[#5C4330]">Age</label>
              <input
                type="number"
                min="10"
                max="120"
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                required
              />
            </div>

            {/* Languages */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-[#5C4330]">
                Languages Known
              </label>
              <input
                type="text"
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. Hindi, English, Bengali (comma separated)"
                required
              />
            </div>

            {/* Experience */}
            <div className="md:col-span-2 md:max-w-xs">
              <label className="text-sm font-medium text-[#5C4330]">
                Experience (years)
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 w-full p-3 rounded-2xl bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-4 focus:ring-[#C58F48]/30 focus:border-[#C58F48] outline-none transition"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter years of experience"
                required
              />
            </div>

            {/* Messages */}
            <div className="md:col-span-2 space-y-2">
              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-2xl bg-green-50 border border-green-200 p-3 text-green-700 text-sm">
                  {success}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 rounded-2xl bg-gradient-to-r from-[#8B5E3C] to-[#C58F48] text-white font-bold shadow-lg hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Register as Guide"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-[#5C4330] text-center">
            Already have an account?{" "}
            <a
              href="/logingguide"
              className="text-[#8B5E3C] hover:underline font-semibold"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuideRegistration;
