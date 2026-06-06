import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Home,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Replace with your actual auth logic
  const token = localStorage.getItem("token");
const guideToken = localStorage.getItem("guideToken");

const userLoggedIn = !!token;
const guideLoggedIn = !!guideToken;

const user = userLoggedIn
  ? {
      name:
        localStorage.getItem("username") ||
        "User",
    }
  : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("guideToken");
  localStorage.removeItem("guideId");
  localStorage.removeItem("username");

  navigate("/");
  window.location.reload();
};
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-center font-bold">
              H
            </div>

            <div>
              <h1 className="font-bold text-lg text-[#2E1B0F]">
                Heritage India
              </h1>

              <p className="text-xs text-gray-500">
                Culture & Traditions
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 font-medium text-[#2E1B0F]">
            <a
              href="#about"
              className="hover:text-amber-600 transition"
            >
              About
            </a>

            <a
              href="#categories"
              className="hover:text-amber-600 transition"
            >
              Categories
            </a>

            <a
              href="#gallery"
              className="hover:text-amber-600 transition"
            >
              Gallery
            </a>

            <Link
              to="/guide"
              className="hover:text-amber-600 transition"
            >
              Guide Register
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {!userLoggedIn && !guideLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 border border-amber-600 text-amber-700 rounded-full hover:bg-amber-50 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpen(!menuOpen)
                  }
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg"
                >
                  {user?.name
                    ?.charAt(0)
                    .toUpperCase()}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="font-semibold">
                        {user.name}
                      </p>
                    </div>

                    <Link
                      to="/"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >
                      <Home size={18} />
                      Home
                    </Link>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >
                      <LayoutDashboard
                        size={18}
                      />
                      Dashboard
                    </Link>

                    <Link
                      to="/guide-register"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >
                      <User size={18} />
                      Guide Register
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex flex-col gap-4">
              <a href="#about">About</a>

              <a href="#categories">
                Categories
              </a>

              <a href="#gallery">
                Gallery
              </a>

              <Link to="/guide">
                Guide Register
              </Link>

              {!user ? (
                <>
                  <Link to="/login">
                    Login
                  </Link>

                  <Link to="/register">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard
                      size={18}
                    />
                    Dashboard
                  </Link>

                  <Link
                    to="/guide"
                    className="flex items-center gap-2"
                  >
                    <User size={18} />
                    Guide Register
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}