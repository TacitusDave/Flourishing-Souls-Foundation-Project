import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * The Login page for authenticating users in production.
 * Integrates with Supabase for real-time authentication.
 * Handles email/password login, social providers, and password reset.
 * No simulations, handles real user data end-to-end.
 */
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const navigate = useNavigate();
  const location = useLocation();
  const passwordInput = useRef(null);

  React.useEffect(() => {
    passwordInput.current?.focus();
  }, []);

  // Handle changes to login form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    try {
      const {
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (loginError) {
        setStatus("error");
        setError(loginError.message);
        return;
      }
      setStatus("success");
      // On success, redirect (to dashboard or next) after small delay
      const redirectTo =
        location.state && location.state.from
          ? location.state.from.pathname
          : "/dashboard";
      setTimeout(() => navigate(redirectTo, { replace: true }), 600);
    } catch (err) {
      setStatus("error");
      setError(
        err?.message ||
          "An unexpected error occurred while logging in. Please try again."
      );
    }
  };

  // SOCIAL LOGIN (Google, etc)
  const handleSocial = async (provider) => {
    setError(null);
    setStatus("submitting");
    try {
      const { error: socialError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            window.location.origin +
            "/dashboard", // Or a more advanced redirect as needed
        },
      });
      if (socialError) {
        setStatus("error");
        setError(socialError.message);
      } else {
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
      setError(
        err?.message || "Error connecting with social provider. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 dark:bg-neutral-950 px-3">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-warm-md p-8 border border-neutral-200 dark:border-neutral-700">
        <Link to="/" className="mb-6 flex items-center gap-2 justify-center">
          <img src="/images/logo.svg" alt="Flourishing Souls Foundation" className="h-10" />
          <span className="font-display text-lg text-neutral-900 dark:text-brand-300">
            Flourishing Souls Foundation
          </span>
        </Link>
        <h2 className="font-display text-2xl text-neutral-900 dark:text-white text-center">
          Sign In to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-sm text-neutral-700 dark:text-neutral-200"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                className="block mt-2 w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-brand-400 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 placeholder:text-neutral-400"
                disabled={status === "submitting"}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-sm text-neutral-700 dark:text-neutral-200"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                minLength={6}
                ref={passwordInput}
                placeholder="Your Password"
                value={form.password}
                onChange={handleChange}
                className="block mt-2 w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-brand-400 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 placeholder:text-neutral-400"
                disabled={status === "submitting"}
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="mt-1 text-xs underline text-brand-500 hover:text-brand-700">
                  Forgot Password?
                </Link>
              </div>
            </div>
            {error && (
              <div className="text-error-600 text-sm py-1 px-2 border border-error-300 bg-error-100 rounded">
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-2.5 px-4 rounded font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md transition-all text-lg ${
                status === "submitting" ? "opacity-70 pointer-events-none" : ""
              }`}
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
            >
              {status === "submitting" ? "Signing In..." : "Sign In"}
            </button>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-neutral-300" />
              <span className="mx-3 text-neutral-400 dark:text-neutral-500 text-xs">
                or
              </span>
              <hr className="flex-grow border-neutral-300" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-all"
                onClick={() => handleSocial("google")}
                disabled={status === "submitting"}
                aria-label="Sign in with Google"
              >
                <img src="/images/brand-assets/google.svg" alt="" className="h-5" />
                <span className="font-medium text-neutral-700 dark:text-neutral-100">Sign in with Google</span>
              </button>
              {/* Add more providers if enabled (Facebook, Apple, etc) */}
            </div>
          </form>
        <div className="mt-6 text-xs text-neutral-600 dark:text-neutral-300 text-center">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="underline font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-900"
          >
            Register
          </Link>
        </div>
        <div className="mt-4 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
          By signing in, you agree to our{" "}
          <a href="/privacy" className="underline hover:text-brand-500">
            Privacy Policy
          </a>
          .
        </div>
      </div>
      <footer className="mt-8 text-xs text-neutral-400 dark:text-neutral-500 text-center">
        &copy; {new Date().getFullYear()} Flourishing Souls Foundation. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
