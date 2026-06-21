import { FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import HomeButton from "../common/HomeButton";
import NotificationBell from "../common/NotificationBell";
import { useAuth } from "../../context/AuthContext";

function AdminNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 md:hidden"
          aria-label="Open admin menu"
        >
          <FiMenu className="text-2xl" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Admin Panel
          </p>
          <h1 className="text-lg font-bold text-gray-950 dark:text-white">Operations Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <HomeButton className="hidden sm:inline-flex" />
        <ThemeToggle />
        <NotificationBell />
        <div className="hidden items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 dark:border-slate-800 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {user?.initials || "A"}
          </div>
          <div className="max-w-36">
            <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">
              {user?.firstName || user?.name || "Admin"}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <FiLogOut />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;
