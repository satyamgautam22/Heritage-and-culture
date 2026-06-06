import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function UserChats({ onOpenChat }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const paidBookings = useMemo(() => {
    return bookings
      .filter((b) => b?.paymentStatus === "paid")
      .filter((b) => {
        const bookingUserId =
          typeof b?.userId === "string" ? b.userId : b?.userId?._id;
        return userId && bookingUserId && bookingUserId.toString() === userId;
      });
  }, [bookings, userId]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/booking/getbookings");
        setBookings(res.data?.bookings || []);
      } catch (err) {
        if (err?.response?.status === 404) {
          setBookings([]);
        } else {
          setError("Failed to load chats");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (paidBookings.length === 0) {
    return (
      <div className="text-center text-gray-600">
        You have no active chats yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Chats</h2>

      {paidBookings.map((booking) => (
        <div
          key={booking._id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Location:</strong> {booking.location}
            </p>
            <p>
              <strong>Date:</strong> {new Date(booking.date).toDateString()}
            </p>
            <p className="text-green-600 font-medium">Paid</p>
          </div>

          <button
            onClick={() => {
              if (onOpenChat) return onOpenChat(booking._id);
              navigate(`/chat/${booking._id}`);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Open Chat
          </button>
        </div>
      ))}
    </div>
  );
}
