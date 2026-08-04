import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context";

/**
 * AdminAuthGuard protects admin routes and components.
 * Only authenticated users with the "admin" role can access children.
 * Otherwise, they are redirected to login or a not-authorized page.
 * This component assumes useAuth returns { user, loading }, and user has a "role" property.
 */
const AdminAuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
        <span className="ml-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">
          Checking admin privileges...
        </span>
      </div>
    );
  }

  if (!user) {
    // Not logged in, redirect to login and preserve next location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    // Logged in, but not admin
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-error-50 dark:bg-neutral-950">
        <h2 className="text-3xl font-display font-bold text-error-700 dark:text-error-400 mb-2">Access Denied</h2>
        <p className="text-base text-neutral-600 dark:text-neutral-300">
          You do not have permission to view this admin section.
        </p>
      </div>
    );
  }

  // Authorized admin, render children
  return <>{children}</>;
};

export default AdminAuthGuard;
