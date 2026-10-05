import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FiCheckCircle } from "react-icons/fi";
import SEO from "../components/common/SEO";

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
    <div className="-my-6 sm:-my-10 min-h-[calc(100vh-8rem)] flex items-center justify-center px-1">
      <SEO path="/login" title="Staff login" noIndex />
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-warm-lg grid lg:grid-cols-[1fr_1.1fr]">
        {/* Brand rail — the "why you're here" side */}
        <div className="relative hidden overflow-hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(80%_60%_at_20%_0%,var(--color-brand-800),transparent)]"
          />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src="/images/brand-assets/fsf-icon.png" alt="" className="h-9 w-9" />
              <span className="font-display text-lg">Flourishing Souls</span>
            </Link>
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl leading-snug">
              Every child deserves a chance to{" "}
              <em className="not-italic text-brand-400">flourish.</em>
            </h2>
            <ul className="mt-8 space-y-3.5 text-sm text-neutral-300">
              {[
                "Track every donation you've made",
                "See the programs your gifts funded",
                "Log volunteer hours and sign up for events",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-xs text-neutral-500">
            © {new Date().getFullYear()} Flourishing Souls Foundation
          </p>
        </div>

        {/* Form side */}
        <div className="p-7 sm:p-10">
          <div className="mb-7 flex items-center gap-2.5 lg:hidden">
            <img src="/images/brand-assets/fsf-icon.png" alt="" className="h-9 w-9" />
            <span className="font-display text-lg text-neutral-900 dark:text-white">
              Flourishing Souls
            </span>
          </div>

          <p className="eyebrow">Staff access</p>
          <h2 className="mt-2 font-display text-3xl text-neutral-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            This area is for foundation staff. Donations never need an account —
            every gift is processed securely without one.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" autoComplete="on">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
              >
                Email address
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
                className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                disabled={status === "submitting"}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                >
                  Password
                </label>
                <a
                  href="mailto:support@flourishingsoulsfoundation.org?subject=Password%20reset%20request"
                  className="text-xs font-medium text-brand-600 dark:text-brand-400 link-underline"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                minLength={6}
                ref={passwordInput}
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                disabled={status === "submitting"}
              />
            </div>
            {error && (
              <div className="rounded-xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-4 py-3 text-sm text-error-700 dark:text-error-300">
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-3 shadow-warm-md transition active:scale-[0.99] ${
                status === "submitting" ? "opacity-70 pointer-events-none" : ""
              }`}
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
            >
              {status === "submitting" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="flex items-center gap-3 pt-1">
              <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
              <span className="text-xs text-neutral-400 dark:text-neutral-500">or</span>
              <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 font-medium text-neutral-700 dark:text-neutral-100 transition hover:bg-neutral-50 dark:hover:bg-neutral-700"
              onClick={() => handleSocial("google")}
              disabled={status === "submitting"}
              aria-label="Sign in with Google"
            >
              <img src="/images/brand-assets/google.svg" alt="" className="h-5" />
              Continue with Google
            </button>
          </form>

          <div className="mt-8 text-sm text-neutral-600 dark:text-neutral-300 text-center">
            Want to help instead?{" "}
            <Link
              to="/donate"
              className="font-semibold text-brand-700 dark:text-brand-300 link-underline"
            >
              Make a donation
            </Link>
          </div>
          <div className="mt-6 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
            By signing in, you agree to our{" "}
            <a href="/privacy" className="underline hover:text-brand-500">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
