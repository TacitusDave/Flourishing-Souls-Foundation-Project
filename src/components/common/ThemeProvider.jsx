/**
 * ThemeProvider.jsx
 * Theme context provider for light/dark/system preference. Persists to
 * localStorage, syncs across tabs, and follows the OS preference when set
 * to "system". Wrap the app in this once, in App.jsx.
 */

import React, { useEffect, useState, useCallback } from "react";
import { ThemeContext } from "./themeContext";

// The site is light-only by design decision (mirroring the calm, minimal
// reference site). The theme machinery is kept intact so a dark theme can
// be reintroduced later without rebuilding the token layer — but every
// theme resolution now clamps to "light".
const THEMES = ["light"];
const LOCAL_STORAGE_KEY = "fsf-theme-preference";

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [loading, setLoading] = useState(true);

  // Document theme toggling logic — clamped to light (light-only site).
  function applyTheme() {
    const real = "light";
    document.documentElement.setAttribute("data-theme", real);

    // Adjust background-color immediately for non-FOUC
    document.documentElement.style.backgroundColor = "#ffffff";
  }

  // Sync theme from localStorage at mount
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    } catch {
      // SSR/malformed; ignore
    }
    if (stored && THEMES.includes(stored)) {
      // Defer setState to avoid cascading renders (schedule after paint)
      setTimeout(() => setThemeState(stored), 0);
    }

    // Set initial theme on documentElement (light-only site)
    const initial = stored && THEMES.includes(stored) ? stored : "light";
    applyTheme(initial);

    // Defer setState to avoid cascading renders (schedule after paint)
    setTimeout(() => setLoading(false), 0);
  }, []);

  // Light-only: re-assert the light theme whenever `theme` changes.
  useEffect(() => {
    applyTheme();
  }, [theme]);

  // Cross-tab localStorage sync
  useEffect(() => {
    const handler = (e) => {
      if (e.key === LOCAL_STORAGE_KEY && THEMES.includes(e.newValue)) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Handle setting & persisting theme
  const setTheme = useCallback((nextTheme) => {
    if (!THEMES.includes(nextTheme)) return;
    setThemeState(nextTheme);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, nextTheme);
    } catch {
      // ignore errors
    }
    applyTheme(nextTheme);
  }, []);

  // Context value
  const ctxVal = {
    theme,
    resolvedTheme: "light",
    setTheme,
    loading,
  };

  return (
    <ThemeContext.Provider value={ctxVal}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
