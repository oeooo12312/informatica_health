import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem("selectedTheme") || "light");

  useEffect(() => {
    document.querySelector("body").setAttribute("data-theme", selectedTheme);
    localStorage.setItem("selectedTheme", selectedTheme);
  }, [selectedTheme]);

  const handleThemeToggle = () => {
    setSelectedTheme(theme => theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ selectedTheme, handleThemeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
