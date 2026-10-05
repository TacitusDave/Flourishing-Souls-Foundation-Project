import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiClock, FiUsers, FiArrowRight } from "react-icons/fi";
import VolunteerForm from "../components/volunteer/VolunteerForm";
import SEO from "../components/common/SEO";

const JOURNEY = [
  {
    icon: FiCheckCircle,
    title: "Apply in minutes",
    text: "Tell us who you are and what you can offer — one form, no fees, no gatekeeping.",
  },
  {
    icon: FiClock,
    title: "We match your time",
    text: "Our team pairs your availability and skills with the programs that need them most.",
  },
  {
    icon: FiUsers,
    title: "You show up, lives change",
    text: "Your hours are tracked and reported — see the exact impact you made, always.",
  },
];

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pb-16">
      <SEO
        path="/volunteer"
        title="Volunteer"
        description="Volunteer with Flourishing Souls Foundation — lend your hours and skills to uplift communities through education, health, and social support."
      />
      <header className="reveal mx-auto max-w-3xl text-center mb-12">
        <p className="eyebrow eyebrow--center">Volunteer with us</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-neutral-900 dark:text-white">
          Lend your hours. Change a story.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
          Share your time, skills, and heart to uplift communities through education,
          health, and social support.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.25fr_0.75fr] items-start">
        {/* Form card */}
        <div className="reveal reveal-delay-1 rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-warm-md p-6 sm:p-10">
          {submitted ? (
            <div className="rounded-2xl border border-success-200 dark:border-success-900 bg-success-50 dark:bg-success-950/40 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/60">
                <FiCheckCircle className="h-7 w-7 text-success-600" />
              </div>
              <p className="mt-4 font-display text-2xl text-neutral-900 dark:text-white">
                Thank you!
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                Your interest is recorded. Our team will reach out with opportunities
                that match your availability.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300"
              >
                Back to home
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <p className="eyebrow">Application</p>
              <h2 className="mt-2 font-display text-2xl text-neutral-900 dark:text-white">
                Tell us about you
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Complete the form and our team will reach out with next steps — usually
                within a week.
              </p>
              <div className="mt-6">
                <VolunteerForm onSuccess={() => setSubmitted(true)} />
              </div>
            </>
          )}
        </div>

        {/* Side panel: the journey + what you get */}
        <aside className="reveal reveal-delay-2 space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-8 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[130%] -translate-x-1/2 rounded-full opacity-30 blur-2xl [background:radial-gradient(closest-side,var(--color-brand-600),transparent)]"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              How it works
            </p>
            <ul className="mt-6 space-y-6">
              {JOURNEY.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative flex gap-4">
                  {/* Vertical connector */}
                  {i < JOURNEY.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[1.375rem] top-12 h-[calc(100%-1rem)] w-px bg-neutral-800"
                    />
                  )}
                  <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600/20 text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-base text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-6">
            <p className="font-display text-base text-neutral-900 dark:text-white">
              Prefer to support differently?
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                to="/donate"
                className="group inline-flex items-center justify-between rounded-xl border border-neutral-100 dark:border-neutral-800 px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200 transition hover:border-brand-300 dark:hover:border-brand-800"
              >
                Make a donation
                <FiArrowRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </Link>
              <Link
                to="/events"
                className="group inline-flex items-center justify-between rounded-xl border border-neutral-100 dark:border-neutral-800 px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200 transition hover:border-brand-300 dark:hover:border-brand-800"
              >
                Attend an event
                <FiArrowRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
