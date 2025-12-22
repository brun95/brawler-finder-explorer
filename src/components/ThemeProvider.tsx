
'use client'

import { createContext, useContext, useEffect } from "react";

type Theme = "light";

const ThemeContext = createContext<{
  theme: Theme;
}>({
  theme: "light",
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always use light theme
  const theme: Theme = "light";

  useEffect(() => {
    // Remove dark mode class if it exists
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
