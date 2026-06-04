import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

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
      { name: "Teachers", path: "/teachers" },
      { name: "Messages", path: "/messages" },
    ],

    teacher: [
      { name: "Dashboard", path: "/teacher/dashboard" },
      { name: "My Students", path: "/teacher/students" },
      { name: "Courses", path: "/teacher/courses" },
      { name: "Earnings", path: "/teacher/earnings" },
    ],

    admin: [
      { name: "Admin Panel", path: "/admin/dashboard" },
      { name: "Users", path: "/admin/users" },
      { name: "Courses", path: "/admin/courses" },
      { name: "Reports", path: "/admin/reports" },
    ],
  };

  const role = user?.role || "guest";
  const links = navItems[role];

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-slate-900 border-b">
      <div className="max-w-7xl mx-auto h-20 flex justify-between items-center px-4">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          TutorNest
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-4">
          {links.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`px-3 py-2 rounded ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <ThemeToggle />

          {/* 🔥 GUEST ONLY BUTTONS */}
          {!user && (
            <>
              <Link to="/login">
                <button className="px-4 py-2 border rounded">
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {/* LOGGED IN USER */}
          {user && (
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              {role.toUpperCase()}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden p-4 flex flex-col gap-2">
          {links.map((item, i) => (
            <Link key={i} to={item.path} onClick={() => setIsOpen(false)}>
              {item.name}
            </Link>
          ))}

          {!user && (
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;