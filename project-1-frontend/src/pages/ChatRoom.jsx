import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

export default function ChatRoom({ bookingId: bookingIdProp, onBack }) {
  const params = useParams();
  const bookingId = bookingIdProp || params.bookingId;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("connecting");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const socketUrl = useMemo(() => {
    return (
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000"
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !bookingId) {
      setStatus("denied");
      return;
    }

    setStatus("connecting");
    socketRef.current = io(socketUrl, {
      auth: { token, bookingId },
    });

    socketRef.current.on("connect", () => setStatus("connected"));
    socketRef.current.on("chatHistory", (history) => setMessages(history || []));
    socketRef.current.on("receiveMessage", (msg) => {
      if (!msg) return;
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current.on("connect_error", () => setStatus("denied"));

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [bookingId, socketUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    const next = text.trim();
    if (!next) return;
    socketRef.current?.emit("sendMessage", next);
    setText("");
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">
          Status:{" "}
          {status === "connected"
            ? "Connected"
            : status === "denied"
              ? "Access denied"
              : "Connecting..."}
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
          >
            Back
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto border p-3 rounded bg-white">
        {messages.map((m) => (
          <div
            key={m._id || `${m.senderId}_${m.createdAt}_${m.text}`}
            className={`mb-2 ${
              m.senderRole === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block px-3 py-2 rounded bg-gray-200">
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded px-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={status !== "connected"}
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-60"
          disabled={status !== "connected"}
        >
          Send
        </button>
      </div>
    </div>
  );
}

