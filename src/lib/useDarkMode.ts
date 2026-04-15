'use client';
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  // On mount: read saved preference (default to light)
  useEffect(() => {
    const saved = localStorage.getItem('oxxo-theme');
    // Only use dark if explicitly saved as dark
    const isDark = saved === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('oxxo-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return { dark, toggle };
}
