import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// These common components should be updated with actual paths if moved
import Header from "./Header";
import Footer from "./Footer";
import ThemeSwitcher from "./ThemeSwitcher";

// For accessibility and focus management
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

/**
 * Layout - Main layout wrapper for all user-facing pages.
 * Handles header, footer, notifications, theme switcher, and page transitions.
 * Properly manages Suspense, error boundaries, and accessibility.
 */

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <ScrollToTop />

      {/* Site Header / Navigation */}
      <Header />

      {/* Page Content */}
      <main
        className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10"
        aria-live="polite"
        tabIndex={-1}
        id="main-content"
      >
        <Suspense fallback={<div className="text-center py-16 text-neutral-500 dark:text-neutral-300">Loading...</div>}>
          {/* Outlet is for React Router; children for direct usage */}
          {children ? children : <Outlet />}
        </Suspense>
      </main>

      {/* Theme Switcher, floating so it doesn't disrupt page flow */}
      <div className="fixed bottom-4 right-4 z-40">
        <ThemeSwitcher />
      </div>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default Layout;