import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-warm-lg p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300 font-semibold mb-4">
          404 — Page not found
        </p>
        <h1 className="font-display text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          We couldn't find that page
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 mb-8">
          The link may be broken, or the page may have been removed. Head back to the homepage to continue.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-brand-700 transition"
        >
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
}
