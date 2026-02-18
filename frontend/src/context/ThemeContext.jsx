import React, { createContext, useEffect, useState } from 'react';
import { colors } from '../constants/colors';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', themeName);
    } catch {}

    document.documentElement.setAttribute('data-theme', themeName);
  }, [themeName]);

  const toggle = () => setThemeName((t) => (t === 'dark' ? 'light' : 'dark'));

  const theme = colors[themeName] || colors.dark;

  return (
    <ThemeContext.Provider value={{ themeName, theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
