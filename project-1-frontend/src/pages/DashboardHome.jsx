import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // change if needed

const DashboardHome = () => {
  const [upcomingTrips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingTrips = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_URL}/api/booking/getbookings/${userId}`
        );

        setTrips(res.data || []);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingTrips();
  }, []);

  const monthlySpending = {
    total: 18500,
    travel: 12000,
    guide: 4500,
    others: 2000,
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#2E1B0F]">
          Welcome back 👋
        </h1>
        <p className="text-sm text-[#5C4330] mt-1">
          Here’s a quick overview of your travel activity
        </p>
      </div>

      {/* Upcoming Trips */}
      <section>
        <h2 className="text-lg font-semibold mb-3">🧳 Upcoming Trips</h2>

        {Array.isArray(upcomingTrips) && upcomingTrips.length === 0 ? (
          <p className="text-sm text-gray-500">
            No upcoming trips planned.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.isArray(upcomingTrips) &&
              upcomingTrips.map((trip) => (
                <div
                  key={trip.id || trip._id}
                  className="bg-[#FDF7EC] border border-[#E2D7C5] rounded-xl p-4 shadow-sm"
                >
                  <h3 className="text-lg font-medium">{trip.place}</h3>
                  <p className="text-sm text-[#5C4330]">
                    📅 {trip.date}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                      trip.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Monthly Spending */}
      <section>
        <h2 className="text-lg font-semibold mb-3">💸 Monthly Spending</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <StatCard label="Total" value={`₹${monthlySpending.total}`} />
          <StatCard label="Travel" value={`₹${monthlySpending.travel}`} />
          <StatCard label="Guide" value={`₹${monthlySpending.guide}`} />
          <StatCard label="Others" value={`₹${monthlySpending.others}`} />
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-[#E2D7C5] rounded-xl p-4 shadow-sm">
    <p className="text-sm text-[#5C4330]">{label}</p>
    <p className="text-xl font-semibold mt-1">{value}</p>
  </div>
);

export default DashboardHome;