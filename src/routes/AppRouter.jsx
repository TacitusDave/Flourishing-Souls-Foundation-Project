import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../context";

const Home = lazy(() => import("../pages/Home"));
const Donate = lazy(() => import("../pages/Donate"));
const Volunteer = lazy(() => import("../pages/Volunteer"));
const Support = lazy(() => import("../pages/Support"));
const Events = lazy(() => import("../pages/Events"));
const Gallery = lazy(() => import("../pages/Gallery"));
const BoardMembers = lazy(() => import("../pages/BoardMembers"));
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Admin = lazy(() => import("../pages/Admin"));
const NotFound = lazy(() => import("../pages/NotFound"));

export function RequireAuth({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <span className="text-brand-600 dark:text-brand-300 text-lg animate-pulse">
          Checking access...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const AppRouter = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <span className="text-brand-600 dark:text-brand-300 text-lg animate-pulse">
          Loading application...
        </span>
      </div>
    }
  >
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/support" element={<Support />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/board" element={<BoardMembers />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        {/* Admin is protected by its own passcode gate (AdminGuard) —
            it must stay reachable even when Supabase auth is down. */}
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRouter;
