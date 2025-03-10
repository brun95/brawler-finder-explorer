
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
};
