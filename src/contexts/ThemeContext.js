import { createContext, useContext, useState, useEffect } from 'react';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'app_theme';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
