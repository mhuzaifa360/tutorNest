import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import UserMenu from "../components/common/UserMenu";
import NotificationBell from "../components/common/NotificationBell";
import HomeButton from "../components/common/HomeButton";
import { FiMenu, FiSearch } from "react-icons/fi";

function Topbar() {
  const location = useLocation();

  const titleSegment = location.pathname
    .split("/")
    .filter(Boolean)
    .slice(-1)[0]
    ?.replace(/[-_]/g, " ");
  const pageTitle = titleSegment
    ? titleSegment.charAt(0).toUpperCase() + titleSegment.slice(1)
    : "Dashboard";

  const handleSidebarToggle = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu className="text-2xl" />
        </button>
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Dashboard
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center xl:flex">
        <div className="relative w-full max-w-xl">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search tutors, courses, messages..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <HomeButton />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col lg:ml-[280px]">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
