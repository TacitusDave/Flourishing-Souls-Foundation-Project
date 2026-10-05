import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import SEO from "../components/common/SEO";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <SEO title="Page not found" noIndex />
      <div className="max-w-2xl w-full text-center">
        <p className="reveal font-display text-[7rem] sm:text-[10rem] leading-none text-brand-600/15 dark:text-brand-400/10 select-none">
          404
        </p>
        <h1 className="reveal reveal-delay-1 -mt-8 sm:-mt-14 font-display text-3xl sm:text-4xl text-neutral-900 dark:text-white">
          We couldn't find that page
        </h1>
        <p className="reveal reveal-delay-2 mx-auto mt-4 max-w-md text-base leading-7 text-neutral-500 dark:text-neutral-400">
          The link may be broken, or the page may have been removed. Try one of
          these instead.
        </p>
        <div className="reveal reveal-delay-3 mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {[
            { to: "/", label: "Home" },
            { to: "/donate", label: "Donate" },
            { to: "/events", label: "Events" },
            { to: "/gallery", label: "Gallery" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="reveal reveal-delay-4 mt-6">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-7 py-3 text-sm font-semibold shadow-warm-md transition hover:bg-brand-700"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
