import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import {
  getBackendMode,
  subscribeToMode,
} from "../../lib/adminStore";

/**
 * AdminGuard — passcode gate for the admin panel.
 *
 * Why a passcode instead of Supabase auth for now: the configured Supabase
 * project is unreachable (paused/deleted), so role-based login can't work.
 * This gate keeps the panel usable today while remaining honest about
 * what it is: a demo-grade lock, not real security.
 *
 * The passcode comes from VITE_ADMIN_PASSCODE in .env.local (defaults to
 * "admin123" in development only). Change it before any public deployment.
 * Session-only persistence: unlocking survives refreshes in the same tab
 * (sessionStorage) but never leaks into other tabs or devices.
 */

const PASSCODE =
  import.meta.env.VITE_ADMIN_PASSCODE ||
  (import.meta.env.DEV ? "admin123" : "");
const SESSION_KEY = "fsf_admin_unlocked";

function AdminGuard({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState(getBackendMode());

  useEffect(() => subscribeToMode(setMode), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!PASSCODE) {
      setError(
        "No admin passcode is configured. Set VITE_ADMIN_PASSCODE in .env.local."
      );
      return;
    }
    if (value === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError("Incorrect passcode. Please try again.");
      setValue("");
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition hover:text-brand-600"
        >
          <FiArrowLeft className="h-3.5 w-3.5" /> Back to site
        </Link>

        <div className="mt-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-warm-lg p-8 sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
            <FiLock className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-3xl text-neutral-900 dark:text-white">
            Admin access
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Enter the foundation's admin passcode to manage events, gallery,
            donations, and messages.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
              >
                Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={value}
                autoComplete="off"
                autoFocus
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin passcode"
                className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-4 py-2.5 text-sm text-error-700 dark:text-error-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-3 shadow-warm-md transition active:scale-[0.99]"
            >
              Unlock admin panel
            </button>
          </form>

          {/* Honest labeling: which backend is the panel talking to? */}
          <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <span
              className={`h-2 w-2 rounded-full ${
                mode === "live"
                  ? "bg-success-500"
                  : mode === "local"
                  ? "bg-warning-500"
                  : "bg-neutral-300 dark:bg-neutral-600"
              }`}
            />
            {mode === "live"
              ? "Connected to the live database"
              : mode === "local"
              ? "Demo mode — changes are saved in this browser only"
              : "Checking database connection…"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGuard;
