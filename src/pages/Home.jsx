import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiBookOpen,
  FiActivity,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiEye,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
} from "react-icons/fi";
import useSettings, { DEFAULT_TIERS, formatNaira } from "../hooks/useSettings";
import SEO from "../components/common/SEO";

/* ------------------------------------------------------------------ */
/* Hero slideshow                                                      */
/* ------------------------------------------------------------------ */

const SLIDES = [
  {
    src: "/images/hero/hero-1.jpg",
    alt: "Volunteers sharing a light moment with children at an outreach",
    words: ["Every", "child", "deserves", "a", "chance", "to", "flourish."],
  },
  {
    src: "/images/hero/hero-2.jpg",
    alt: "A teacher guiding students in a classroom",
    words: ["Every", "classroom", "door", "opens", "a", "future."],
  },
  {
    src: "/images/hero/hero-3.jpg",
    alt: "Students studying together with books and laptops",
    words: ["Mentorship", "turns", "potential", "into", "purpose."],
  },
  {
    src: "/images/hero/hero-4.jpg",
    alt: "A community gathering under open skies",
    words: ["Strong", "communities", "raise", "thriving", "children."],
  },
];

const SLIDE_MS = 6000;

/**
 * One line of copy where every word animates through its own overflow
 * mask. Outgoing words leave first (reverse order, quick); incoming
 * words rise after them, left to right, on a fixed stagger so the
 * hand-off reads as one choreography instead of a swap.
 */
const STEP_MS = 55; // matches --word-step in tailwind.css
const IN_MS = 640; // matches --word-in-ms in tailwind.css
const OUT_MS = 320; // matches --word-out-ms in tailwind.css

/**
 * Exit delay for word `i` of a leaving line: last word leaves first
 * (reverse of the entrance stagger). If the line was switched away from
 * mid-entrance, each word's exit waits until its own entrance would have
 * finished — so an interrupted line keeps cascading in, and every word
 * rolls away exactly after it settled.
 */
function exitDelayFor(i, count, interruptAt) {
  const reverse = (count - 1 - i) * STEP_MS;
  if (interruptAt == null) return reverse;
  return Math.max(reverse, i * STEP_MS + IN_MS - interruptAt);
}

/**
 * One line of headline copy where every word animates through its own
 * overflow mask. Incoming lines roll up word-by-word, left to right;
 * outgoing lines roll up and away in reverse order — optionally delayed
 * by `addOut` ms when the line never finished its entrance.
 * The last `accentCount` words render in the brand color.
 */
function SlideWords({
  words,
  accentCount = 0,
  leaving,
  interruptAt,
  className = "",
}) {
  const count = words.length;
  return (
    <span
      className={`word-reveal ${className}`}
      aria-hidden={leaving ? "true" : undefined}
    >
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="word-mask">
            <span
              className={`${leaving ? "word-out" : "word-in"}${
                i >= count - accentCount ? " text-brand-600" : ""
              }`}
              style={{
                "--word-index": i,
                "--word-count": count,
                ...(leaving
                  ? {
                      animationDelay: `${exitDelayFor(i, count, interruptAt)}ms`,
                    }
                  : null),
              }}
            >
              {word}
            </span>
          </span>
        </React.Fragment>
      ))}
    </span>
  );
}

/**
 * Keeps up to two headline generations alive at once: while the current
 * slide's words animate in, the previous slide's words are still animating
 * out. Once the oldest generation's exit has fully finished, it is dropped.
 */
function useSlideshowStack(index) {
  const [stack, setStack] = useState(() => [
    { index, since: Date.now(), interruptAt: null, dropAt: 0 },
  ]);
  // The index the current stack was built for — updating it during render
  // (the React-documented "adjust state when a prop changes" pattern) keeps
  // the transition out of effects so both lines mount in the same paint.
  const [stackFor, setStackFor] = useState(index);

  if (stackFor !== index) {
    setStackFor(index);
    setStack((prev) => {
      const newest = prev[prev.length - 1];
      if (!newest || newest.index === index) return prev;
      const now = Date.now();
      const kept = prev
        .slice(-1)
        .filter((e) => e.index !== index)
        .map((e) => {
          const count = SLIDES[e.index].words.length;
          return {
            ...e,
            interruptAt: now - e.since,
            // Upper bound on the exit choreography. A late drop is
            // invisible (words already sit at opacity 0); an early one
            // would clip the animation mid-flight.
            dropAt: now + (count - 1) * STEP_MS + IN_MS + OUT_MS,
          };
        });
      return [...kept, { index, since: now, interruptAt: null, dropAt: 0 }];
    });
  }

  useEffect(() => {
    if (stack.length < 2) return undefined;
    const oldest = stack[0];
    const t = setTimeout(
      () => {
        setStack((prev) => prev.filter((e) => e.index !== oldest.index));
      },
      Math.max(0, oldest.dropAt - Date.now()),
    );
    return () => clearTimeout(t);
  }, [stack]);

  return stack;
}

function HeroHeadline({ index }) {
  const stack = useSlideshowStack(index);
  return (
    <h1 className="mt-4 lg:mt-5 font-display text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.08] lg:leading-[1.06] text-neutral-900 dark:text-white">
      {/* Screen readers get one stable sentence; the animated layers are aria-hidden. */}
      <span className="sr-only">
        Every child deserves a chance to flourish.
      </span>
      <span className="relative inline" aria-hidden="true">
        {stack.map((entry, pos) => (
          <span
            key={entry.index}
            className={
              pos === stack.length - 1 ? "relative" : "absolute inset-0"
            }
          >
            <SlideWords
              words={SLIDES[entry.index].words}
              accentCount={1}
              leaving={pos !== stack.length - 1}
              interruptAt={entry.interruptAt}
            />
          </span>
        ))}
      </span>
    </h1>
  );
}

function HeroSlideshow({ index, onSlide }) {
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback(
    (next) => {
      onSlide((next + SLIDES.length) % SLIDES.length);
    },
    [onSlide],
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      onSlide((index + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, onSlide]);

  return (
    <div
      className="group/slideshow relative h-72 sm:h-96 lg:h-full lg:min-h-[540px] w-full overflow-hidden rounded-3xl border border-neutral-200/70 dark:border-neutral-800 shadow-warm-lg"
      role="region"
      aria-roledescription="carousel"
      aria-label="Foundation photo highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          aria-hidden={i !== index}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
          // Subtle Ken Burns drift on the active slide
          style={{
            transform: i === index ? "scale(1.06)" : "scale(1)",
            transition: "opacity 1.2s ease-out, transform 7s ease-out",
          }}
        />
      ))}

      {/* Legibility scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_80%_at_50%_0%,transparent_55%,rgba(0,0,0,0.25))]"
      />
      {/* Progress indicators (double as slide buttons) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-7 bg-white" : "w-3 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Prev / next — appear on hover (desktop) */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50 opacity-0 group-hover/slideshow:opacity-100 focus:opacity-100"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50 opacity-0 group-hover/slideshow:opacity-100 focus:opacity-100"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>

      {/* Pause / play */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play slideshow" : "Pause slideshow"}
        className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
      >
        {paused ? (
          <FiPlay className="h-3.5 w-3.5" />
        ) : (
          <FiPause className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page content                                                        */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    icon: FiHeart,
    title: "Orphan Care & Support",
    text: "Food, shelter, and steady care for children who need a safe place to grow up and someone in their corner.",
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

const STATS = [
  { value: "2,400+", label: "Children supported" },
  { value: "18", label: "Communities reached" },
  { value: "₦86M", label: "Deployed to programs" },
];

const STEPS = [
  {
    step: "01",
    title: "Choose how you help",
    description:
      "Give directly, volunteer your time, or bring a skill our programs need.",
  },
  {
    step: "02",
    title: "We put it to work",
    description:
      "Every contribution is routed to an active program; never held, never idle.",
  },
  {
    step: "03",
    title: "You see the outcome",
    description:
      "Track what your involvement supported, every gift is recorded and reportable.",
  },
];

export default function Home() {
  // Impact tiers are managed in Admin → Settings — amounts, labels, and
  // copy all live there so they never need a code change.
  const settings = useSettings();
  // One shared slide index drives the slideshow AND the hero headline,
  // so the copy swaps in sync with the photo behind it.
  const [slideIndex, setSlideIndex] = useState(0);
  const tiers =
    Array.isArray(settings?.donation_tiers) && settings.donation_tiers.length
      ? settings.donation_tiers
          .map((t) => ({
            amount: Number(t?.amount) || 0,
            tag: t?.tag || "",
            text: t?.text || "",
          }))
          .filter((t) => t.amount > 0)
      : DEFAULT_TIERS;

  return (
    <div>
      <SEO path="/" />
      {/* ------------------------------------------------------------
          Hero — one responsive grid. Mobile flows copy → buttons →
          photos → stats; lg+ splits 70% slideshow / 30% copy, with
          the slideshow stretched to match the copy column's height.
         ------------------------------------------------------------ */}
      <section className="full-bleed relative overflow-hidden -mt-6 sm:-mt-10 border-b border-neutral-100 dark:border-neutral-900">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="hero-animated-gradient absolute -top-48 left-1/3 -translate-x-1/2 h-[36rem] w-[60rem] rounded-full opacity-[0.13] blur-3xl [background:radial-gradient(closest-side,var(--color-brand-400),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-neutral-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-200)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_55%_55%_at_35%_35%,black,transparent)] opacity-30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          {/* One grid, two arrangements:
              mobile  → copy / photos / stats (single column, via order)
              desktop → photos span both rows of the 60% left column while
                        copy and stats stack in the 40% right column, so
                        the message always has room to breathe. */}
          <div className="grid gap-10 items-stretch lg:grid-cols-[60fr_40fr]">
            {/* Photos — 60% left column on desktop (spans both rows) */}
            <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2">
              <HeroSlideshow index={slideIndex} onSlide={setSlideIndex} />
            </div>

            {/* Copy — first on mobile, top of the 40% right column on desktop */}
            <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-4 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                </span>
                Empowering lives, nurturing hope
              </span>
              <HeroHeadline index={slideIndex} />
              <p className="mt-4 max-w-xl lg:max-w-none text-base leading-7 text-neutral-500 dark:text-neutral-400">
                Orphan care, education, healthcare, and community upliftment —
                with full transparency into every donation.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/donate"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-7 py-3.5 text-sm font-semibold shadow-warm-md transition hover:bg-brand-700"
                >
                  Donate now
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/volunteer"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 px-7 py-3.5 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition hover:bg-white dark:hover:bg-neutral-900"
                >
                  Volunteer with us
                </Link>
              </div>
            </div>

            {/* Stats — under the photos on mobile, bottom of the right rail on desktop */}
            <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2">
              <dl className="space-y-5 border-t border-neutral-200 dark:border-neutral-800 pt-7">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-4">
                    <dd className="font-display text-3xl text-neutral-900 dark:text-white w-24 shrink-0">
                      {stat.value}
                    </dd>
                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Mission pillars */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="eyebrow eyebrow--center">What we do</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            Four ways we show up
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-500 dark:text-neutral-400">
            Every program is built around one question: what helps a child not
            just survive, but flourish?
          </p>
        </div>
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group bg-white dark:bg-neutral-950 p-7 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 transition group-hover:scale-105">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 font-display text-lg text-neutral-900 dark:text-white">
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
      <section className="py-16 sm:py-24 border-t border-neutral-100 dark:border-neutral-900">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-neutral-900 dark:text-white">
              Simple to give, easy to trust.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-500 dark:text-neutral-400">
              No account needed — choose an amount, pay securely, and your
              receipt arrives instantly. That's the whole process.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Secure payments via Paystack",
                "Instant, itemized receipt",
                "No signup required to give",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  <FiCheckCircle className="h-4 w-4 text-brand-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="group flex gap-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 transition hover:border-brand-200 dark:hover:border-brand-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-display text-sm">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-lg text-neutral-900 dark:text-white">
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

      {/* Trust row */}
      <section className="py-14 border-t border-neutral-100 dark:border-neutral-900">
        <div className="grid gap-8 sm:grid-cols-3 text-center sm:divide-x sm:divide-neutral-200 dark:sm:divide-neutral-800">
          {[
            {
              icon: FiShield,
              title: "Secure by design",
              text: "Payments processed by Paystack; verified server-side before any record is written.",
            },
            {
              icon: FiEye,
              title: "Fully transparent",
              text: "Every donation is recorded and reportable — your receipt proves where it went.",
            },
            {
              icon: FiTrendingUp,
              title: "100% to programs",
              text: "Contributions route directly to active programs — never held, never idle.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="px-6">
              <Icon
                className="mx-auto h-6 w-6 text-brand-600"
                strokeWidth={1.75}
              />
              <h3 className="mt-4 font-display text-base text-neutral-900 dark:text-white">
                {title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation impact tiers */}
      <section className="py-16 sm:py-24 border-t border-neutral-100 dark:border-neutral-900">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="eyebrow eyebrow--center">What your gift does</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            Give at the level that's right for you
          </h2>
        </div>
        <div
          className={`mx-auto grid max-w-4xl gap-5 ${
            tiers.length >= 3
              ? "sm:grid-cols-3"
              : tiers.length === 2
                ? "sm:grid-cols-2"
                : ""
          }`}
        >
          {tiers.map((tier, i) => (
            <Link
              key={`${tier.amount}-${i}`}
              to="/donate"
              className={`hover-lift group relative rounded-2xl border p-7 ${
                i === 1
                  ? "border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-950/30"
                  : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950"
              }`}
            >
              {tiers.length >= 3 && i === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Most given
                </span>
              )}
              <p className="font-display text-3xl text-neutral-900 dark:text-white">
                {formatNaira(tier.amount)}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {tier.tag}
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {tier.text}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400">
                Give this
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing CTA — soft brand-tinted band in light mode, the deep
          neutral band in dark mode; every colour transitions cleanly
          when the theme changes. */}
      <section className="full-bleed border-t border-neutral-100 dark:border-neutral-900">
        <div className="relative overflow-hidden bg-white">
          {/* Leaf-shadow backdrop: the photo sits over white, softened by a
              white veil and a faint sage wash so the type and buttons stay
              crisp on top of it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[url('/images/cta-leaves.jpg')] bg-cover bg-center"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-white/55" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 [background:radial-gradient(60%_120%_at_50%_0%,var(--color-brand-200),transparent)]"
          />
          <div className="relative mx-auto max-w-3xl text-center px-4 sm:px-6 py-20 sm:py-28">
            <h2 className="font-display text-3xl sm:text-5xl text-neutral-900 dark:text-white transition-colors duration-300">
              Ready to be part of it?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-300 transition-colors duration-300">
              One gift, one hour of your time — every bit of support reaches
              someone who needs it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                to="/donate"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-warm-md transition hover:bg-brand-700 dark:bg-white dark:text-neutral-900 dark:shadow-none dark:hover:bg-neutral-200"
              >
                Give now
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/support"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-white/25 bg-white/60 dark:bg-transparent px-8 py-3.5 text-sm font-semibold text-neutral-800 dark:text-white transition hover:bg-white dark:hover:bg-white/10"
              >
                Request support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
