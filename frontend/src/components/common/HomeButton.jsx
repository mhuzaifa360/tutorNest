import { Link, useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const HomeButton = ({ to = "/", className = "", onClick, hideLabel = false, label = "Home", title = "Home" }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      title={title}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition duration-200 ${
        isActive
          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
          : "border-transparent bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
      } ${className}`}
    >
      <FiHome className="text-lg" />
      {!hideLabel && <span className="hidden sm:inline">{label}</span>}
    </Link>
  );
};

export default HomeButton;
