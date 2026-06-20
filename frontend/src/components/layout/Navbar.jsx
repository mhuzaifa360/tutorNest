import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEdit3, FiLogOut, FiMenu, FiSettings, FiUser, FiX } from "react-icons/fi";

import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function Navbar({ isDashboard }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  const navItems = {
    guest: [
      { name: "Home", path: "/" },
      { name: "Teachers", path: "/teachers" },
      { name: "Courses", path: "/courses" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
    student: [],
    teacher: [],
    admin: [],
  };

  // If dashboard, links are inside sidebar. We don't need top links.
  const links = isDashboard ? [] : navItems["guest"];
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSidebarToggle = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300 ${isDashboard ? "w-full" : "w-full fixed"}`}>

      <div className={`mx-auto h-20 flex justify-between items-center px-4 md:px-8 ${isDashboard ? "w-full" : "max-w-7xl"}`}>

        {/* LEFT SIDE: LOGO OR HAMBURGER */}
        <div className="flex items-center gap-4">
          {/* Hamburger for Sidebar (Dashboard Only) */}
          {isDashboard && (
            <button 
              onClick={handleSidebarToggle}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors md:hidden"
            >
              <FiMenu className="text-2xl" />
            </button>
          )}
          
          {/* Dashboard Title */}
          {isDashboard && (
            <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block tracking-tight capitalize">
              {location.pathname.split("/").pop()}
            </h1>
          )}

          {/* Logo (Guest/Public Only) */}
          {!isDashboard && (
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              TutorNest
            </Link>
          )}
        </div>

        {/* DESKTOP NAV LINKS (Guest/Public Only) */}
        {!isDashboard && (
          <div className="hidden md:flex gap-2">
            {links.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={i}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* RIGHT SIDE (Theme, Avatar, Guest Buttons) */}
        <div className="flex items-center gap-4">

          {/* THEME */}
          <ThemeToggle />

          {/* USER AVATAR WITH DROPDOWN */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ring-2 ring-white dark:ring-slate-800 cursor-pointer"
              >
                {user.initials || "U"}
              </button>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[min(18rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-lg border border-gray-100 bg-white py-2 shadow-xl transition-all duration-200 animate-fade-in dark:border-slate-700 dark:bg-slate-800">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {user.email || "student@tutornest.com"}
                    </p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <FiUser className="text-gray-400" /> View Profile
                  </Link>

                  <Link
                    to="/profile/edit"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <FiEdit3 className="text-gray-400" /> Edit Profile
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <FiSettings className="text-gray-400" /> Settings
                  </Link>

                  <div className="h-px bg-gray-100 dark:bg-slate-700 my-1"></div>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GUEST BUTTONS */}
          {!user && (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow transition-all">
                Sign Up
              </Link>
            </div>
          )}

          {/* MOBILE BUTTON (Guest Only) */}
          {!isDashboard && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE MENU (Guest Only) */}
      {!isDashboard && isOpen && (
        <div className="md:hidden px-4 py-4 flex flex-col gap-1 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-lg absolute w-full">
          {links.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {!user && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl text-gray-700 dark:text-gray-300 font-medium bg-gray-50 dark:bg-slate-800">
                Log in
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl bg-blue-600 text-white font-medium shadow-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
