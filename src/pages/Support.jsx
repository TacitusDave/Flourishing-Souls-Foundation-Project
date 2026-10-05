import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiClock, FiArrowRight } from "react-icons/fi";
import SupportRequestForm from "../components/support/SupportRequestForm";
import SEO from "../components/common/SEO";

const FAQS = [
  {
    q: "How soon will I get a response?",
    a: "We typically answer support requests within 24–48 hours.",
  },
  {
    q: "Can I get support by phone?",
    a: "At this time we offer support primarily by email and through this contact form. Urgent requests are prioritized.",
  },
  {
    q: "Can I request assistance for myself or someone else?",
    a: "Absolutely. Please share as many details as possible so we can assess and respond.",
  },
];

const Support = () => {
  return (
    <div className="pb-16">
      <SEO
        path="/support"
        title="Support"
        description="Contact Flourishing Souls Foundation — support requests, feedback, and partnership inquiries. We respond within 24–48 hours."
      />
      <header className="reveal mx-auto max-w-3xl text-center mb-12">
        <p className="eyebrow eyebrow--center">We're here to help</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-neutral-900 dark:text-white">
          Contact &amp; support
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
          Support requests, feedback, or partnership inquiries — our team responds as
          soon as possible.
        </p>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
        {/* Form card */}
        <div className="reveal reveal-delay-1 rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-warm-md p-6 sm:p-10">
          <SupportRequestForm />
        </div>

        {/* Side rail: contact facts + FAQ */}
        <div className="reveal reveal-delay-2 space-y-4">
          <div className="surface-card p-6">
            <p className="font-display text-lg text-neutral-900 dark:text-white">
              Reach us directly
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                  <FiMail className="h-4 w-4" />
                </span>
                <a
                  href="mailto:support@flourishingsoulsfoundation.org"
                  className="link-underline break-all"
                >
                  support@flourishingsoulsfoundation.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                  <FiClock className="h-4 w-4" />
                </span>
                Replies within 24–48 hours
              </li>
            </ul>
          </div>

          <div className="surface-card p-6">
            <p className="font-display text-lg text-neutral-900 dark:text-white">
              Frequently asked
            </p>
            <ul className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              {FAQS.map(({ q, a }) => (
                <li key={q} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{q}</p>
                  <p className="mt-1.5 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{a}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Cross-link to the programs this team runs */}
          <div className="rounded-2xl border border-brand-100 dark:border-brand-900/50 bg-brand-50/50 dark:bg-brand-950/30 p-6">
            <p className="font-display text-base text-neutral-900 dark:text-white">
              Want to help instead?
            </p>
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              Every volunteer hour goes straight to programs.
            </p>
            <Link
              to="/volunteer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-300"
            >
              Volunteer with us
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
