import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiBriefcase,
  FiFileText,
  FiGrid,
  FiHome,
  FiLayers,
  FiSettings,
  FiShield,
  FiStar,
  FiUsers,
} from "react-icons/fi";

const links = [
  { name: "Home", path: "/", icon: <FiHome /> },
  { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
  { name: "Users Management", path: "/admin/users", icon: <FiUsers /> },
  { name: "Students", path: "/admin/students", icon: <FiGrid /> },
  { name: "Teachers", path: "/admin/teachers", icon: <FiShield /> },
  { name: "Courses", path: "/admin/courses", icon: <FiLayers /> },
  { name: "Jobs", path: "/admin/jobs", icon: <FiBriefcase /> },
  { name: "Applications", path: "/admin/applications", icon: <FiFileText /> },
  { name: "Reviews", path: "/admin/reviews", icon: <FiStar /> },
  { name: "Reports", path: "/admin/reports", icon: <FiActivity /> },
  { name: "Settings", path: "/admin/settings", icon: <FiSettings /> },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-slate-950/50 md:hidden" onClick={onClose} aria-label="Close menu" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-slate-950 text-white shadow-xl transition-transform duration-300 dark:border-slate-800 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold">TN</div>
          <div className="ml-3">
            <p className="text-lg font-bold">TutorNest</p>
            <p className="text-xs text-slate-400">Admin Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
