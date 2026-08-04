import React, { useState } from "react";
import { Link } from "react-router-dom";
import VolunteerForm from "../components/volunteer/VolunteerForm";

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">
                Volunteer with us
              </p>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Help Flourishing Souls Foundation grow stronger.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Share your time, skills, and heart to uplift communities through education, health, and social support.
              </p>
            </div>
            <div className="space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Complete the volunteer form and our team will reach out with next steps.
              </p>
              {submitted ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-slate-900 dark:bg-emerald-950 dark:text-emerald-200">
                  <p className="font-semibold">Thank you!</p>
                  <p className="mt-2 text-sm">Your interest is recorded. We will contact you with opportunities soon.</p>
                  <Link to="/" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700">
                    Back to Home
                  </Link>
                </div>
              ) : (
                <VolunteerForm onSuccess={() => setSubmitted(true)} />
              )}
            </div>
          </div>
          <aside className="rounded-3xl bg-gradient-to-br from-indigo-600 to-slate-900 p-8 text-white shadow-xl">
            <h2 className="text-xl font-bold">Why volunteer?</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-700 font-semibold">1</span>
                Build real skills while supporting critical causes.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-700 font-semibold">2</span>
                Join a caring community that puts people first.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-700 font-semibold">3</span>
                Make measurable impact in health, education, and livelihood programs.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
