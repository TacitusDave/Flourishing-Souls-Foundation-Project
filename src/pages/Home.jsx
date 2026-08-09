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
      {/* Hero - white canvas, one precise purple accent, no gradient wash.
          .full-bleed still breaks this out to the true viewport edge; the
          hero-animated-gradient badge behind the headline is the one place
          motion/color earns its keep until real photography replaces it. */}
      <section className="full-bleed relative overflow-hidden -mt-6 sm:-mt-10 px-4 sm:px-6 border-b border-neutral-100 dark:border-neutral-900">
        <div
          aria-hidden="true"
          className="hero-animated-gradient absolute -top-40 left-1/2 -translate-x-1/2 h-[36rem] w-[56rem] rounded-full opacity-[0.15] blur-3xl [background:radial-gradient(closest-side,var(--color-brand-500),transparent)]"
        />
        <div className="relative mx-auto max-w-3xl text-center py-24 sm:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Empowering lives, nurturing hope, building thriving communities
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl leading-[1.05] text-neutral-900 dark:text-white">
            Every child deserves
            <br />
            a chance to <span className="text-brand-600">flourish.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
            Flourishing Souls Foundation supports orphan care, education, healthcare, and
            community upliftment — with full transparency into where every donation and
            every volunteer hour goes.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-7 py-3 text-sm font-semibold shadow-warm-md transition hover:bg-brand-700"
            >
              Donate now <FiArrowRight />
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 px-7 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              Volunteer with us
            </Link>
          </div>
        </div>
      </section>

      {/* Mission pillars */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            What we do
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            Four ways we show up
          </h2>
        </div>
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white dark:bg-neutral-950 p-7 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <Icon className="h-5 w-5 text-brand-600" strokeWidth={2} />
              <h3 className="mt-4 font-display text-base text-neutral-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 border-t border-neutral-100 dark:border-neutral-900">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-neutral-900 dark:text-white">
              Simple to give, easy to trust.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-500 dark:text-neutral-400">
              No black box. Every donation, volunteer hour, and support request moves
              through the same platform administrators use to run our programs day to day.
            </p>
            <ul className="mt-6 space-y-3">
              {["Secure payments via Paystack", "Real-time impact dashboard", "Transparent donation records"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <FiCheckCircle className="h-4 w-4 text-brand-600 shrink-0" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="grid gap-3">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-xl border border-neutral-100 dark:border-neutral-800 p-6"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-base text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 sm:py-28 border-t border-neutral-100 dark:border-neutral-900 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            Ready to be part of it?
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-500 dark:text-neutral-400">
            Whether it's a one-time gift, a recurring commitment, or your time as a
            volunteer — every bit of support reaches someone who needs it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-7 py-3 text-sm font-semibold shadow-warm-md transition hover:bg-brand-700"
            >
              Give now <FiArrowRight />
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 px-7 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              Request support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
