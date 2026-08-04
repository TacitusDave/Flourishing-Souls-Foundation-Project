import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { sendPasswordReset } from "../services/authService";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const { error } = await sendPasswordReset(email.trim());
      if (error) {
        setStatus("error");
        setMessage(error.message || "Unable to send reset email.");
      } else {
        setStatus("success");
        setMessage("Password reset instructions have been sent to your email.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Unable to complete request.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>Forgot Password | Flourishing Souls Foundation</title>
      </Helmet>
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Reset your password
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Enter your email and we’ll send you a secure password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </label>
          {message && (
            <div className={`rounded-2xl px-4 py-3 text-sm ${status === "success" ? "bg-success-50 text-success-700" : "bg-error-50 text-error-700"}`}>
              {message}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-brand-600 text-white px-5 py-3 text-sm font-semibold shadow hover:bg-brand-700 transition"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Submitting…" : "Send reset email"}
          </button>
        </form>

        <div className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          Remembered your password? <Link to="/login" className="text-brand-600 dark:text-brand-300 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
