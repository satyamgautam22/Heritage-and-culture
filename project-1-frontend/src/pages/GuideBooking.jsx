import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";

export default function GuideBooking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    date: "",
    time: "",
    budget: "",
    experience: "",
  });

  const [meta, setMeta] = useState({
    locations: [],
    experiences: [],
  });

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const canSearch = useMemo(() => {
    return (
      form.name &&
      form.email &&
      form.mobile &&
      form.location &&
      form.date &&
      form.time &&
      form.budget
    );
  }, [form]);

  useEffect(() => {
    const getMeta = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/guide/meta`
        );
        const { locations = [], experiences = [] } = res.data || {};
        setMeta({
          locations: Array.isArray(locations) ? locations : [],
          experiences: Array.isArray(experiences) ? experiences : [],
        });
      } catch {
        setMeta({ locations: [], experiences: [] });
      }
    };
    getMeta();
  }, []);

  const searchGuides = async (e) => {
    e.preventDefault();
    if (!canSearch) return setError("Please fill all fields before searching.");
    setSearching(true);
    setError("");

    try {
      let res;

      if (form.experience) {
        const params = new URLSearchParams({
          location: form.location,
          minExp: String(form.experience),
          budget: String(form.budget),
        });

        try {
          res = await api.get(
            `${import.meta.env.VITE_API_URL}/api/guide/search?${params.toString()}`
          );
        } catch {
          res = await api.get(
            `${import.meta.env.VITE_API_URL}/api/guide/${encodeURIComponent(
              form.location,
              form.experience,
              form.budget
            )}`
          );
        }
      } else {
        res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/guide/${encodeURIComponent(
            form.location,
            form.experience,
            form.budget
          )}`
        );
      }

      const list = res.data?.guides || [];
      setGuides(list);
      if (list.length === 0) setError("No guide found with these filters.");
    } catch (err) {
      setGuides([]);
      setError(err?.response?.data?.message || "No guide found in this location.");
    } finally {
      setSearching(false);
    }
  };

  const bookGuide = async (guideId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to book a guide.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const create = await api.post(
        `${import.meta.env.VITE_API_URL}/api/booking/createbooking`,
        { ...form, guideId, userId }
      );
      const bookingId = create.data?.booking?._id;

      const checkout = await api.post(
        `${import.meta.env.VITE_API_URL}/api/booking/create-checkout-session`,
        { bookingId }
      );
      window.location.href = checkout.data.url;
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/10">
        {/* glow */}
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Book a Local Guide
            </h1>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              Pick your location, date & time — we’ll show trusted guides and let you book instantly.
            </p>
          </div>

          {/* mini stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs text-slate-400">Verified Guides</p>
              <p className="text-lg font-bold text-white">Professional</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs text-slate-400">Secure Booking</p>
              <p className="text-lg font-bold text-white">Stripe Payment</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs text-slate-400">Instant Results</p>
              <p className="text-lg font-bold text-white">Fast Search</p>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <form
            onSubmit={searchGuides}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Trip Details</h2>
                <p className="text-sm text-slate-300">
                  Fill the form to search guides.
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/15 text-sky-200 border border-sky-400/20">
                Secure
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-200">Name</label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                  name="name"
                  placeholder="Your full name"
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Email</label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                  name="email"
                  placeholder="you@example.com"
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Mobile</label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                  name="mobile"
                  placeholder="9876543210"
                  onChange={onChange}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-1 block text-sm text-slate-200">Location</label>
                {meta.locations.length > 0 ? (
                  <select
                    name="location"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                    value={form.location}
                    onChange={onChange}
                    required
                  >
                    <option value="" className="text-slate-900">
                      Select a location
                    </option>
                    {meta.locations.map((loc) => (
                      <option key={loc} value={loc} className="text-slate-900">
                        {loc}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                    name="location"
                    placeholder="e.g., Agra"
                    onChange={onChange}
                    required
                  />
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                  name="date"
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Time</label>
                <input
                  type="time"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                  name="time"
                  onChange={onChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-slate-200">Budget (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                  name="budget"
                  placeholder="1500"
                  onChange={onChange}
                  required
                />
              </div>

              {/* Experience */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-slate-200">
                  Minimum Experience (years)
                </label>

                {meta.experiences.length > 0 ? (
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                  >
                    <option value="" className="text-slate-900">
                      Any
                    </option>
                    {meta.experiences.map((yr) => (
                      <option key={yr} value={yr} className="text-slate-900">
                        {yr}+ years
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="Any"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                    onChange={onChange}
                  />
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-amber-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSearch || searching}
              className="mt-5 w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Searching…
                </span>
              ) : (
                "Search Guides"
              )}
            </button>

            <p className="mt-3 text-xs text-slate-400 text-center">
              Tip: Add experience filter for better matching ✅
            </p>
          </form>

          {/* Results */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Available Guides</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                Found: {guides.length}
              </span>
            </div>

            {guides.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {guides.map((g) => (
                  <article
                    key={g._id}
                    className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl hover:shadow-2xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center text-white font-bold">
                        {g.name?.[0] || "G"}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {g.name}
                        </h3>
                        <p className="text-xs text-slate-300">
                          Location: {g.location ?? form.location}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-slate-300 text-xs">Experience</p>
                        <p className="font-extrabold text-white">
                          {g.experience ?? "—"} yrs
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-slate-300 text-xs">Language</p>
                        <p className="font-extrabold text-white">
                          {g.language ?? form.language ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs text-slate-300">
                        {g.rate ? (
                          <>
                            Rate:{" "}
                            <span className="text-white font-bold">
                              ₹{g.rate}
                            </span>
                          </>
                        ) : (
                          <span className="opacity-70">Rate not available</span>
                        )}
                      </p>

                      <button
                        onClick={() => bookGuide(g._id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                            Processing…
                          </span>
                        ) : (
                          "Book"
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
                <p className="text-slate-300">
                  Search to see available guides here.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Fill the form and click <b>Search Guides</b> ✅
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
