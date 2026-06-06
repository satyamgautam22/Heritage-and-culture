import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import AddImageSection from "../component/Image.jsx";
import AddVideoSection from "../component/Video.jsx";
import FileUploadSection from "../component/File.jsx";
import Uploadingproject from "../component/Uploadingproject.jsx";
import AddDestinations from "../component/AddDestination.jsx";

import ProjectsSection from "../pages/Project.jsx";
import ChatRoom from "./ChatRoom.jsx";
import DashboardHome from "./DashboardHome.jsx";
import GuideBooking from "./GuideBooking.jsx";
import UserChats from "./UserChats.jsx";


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [loggedOut, setLoggedOut] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token || loggedOut) {
    toast.success("Logged out successfully");
    return <Navigate to="/login" replace />;
  }

  const userDetails = useMemo(() => {
    return {
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setLoggedOut(true);
  };

  const menuItems = [
    { key: "home", label: "🏠 Home" },
    { key: "uploadProject", label: "📂 Post" },
    { key: "bookguide", label: "🧑‍✈️ Guide Booking" },
    { key: "myChats", label: "💬 My Chats" },
    { key: "AddDestinations", label: "🗺️ AddDestinations" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F2EB] text-[#2E1B0F]">
      <aside className="w-64 bg-[#2E1B0F] text-[#F5F2EB] flex flex-col shadow-xl">
        <div className="p-5 border-b border-[#5C4330]">
          <h1 className="text-xl font-bold tracking-wide">
            {userDetails?.name}
          </h1>
          <p className="text-sm text-[#E2D7C5] mt-1 break-words">
            {userDetails?.email}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeSection === item.key
                  ? "bg-[#C58F48] text-[#2E1B0F]"
                  : "hover:bg-[#5C4330]"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-yellow-600 transition-colors font-medium mt-4"
          >
            Logout
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-yellow-600 transition-colors font-medium mt-4"
          >
            Home
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-[#FDF7EC] overflow-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <section className="bg-white rounded-2xl shadow-sm border border-[#E2D7C5] p-4 md:p-5">
            {activeSection === "uploadProject" && <Uploadingproject />}
            {activeSection === "addImage" && <AddImageSection />}
            {activeSection === "addVideo" && <AddVideoSection />}
            {activeSection === "file" && <FileUploadSection />}
            {activeSection === "projects" && <ProjectsSection />}

            {activeSection === "myChats" && (
              <UserChats
                onOpenChat={(bookingId) => {
                  setSelectedBookingId(bookingId);
                  setActiveSection("chatRoom");
                }}
              />
            )}

            {activeSection === "chatRoom" && (
              <ChatRoom
                bookingId={selectedBookingId}
                onBack={() => setActiveSection("myChats")}
              />
            )}

            {activeSection === "home" && <DashboardHome />}
            {activeSection === "bookguide" && <GuideBooking />}
            {activeSection === "AddDestinations" && <AddDestinations />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
