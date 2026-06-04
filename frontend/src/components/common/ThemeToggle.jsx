import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
    >
      {theme === "dark" ? (
        <FiSun className="text-yellow-400 text-xl" />
      ) : (
        <FiMoon className="text-gray-700 text-xl" />
      )}
    </button>
  );
}

export default ThemeToggle;