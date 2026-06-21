import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";

import ThemeToggle from "../common/ThemeToggle";
import HomeButton from "../common/HomeButton";
import UserMenu from "../common/UserMenu";
import NotificationBell from "../common/NotificationBell";
import { useAuth } from "../../context/AuthContext";

function Navbar({ isDashboard }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const navItems = {
    guest: [
      { name: "Home", path: "/" },
      { name: "Teachers", path: "/teachers" },
      { name: "Courses", path: "/courses" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
  };

  const titleSegment = location.pathname
    .split("/")
    .filter(Boolean)
    .slice(-1)[0]
    ?.replace(/[-_]/g, " ");
  const pageTitle = titleSegment
    ? titleSegment.charAt(0).toUpperCase() + titleSegment.slice(1)
    : "Dashboard";

  const links = !isDashboard ? navItems.guest : [];
  const handleSidebarToggle = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <header className={`sticky top-0 z-40 h-[72px] backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300`}>
      <div className="mx-auto flex h-full items-center justify-between px-4 md:px-8 xl:px-10 w-full max-w-[1600px]">
        <div className="flex items-center gap-4">
          {isDashboard && (
            <button 
              onClick={handleSidebarToggle}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors lg:hidden"
              aria-label="Open sidebar"
            >
              <FiMenu className="text-2xl" />
            </button>
          )}

          {isDashboard ? (
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                {pageTitle}
              </h1>
            </div>
          ) : (
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              TutorNest
            </Link>
          )}
        </div>

        {isDashboard && (
          <div className="hidden xl:flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-xl">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search tutors, courses, messages..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition duration-300 focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isDashboard && <HomeButton />}

          {isDashboard && user && <NotificationBell />}

          <ThemeToggle />

          {user ? (
            <UserMenu />
          ) : (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow transition-all">
                  Sign Up
                </Link>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </>
          )}
        </div>
      </div>

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

          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl text-gray-700 dark:text-gray-300 font-medium bg-gray-50 dark:bg-slate-800">
              Log in
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 text-center rounded-xl bg-blue-600 text-white font-medium shadow-sm">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
