'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-5 h-5" />; // Keep layout stable
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 text-foreground/80 hover:text-foreground transition-colors focus:outline-none"
      aria-label="Toggle visual theme"
      id="theme-toggle-button"
    >
      {theme === 'dark' ? (
        <Sun className="w-[18px] h-[18px] stroke-[1.25]" />
      ) : (
        <Moon className="w-[18px] h-[18px] stroke-[1.25]" />
      )}
    </button>
  );
}
