import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme = 'deep-ocean' | 'sun-bleached';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'deep-ocean',
  setTheme: () => {},
  toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('surf_sa_theme');
    if (saved === 'sun-bleached' || saved === 'deep-ocean') {
      return saved;
    }
    return 'deep-ocean';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('surf_sa_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'deep-ocean' ? 'sun-bleached' : 'deep-ocean');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'sun-bleached') {
      root.classList.add('sun-bleached');
      root.classList.remove('deep-ocean');
    } else {
      root.classList.add('deep-ocean');
      root.classList.remove('sun-bleached');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
