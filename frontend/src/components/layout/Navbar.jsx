import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = {
    guest: [
      { name: "Home", path: "/" },
      { name: "Teachers", path: "/teachers" },
      { name: "Courses", path: "/courses" },
      { name: "Jobs", path: "/jobs" },
    ],

    student: [
      { name: "Dashboard", path: "/student/dashboard" },
      { name: "My Courses", path: "/student/courses" },
      { name: "Messages", path: "/messages" },
    ],

    teacher: [
      { name: "Dashboard", path: "/teacher/dashboard" },
      { name: "My Students", path: "/teacher/students" },
      { name: "Earnings", path: "/teacher/earnings" },
    ],

    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Users", path: "/admin/users" },
      { name: "Reports", path: "/admin/reports" },
    ],
  };

  const role = user?.role || "guest";
  const links = navItems[role];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-slate-900 border-b dark:border-slate-700">

      <div className="max-w-7xl mx-auto h-20 flex justify-between items-center px-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          TutorNest
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-4">
          {links.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`px-3 py-2 rounded transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* THEME */}
          <ThemeToggle />

          {/* USER BADGE */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full text-sm">
              {role.toUpperCase()}
            </div>
          )}

          {/* LOGOUT BUTTON */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              <FiLogOut />
              Logout
            </button>
          )}

          {/* GUEST BUTTONS */}
          {!user && (
            <div className="hidden md:flex gap-2">
              <Link to="/login">
                <button className="px-4 py-2 border rounded dark:text-white">
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">

          {links.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="py-2 text-gray-700 dark:text-gray-300"
            >
              {item.name}
            </Link>
          ))}

          {/* MOBILE ROLE */}
          {user && (
            <div className="py-2 text-green-600 font-bold">
              {role.toUpperCase()}
            </div>
          )}

          {/* MOBILE AUTH */}
          {!user ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>

              <Link to="/signup" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-2 px-3 py-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;