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
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-warm-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
      aria-label="Toggle theme"
    >
      <span className="select-none">
        {resolvedTheme === "dark" ? "Dark" : "Light"}
      </span>
      <span className="text-xs opacity-70">({theme})</span>
    </button>
  );
}

