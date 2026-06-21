import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import ThemeToggle from "../common/ThemeToggle";
import UserMenu from "../common/UserMenu";
import { useAuth } from "../../context/AuthContext";

const navItems = {
  guest: [
    { name: "Home", path: "/" },
    { name: "Teachers", path: "/teachers" },
    { name: "Courses", path: "/courses" },
    { name: "Jobs", path: "/jobs" },
  ],
  student: [
    { name: "Dashboard", path: "/student" },
    { name: "My Courses", path: "/student/my-courses" },
    { name: "Teachers", path: "/teachers" },
    { name: "Messages", path: "/student/messages" },
    { name: "Profile", path: "/student/profile" },
  ],
  teacher: [
    { name: "Dashboard", path: "/teacher" },
    { name: "My Students", path: "/teacher/students" },
    { name: "Courses", path: "/teacher/courses" },
    { name: "Earnings", path: "/teacher/earnings" },
    { name: "Profile", path: "/teacher/profile" },
  ],
  admin: [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Students", path: "/admin/students" },
    { name: "Teachers", path: "/admin/teachers" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Reports", path: "/admin/reports" },
  ],
};

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const role = user?.role?.toLowerCase() || "guest";
  const links = navItems[role] || navItems.guest;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          TutorNest
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <UserMenu />
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Open navigation menu"
          >
            {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {!user && (
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
