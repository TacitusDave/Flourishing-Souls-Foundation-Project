import React from "react";
import SupportRequestForm from "../components/support/SupportRequestForm";

const FAQS = [
  {
    q: "How soon will I get a response?",
    a: "We typically answer support requests within 24-48 hours.",
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
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400">
          We're here to help
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
          Contact & Support
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Fill out the form below for support requests, feedback, or partnership
          inquiries. Our team responds as soon as possible.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-warm-sm p-6 sm:p-10">
        <SupportRequestForm />
      </div>

      <div className="mt-10 bg-brand-50 dark:bg-neutral-900/60 border border-brand-100 dark:border-neutral-800 rounded-2xl p-6">
        <h2 className="font-display font-semibold text-lg text-brand-800 dark:text-brand-200 mb-4">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          {FAQS.map(({ q, a }) => (
            <li key={q}>
              <span className="font-semibold text-neutral-900 dark:text-white">{q}</span>{" "}
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Support;
