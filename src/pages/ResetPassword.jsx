import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Destination page for the link sent by supabase.auth.resetPasswordForEmail().
 * Supabase attaches a recovery session to the URL on redirect; this page just
 * needs to call updateUser() with the new password while that session is live.
 */
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    setStatus("submitting");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }
      setStatus("success");
      setMessage("Password updated. You can now sign in with your new password.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setStatus("error");
      setMessage(err?.message || "Could not update password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-900 px-3">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700">
        <h2 className="font-semibold text-2xl mb-5 text-indigo-700 dark:text-indigo-100 text-center">
          Set a New Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label htmlFor="new-password" className="block font-medium text-sm text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === "submitting"}
              className="block mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block font-medium text-sm text-gray-700 dark:text-gray-200">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={status === "submitting"}
              className="block mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-gray-100"
            />
          </div>
          {message && (
            <div
              className={`${
                status === "error"
                  ? "text-red-600 bg-red-100 border border-red-200"
                  : "text-green-700 bg-green-50 border border-green-200"
              } text-sm p-2 rounded`}
            >
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
            className={`w-full py-2.5 px-4 rounded font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all text-lg ${
              status === "submitting" ? "opacity-70 pointer-events-none" : ""
            }`}
          >
            {status === "submitting" ? "Updating..." : "Update Password"}
          </button>
        </form>
        <div className="mt-6 text-xs text-gray-600 dark:text-gray-300 text-center">
          <Link to="/login" className="underline font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
