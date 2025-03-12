
import { createContext, useContext, useEffect } from "react";

type Theme = "dark";

const ThemeContext = createContext<{
  theme: Theme;
}>({
  theme: "dark",
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always use dark theme
  const theme: Theme = "dark";

  useEffect(() => {
    // Always set dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
