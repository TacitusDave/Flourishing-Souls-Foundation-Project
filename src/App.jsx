import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context";
import ThemeProvider from "./components/common/ThemeProvider";
import NotificationProvider from "./components/common/NotificationProvider";
import ErrorBoundary from "./components/common/ErrorBoundary";
import useScrollbarFade from "./hooks/useScrollbarFade";
import { initSentry, initAnalytics } from "./lib/monitoring";
import "./styles/tailwind.css";

// Activate Sentry + GA4 when their env vars are present (no-ops otherwise).
initSentry();
initAnalytics();

function App() {
  // Thin scrollbar that fades out while the page is idle.
  useScrollbarFade();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Router>
              <AppRouter />
            </Router>
          </ErrorBoundary>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
