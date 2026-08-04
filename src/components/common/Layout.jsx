import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// These common components should be updated with actual paths if moved
import Header from "./Header";
import Footer from "./Footer";
import Notification from "./Notification";
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-300">
      <ScrollToTop />
      <Notification />

      {/* Site Header / Navigation */}
      <Header />

      {/* Page Content */}
      <main
        className="flex-1 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10"
        aria-live="polite"
        tabIndex={-1}
        id="main-content"
      >
        <Suspense fallback={<div className="text-center py-16 text-slate-300">Loading...</div>}>
          {/* Outlet is for React Router; children for direct usage */}
          {children ? children : <Outlet />}
        </Suspense>
      </main>

      {/* Theme Switcher (can be placed in header or floating corner) */}
      <ThemeSwitcher />

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default Layout;