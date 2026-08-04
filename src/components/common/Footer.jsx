import React from "react";
import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com/flourishingsoulsfoundation",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.406.593 24 1.325 24h11.495v-9.294H9.692V11.01h3.128V8.414c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.92.001c-1.504 0-1.796.715-1.796 1.763v2.314h3.587l-.467 3.697H16.56V24h6.115C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.675 0" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/floursoulsfdn",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M22.46 5.924c-.793.352-1.644.59-2.538.697a4.484 4.484 0 0 0 1.963-2.475 8.936 8.936 0 0 1-2.831 1.082 4.467 4.467 0 0 0-7.606 4.073C7.69 9.109 4.067 7.23 1.64 4.151a4.48 4.48 0 0 0-.601 2.244c0 1.548.788 2.915 1.987 3.719a4.456 4.456 0 0 1-2.025-.56v.056a4.486 4.486 0 0 0 3.581 4.389 4.49 4.49 0 0 1-2.02.077 4.485 4.485 0 0 0 4.187 3.117A8.965 8.965 0 0 1 2 19.54a12.686 12.686 0 0 0 6.88 2.023c8.264 0 12.788-6.843 12.788-12.777 0-.195-.005-.39-.014-.583A9.14 9.14 0 0 0 24 4.59a8.8 8.8 0 0 1-2.54.697z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/flourishingsoulsfoundation",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M22.23 0H1.77A1.77 1.77 0 0 0 0 1.77V22.23A1.77 1.77 0 0 0 1.77 24H22.23A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0zM7.09 20.45H3.56V9h3.53zm-1.77-13A2.05 2.05 0 1 1 7.36 5.4a2.05 2.05 0 1 1-2.04-2.05zM20.45 20.45h-3.53v-5.65c0-1.35-.03-3.08-1.88-3.08-1.89 0-2.18 1.48-2.18 3v5.73h-3.53V9h3.39v1.56h.05a3.72 3.72 0 0 1 3.35-1.84c3.58 0 4.24 2.36 4.24 5.43z" />
      </svg>
    ),
  },
];

const footerNav = [
  { label: "Home", href: "/" },
  { label: "Donate", href: "/donate" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Support", href: "/support" },
];

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-neutral-800 to-neutral-950 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950 text-neutral-300 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/images/logo.svg" alt="" className="h-10 w-10" />
              <span className="text-xl font-display font-semibold text-white">Flourishing Souls</span>
            </Link>
            <p className="max-w-md text-sm leading-7 text-neutral-400">
              Supporting orphan care, education, healthcare, and community upliftment —
              with full transparency into every donation and every volunteer hour.
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900 text-neutral-200 transition hover:border-brand-500 hover:text-brand-100"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">Explore</p>
            <ul className="mt-6 space-y-3 text-sm text-neutral-300">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">Contact</p>
            <div className="mt-6 space-y-3 text-sm text-neutral-300">
              <a href="mailto:support@flourishingsoulsfoundation.org" className="block hover:text-white transition">
                support@flourishingsoulsfoundation.org
              </a>
              <Link to="/support" className="block hover:text-white transition">
                Submit a support request &rarr;
              </Link>
            </div>
            <div className="mt-6">
              <Link
                to="/donate"
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-700"
              >
                Donate now
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Flourishing Souls Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
      