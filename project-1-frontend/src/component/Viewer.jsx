import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Socket from "../Soket.jsx";  // your existing socket connection
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LiveLocationViewer = () => {
  const { shareId } = useParams();
  const [location, setLocation] = useState(null);
  const [active, setActive] = useState(true);

useEffect(() => {
  if (!shareId) return;

  // Viewer also joins the room
  Socket.emit("start-sharing", { shareId });

  // Listen for location updates
  Socket.on("receive-location", (data) => {
    console.log("📍 Received location:", data);  // ✅ debug log
    setLocation({ lat: data.latitude, lng: data.longitude });
  });

  // Listen for stop event
  Socket.on("sharing-stopped", () => {
    setActive(false);
  });

  return () => {
    Socket.off("receive-location");
    Socket.off("sharing-stopped");
  };
}, [shareId]);


  if (!active) {
    return <p className="text-center text-red-600 mt-10">❌ Sharing has been stopped.</p>;
  }

  return (
    <div className="h-screen w-full">
      {location ? (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lng]}>
            <Popup>📍 Live Location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="text-center mt-10">📡 Waiting for location...</p>
      )}
    </div>
  );
};

export default LiveLocationViewer;
