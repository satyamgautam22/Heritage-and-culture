import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = useMemo(() => params.get("session_id"), [params]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Invalid or missing session.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/booking/verify`,
          { session_id: sessionId }
        );
        setMessage(res.data.message || "Payment verified successfully!");
        setStatus("success");
      } catch (err) {
        setMessage(err.response?.data?.message || "Payment verification failed.");
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-b from-emerald-50 via-white to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Top flair */}
        <div className="mx-auto h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm animate-in fade-in zoom-in duration-500">
          {status === "loading" && (
            <svg className="h-10 w-10 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"/>
            </svg>
          )}
          {status === "success" && (
            <svg className="h-10 w-10 text-emerald-600" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-emerald-200"/>
              <path d="M7 12l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {status === "error" && (
            <svg className="h-10 w-10 text-rose-600" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-rose-200"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Card */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white/90 shadow-xl backdrop-blur p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {status === "success" ? "🎉 Payment Successful" : status === "error" ? "Payment Status" : "Verifying Payment"}
            </h2>
            <p className="mt-2 text-slate-600">{message}</p>

            {/* Subtle session snippet */}
            {sessionId && (
              <p className="mt-3 text-xs text-slate-500">
                Ref: <span className="font-mono">{sessionId.slice(0, 6)}...{sessionId.slice(-6)}</span>
              </p>
            )}
          </div>

          {/* Tips / next steps */}
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            {status === "success" ? (
              <ul className="list-disc pl-5 space-y-1">
                <li>Your booking has been confirmed.</li>
                <li>Check the dashboard for details and receipts.</li>
              </ul>
            ) : status === "loading" ? (
              <p className="animate-pulse">Hold on while we confirm your payment…</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                <li>If money was deducted, check your dashboard or try refreshing.</li>
                <li>You can retry booking or contact support.</li>
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/bookguide" className="inline-flex">
              <button
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[.98] transition"
              >
                Book Another Guide
              </button>
            </Link>

            <Link to="/dashboard" className="inline-flex">
              <button
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-[.98] transition"
              >
                Go to Dashboard
              </button>
            </Link>

            {status === "error" && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 active:scale-[.98] transition"
              >
                Retry Verification
              </button>
            )}
          </div>
        </div>

        {/* Fine print */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Having trouble? Contact support from your dashboard.
        </p>
      </div>
    </div>
  );
}
