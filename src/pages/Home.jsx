import React from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiBookOpen,
  FiActivity,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const PILLARS = [
  {
    icon: FiHeart,
    title: "Orphan Care & Support",
    text: "Food, shelter, and steady care for children who need a safe place to grow up.",
  },
  {
    icon: FiBookOpen,
    title: "Education Initiatives",
    text: "Scholarships, school supplies, and tutoring so a child's future isn't decided by circumstance.",
  },
  {
    icon: FiActivity,
    title: "Healthcare Services",
    text: "Medical outreach and health support that reaches communities other programs miss.",
  },
  {
    icon: FiUsers,
    title: "Community Upliftment",
    text: "Skill-building and empowerment programs for women and young people ready to lead.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Choose how you help",
    description: "Give directly, volunteer your time, or bring a skill our programs need.",
  },
  {
    step: "02",
    title: "We put it to work",
    description: "Every contribution is routed to an active program — never held, never idle.",
  },
  {
    step: "03",
    title: "You see the outcome",
    description: "Track what your involvement supported through your donor or volunteer dashboard.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero - full-bleed edge-to-edge; animated gradient stands in for the
          video/photo background to be dropped in later (same markup, just
          swap this div for a <video>/<img> layer). */}
      <section className="full-bleed relative overflow-hidden -mt-6 sm:-mt-10 min-h-[85vh] flex items-center px-4 sm:px-6 bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 hero-animated-gradient text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]"
        />
        <div className="relative mx-auto max-w-4xl text-center space-y-8 py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            Empowering lives, nurturing hope, building thriving communities
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.1] tracking-tight">
            Every child deserves a chance to flourish.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/90">
            Flourishing Souls Foundation supports orphan care, education, healthcare, and
            community upliftment — with full transparency into where every donation and
            every volunteer hour goes.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-brand-700 px-8 py-3.5 text-sm font-semibold shadow-warm-lg transition hover:bg-accent-50"
            >
              Donate now <FiArrowRight />
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Volunteer with us
            </Link>
          </div>
        </div>
      </section>

      {/* Mission pillars */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400">
            What we do
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
            Four ways we show up for our community
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-warm-sm transition hover:shadow-warm-md hover:-translate-y-0.5"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
              Simple to give, easy to trust.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600 dark:text-neutral-400">
              No black box. Every donation, volunteer hour, and support request moves
              through the same platform administrators use to run our programs day to day.
            </p>
            <ul className="mt-6 space-y-3">
              {["Secure payments via Paystack", "Real-time impact dashboard", "Transparent donation records"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <FiCheckCircle className="h-5 w-5 text-success-600 shrink-0" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="grid gap-4">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 shadow-warm-sm"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white font-display font-semibold">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 sm:py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
            Ready to be part of it?
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600 dark:text-neutral-400">
            Whether it's a one-time gift, a recurring commitment, or your time as a
            volunteer — every bit of support reaches someone who needs it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-8 py-3.5 text-sm font-semibold shadow-warm-md transition hover:bg-brand-700"
            >
              Give now <FiArrowRight />
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 px-8 py-3.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Request support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
