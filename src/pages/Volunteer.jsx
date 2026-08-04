import React, { useState } from "react";
import { Link } from "react-router-dom";
import VolunteerForm from "../components/volunteer/VolunteerForm";

const REASONS = [
  "Build real skills while supporting critical causes.",
  "Join a caring community that puts people first.",
  "Make measurable impact in health, education, and livelihood programs.",
];

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] max-w-6xl mx-auto">
      <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-warm-sm p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400">
          Volunteer with us
        </p>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
          Help Flourishing Souls Foundation grow stronger.
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Share your time, skills, and heart to uplift communities through education,
          health, and social support.
        </p>
        <div className="mt-6 space-y-5">
          {submitted ? (
            <div className="rounded-2xl border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/30 p-6 text-neutral-900 dark:text-success-200">
              <p className="font-semibold">Thank you!</p>
              <p className="mt-2 text-sm">Your interest is recorded. We will contact you with opportunities soon.</p>
              <Link to="/" className="mt-4 inline-flex items-center text-brand-600 hover:text-brand-700 font-medium">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Complete the volunteer form and our team will reach out with next steps.
              </p>
              <VolunteerForm onSuccess={() => setSubmitted(true)} />
            </>
          )}
        </div>
      </div>
      <aside className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-950 p-8 text-white shadow-warm-lg h-fit">
        <h2 className="font-display text-xl font-bold">Why volunteer?</h2>
        <ul className="mt-6 space-y-4 text-sm leading-7">
          {REASONS.map((reason, i) => (
            <li key={reason} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 font-display font-semibold">
                {i + 1}
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
