import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiBell,
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

  const role = user?.role?.toLowerCase();
  if (!role || role === "guest") return null;

  const getLinks = () => {
    if (role === "admin") {
      return [
        { name: "Admin Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
        { name: "Users", path: "/admin/users", icon: <FiUsers /> },
        { name: "Students", path: "/admin/students", icon: <FiUsers /> },
        { name: "Teachers", path: "/admin/teachers", icon: <FiUsers /> },
        { name: "Courses", path: "/admin/courses", icon: <FiBook /> },
        { name: "Reports", path: "/admin/reports", icon: <FiClipboard /> },
        { name: "Settings", path: "/admin/settings", icon: <FiSettings /> },
      ];
    }

    if (role === "teacher") {
      return [
        { name: "Dashboard", path: "/teacher", icon: <FiHome /> },
        { name: "My Students", path: "/teacher/students", icon: <FiUsers /> },
        { name: "Courses", path: "/teacher/courses", icon: <FiBook /> },
        { name: "Earnings", path: "/teacher/earnings", icon: <FiDollarSign /> },
        { name: "Messages", path: "/teacher/messages", icon: <FiMessageSquare /> },
        { name: "Profile", path: "/teacher/profile", icon: <FiUser /> },
        { name: "Settings", path: "/teacher/settings", icon: <FiSettings /> },
      ];
    }

    return [
      { name: "Dashboard", path: "/student", icon: <FiHome /> },
      { name: "Find Tutors", path: "/student/tutors", icon: <FiSearch /> },
      { name: "Courses", path: "/student/courses", icon: <FiBook /> },
      { name: "My Courses", path: "/student/my-courses", icon: <FiClipboard /> },
      { name: "Jobs", path: "/student/jobs", icon: <FiBriefcase /> },
      { name: "Messages", path: "/student/messages", icon: <FiMessageSquare /> },
      { name: "Profile", path: "/student/profile", icon: <FiUser /> },
      { name: "Settings", path: "/student/settings", icon: <FiSettings /> },
    ];
  };

  const links = getLinks();
  const roleTitle =
    role === "teacher"
      ? "Teacher Panel"
      : role === "admin"
      ? "Admin Panel"
      : "Student Panel";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-white">
            TutorNest
          </Link>
        </div>

        <div className="mb-4 shrink-0 px-8 py-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {roleTitle}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">
              {user?.initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight text-white">
                {user?.firstName || "User"}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium capitalize text-slate-400">
                {role}
              </p>
            </div>
          </div>
        </div>

        <nav className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-4">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path ||
              location.pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <FiLogOut className="mr-2 text-lg" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
