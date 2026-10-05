import React from "react";
import useTheme from "../../hooks/useTheme";

export default function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme, loading } = useTheme();

  if (loading) return null;

  const next =
    theme === "system"
      ? resolvedTheme === "dark"
        ? "light"
        : "dark"
      : theme === "dark"
      ? "light"
      : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-warm-md transition hover:scale-105 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white"
      aria-label="Toggle theme"
      title={`Theme: ${theme}`}
    >
      {resolvedTheme === "dark" ? (
        // Moon
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      ) : (
        // Sun
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      )}
    </button>
  );
}
