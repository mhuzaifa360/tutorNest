import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import HomeButton from "./HomeButton";

const getRolePaths = (role) => {
  const normalized = (role || "student").toLowerCase();
  if (normalized === "teacher") {
    return {
      profile: "/teacher/profile",
      dashboard: "/teacher/dashboard",
      settings: "/teacher/settings",
    };
  }

  if (normalized === "admin") {
    return {
      profile: "/admin/profile",
      dashboard: "/admin/dashboard",
      settings: "/admin/settings",
    };
  }

  return {
    profile: "/student/profile",
    dashboard: "/student/dashboard",
    settings: "/student/settings",
  };
};

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "U";
  const first = firstName?.trim()?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.trim()?.charAt(0)?.toUpperCase() || "";
  return `${first}${last}`.trim() || "U";
};

const UserMenu = ({ className = "" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const paths = getRolePaths(user?.role);
  const initials = user?.initials || getInitials(user?.firstName, user?.lastName);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const menuItems = [
    { label: "My Profile", icon: "👤", path: paths.profile },
    { label: "Dashboard", icon: "📊", path: paths.dashboard },
    { label: "Settings", icon: "⚙", path: paths.settings },
  ];

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-slate-500/10 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold">{initials}</span>
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 z-50 mt-3 min-w-[18rem] overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-200 dark:border-slate-700/50 dark:bg-slate-900/90"
        >
          <div className="rounded-3xl bg-white/90 p-4 shadow-inner shadow-slate-900/5 dark:bg-slate-950/80">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {user.email || "No email available"}
            </p>
          </div>

          <div className="mt-3 grid gap-1">
            <HomeButton
              className="w-full justify-start rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
              label="Home"
            />

            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
