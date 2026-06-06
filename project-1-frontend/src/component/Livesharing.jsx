import { useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLiveShare() {
  const [shareId, setShareId] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const watchIdRef = useRef(null);

async function startSharing() {
  const res = await fetch(`${API_BASE}/api/live-location/share`, { method: "POST" });
  const data = await res.json();

  setShareId(data.shareId);
  setShareUrl(`${window.location.origin}/live/${data.shareId}`); // ✅ viewer route

  socket.emit("start-sharing", { shareId: data.shareId });

  if ("geolocation" in navigator) {
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log(pos.coords);
        
        socket.emit("send-location", {
          shareId: data.shareId,
          latitude,
          longitude,
          accuracy,
        });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
    setIsSharing(true);
  } else {
    alert("Geolocation not supported in this browser.");
  }
}
//to stop sharing
  async function stopSharing() {
  if (watchIdRef.current !== null) {
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }
  if (shareId) {
    await fetch(`${API_BASE}/api/live-location/share/${shareId}/stop`, {
      method: "PUT",
    });
    socket.emit("stop-sharing", { shareId });
  }
  setIsSharing(false);
  setShareId("");
  setShareUrl("");
}


  return (
    <div className="p-4 rounded-2xl shadow border flex flex-col gap-3">
      <h3 className="text-lg font-semibold">Share Live Location</h3>

      {!isSharing ? (
        <button onClick={startSharing} className="px-4 py-2 rounded-xl shadow bg-black text-white">
          Start Sharing
        </button>
      ) : (
        <button onClick={stopSharing} className="px-4 py-2 rounded-xl shadow bg-red-600 text-white">
          Stop Sharing
        </button>
      )}

      {shareUrl && (
        <div className="flex items-center gap-2">
          <input className="w-full border rounded-lg px-3 py-2" value={shareUrl} readOnly />
          <button
            className="px-3 py-2 rounded-lg border"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            Copy
          </button>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Anyone with the link can view this live location in real time.
      </p>
    </div>
  );
}
