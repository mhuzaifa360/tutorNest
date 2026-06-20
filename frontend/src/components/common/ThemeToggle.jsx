import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <FiSun className="text-yellow-400 text-[22px] transition-transform duration-300 rotate-0" />
      ) : (
        <FiMoon className="text-gray-600 dark:text-gray-400 text-[22px] transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}

export default ThemeToggle;