import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const ThemeContext = createContext();

// Theme provider wrapper
export const ThemeProviderWrapper = ({ children }) => {
  // Initialize dark mode state based on localStorage value
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Toggle theme between dark and light modes
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev; // Flip the current theme
      // Save the new theme to localStorage
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme; // Return the new theme value
    });
  };

  return (
    // Provide the theme context to the children components
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  return useContext(ThemeContext); // Access the theme context value
};
