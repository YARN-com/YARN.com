import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply Tailwind dark class to html
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <nav
      className={`w-full sticky top-0 z-50 shadow-lg transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">

          {/* Logo */}
          <h1
            className={`text-3xl font-extrabold tracking-tight drop-shadow-lg hover:scale-105 transition-transform duration-300 ${
              theme === "dark" ? "text-gray-200" : "text-white"
            }`}
          >
            <Link
              to="/"
              className={`hover:underline decoration-wavy ${
                theme === "dark" ? "decoration-yellow-400" : "decoration-white"
              }`}
            >
              YARN.com
            </Link>
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`relative font-medium px-3 py-1 group transition-colors duration-300 ${
                theme === "dark" ? "text-gray-200 hover:text-yellow-400" : "text-white hover:text-yellow-200"
              }`}
            >
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/create-thread"
              className={`relative font-medium px-3 py-1 group transition-colors duration-300 ${
                theme === "dark" ? "text-gray-200 hover:text-yellow-400" : "text-white hover:text-yellow-200"
              }`}
            >
              Create Thread
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
            </Link>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`ml-4 flex items-center gap-2 px-6 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 
                transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-700 to-purple-800 text-white"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                }`}
            >
              {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center">
                <span
                  className={`block h-1 w-8 rounded-lg transition-all duration-300 mb-1 ${
                    theme === "dark" ? "bg-gray-200" : "bg-white"
                  } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                  className={`block h-1 w-8 rounded-lg transition-all duration-300 mb-1 ${
                    theme === "dark" ? "bg-gray-200" : "bg-white"
                  } ${menuOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`block h-1 w-8 rounded-lg transition-all duration-300 ${
                    theme === "dark" ? "bg-gray-200" : "bg-white"
                  } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`flex flex-col items-center py-4 space-y-4 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-800 text-gray-200"
                : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
            }`}
          >
            <Link
              to="/"
              className={`px-4 py-2 rounded w-full text-center transition-colors duration-300 ${
                theme === "dark" ? "hover:bg-yellow-400 hover:text-white" : "hover:bg-yellow-300 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create-thread"
              className={`px-4 py-2 rounded w-full text-center transition-colors duration-300 ${
                theme === "dark" ? "hover:bg-yellow-400 hover:text-white" : "hover:bg-yellow-300 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Create Thread
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className={`px-6 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-700 to-purple-800 text-white"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
              }`}
            >
              {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
