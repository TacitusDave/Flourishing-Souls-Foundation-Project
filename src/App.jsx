import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context";
import ThemeProvider from "./components/common/ThemeProvider";
import NotificationProvider from "./components/common/NotificationProvider";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./styles/tailwind.css";

function App() {
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
