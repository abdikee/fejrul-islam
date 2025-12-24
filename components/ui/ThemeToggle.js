'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function ThemeToggle({ variant = 'button', className = '' }) {
  const { theme, toggleTheme, setLightTheme, setDarkTheme, mounted } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-lg bg-slate-200 animate-pulse ${className}`} />
    );
  }

  if (variant === 'simple') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        ) : (
          <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={`p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
          title="Theme options"
        >
          {theme === 'light' ? (
            <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          )}
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
            <div className="p-2">
              <button
                onClick={() => {
                  setLightTheme();
                  setShowOptions(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  theme === 'light'
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light Mode
              </button>
              <button
                onClick={() => {
                  setDarkTheme();
                  setShowOptions(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  theme === 'dark'
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark Mode
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        theme === 'light'
          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
      } ${className}`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-sm font-medium">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium">Light</span>
        </>
      )}
    </button>
  );
}