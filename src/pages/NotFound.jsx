import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300 font-semibold mb-4">
          404 — Page not found
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          We couldn’t find that page
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-8">
          The link may be broken, or the page may have been removed. Head back to the homepage to continue.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
