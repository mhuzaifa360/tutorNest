import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiBell,
  FiBookmark,
  FiBriefcase,
  FiClipboard,
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiStar,
  FiUser,
  FiUsers,
  FiBook,
} from "react-icons/fi";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  const role = user?.role || "student";

  const getLinks = () => {
    if (role === "teacher") {
      return [
        { name: "Home", path: "/", icon: <FiHome /> },
        { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
        { name: "My Students", path: "/dashboard/students", icon: <FiUsers /> },
        { name: "Earnings", path: "/dashboard/earnings", icon: <FiDollarSign /> },
        { name: "Messages", path: "/dashboard/messages", icon: <FiMessageSquare /> },
        { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
        { name: "Settings", path: "/dashboard/settings", icon: <FiSettings /> },
      ];
    }

    return [
      { name: "Home", path: "/", icon: <FiHome /> },
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Find Tutors", path: "/dashboard/tutors", icon: <FiSearch /> },
      { name: "Saved Tutors", path: "/dashboard/saved-tutors", icon: <FiBookmark /> },
      { name: "Courses", path: "/dashboard/courses", icon: <FiBook /> },
      { name: "My Courses", path: "/dashboard/my-courses", icon: <FiClipboard /> },
      { name: "Tuition Jobs", path: "/dashboard/jobs", icon: <FiBriefcase /> },
      { name: "Applications", path: "/dashboard/applications", icon: <FiUsers /> },
      { name: "Messages", path: "/dashboard/messages", icon: <FiMessageSquare /> },
      { name: "Notifications", path: "/dashboard/notifications", icon: <FiBell /> },
      { name: "Reviews", path: "/dashboard/reviews", icon: <FiStar /> },
      { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
      { name: "Settings", path: "/dashboard/settings", icon: <FiSettings /> },
    ];
  };

  const links = getLinks();
  const roleTitle =
    role === "teacher" ? "Teacher Panel" : role === "admin" ? "Admin Panel" : "Student Panel";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-gradient-to-b from-blue-700 to-indigo-900 text-white shadow-2xl shadow-indigo-900/20 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            TutorNest.
          </Link>
        </div>

        <div className="mb-2 shrink-0 px-8 py-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            {roleTitle}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/20 text-lg font-bold text-white shadow-inner backdrop-blur-md">
              {user?.initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight text-white">
                {user?.firstName || "User"}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium capitalize text-indigo-200">
                {role}
              </p>
            </div>
          </div>
        </div>

        <nav className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-2">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/dashboard" &&
                link.path !== "/" &&
                location.pathname.startsWith(`${link.path}/`));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 ${
                  isActive
                    ? "bg-white/15 font-semibold text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "font-medium text-indigo-100/70 hover:scale-[1.02] hover:bg-white/10 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-7 w-1.5 -translate-y-1/2 rounded-r-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
                <span
                  className={`text-[22px] transition-transform duration-300 ${
                    isActive ? "scale-110 text-white" : "group-hover:scale-110"
                  }`}
                >
                  {link.icon}
                </span>
                <span className="text-[15px] tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto shrink-0 border-t border-white/10 bg-indigo-900/50 p-6 backdrop-blur-md">
          <button
            type="button"
            onClick={logout}
            className="group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 font-semibold text-indigo-100 transition-all duration-300 hover:scale-[1.02] hover:bg-red-500/90 hover:text-white"
          >
            <FiLogOut className="text-[22px] transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-[15px] tracking-wide">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
