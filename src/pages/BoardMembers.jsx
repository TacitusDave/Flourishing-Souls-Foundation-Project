import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import SEO from "../components/common/SEO";

const MISSION_STATEMENTS = [
  {
    icon: " shield ",
    title: "Protect & Nurture",
    text: "Every child in our care receives protection, love, and the essentials for a healthy childhood.",
  },
  {
    icon: " book ",
    title: "Educate & Empower",
    text: "We believe education is the most powerful tool to break cycles of poverty and create lasting change.",
  },
  {
    icon: " heart ",
    title: "Heal & Restore",
    text: "Healthcare access and emotional support help children recover, grow, and thrive.",
  },
  {
    icon: " hands ",
    title: "Build & Connect",
    text: "Strong communities raise strong children — we work with families, schools, and local partners.",
  },
];

export default function BoardMembers() {
  return (
    <div className="pb-16">
      <SEO
        path="/board"
        title="Board Members"
        description="Meet the dedicated board members who guide Flourishing Souls Foundation's mission to support orphaned and vulnerable children through education, healthcare, and community upliftment."
      />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-neutral-50/60">
        <div className="absolute inset-0 bg-[url('/images/brand-assets/footer-texture.png')] bg-cover bg-center opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="eyebrow eyebrow--center">Governance</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-neutral-900">
            The people behind the mission
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-500">
            Our board brings together decades of experience in healthcare, education,
            law, finance, and community development — united by a shared commitment
            to giving vulnerable children a real chance at life.
          </p>
        </div>
      </section>

      {/* ---- Board Members Grid ---- */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Member 1 */}
            <article className="group rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 transition hover:border-brand-200 hover:shadow-warm-md">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src="/images/board/member-1.jpg"
                  alt="Dr. Adaeze Okafor"
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Founder & Chairperson
                </p>
                <h2 className="mt-1 font-display text-xl text-neutral-900">Dr. Adaeze Okafor</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  A medical doctor with over 20 years of experience in child welfare and
                  community health. Dr. Okafor founded the Flourishing Souls Foundation
                  with a vision to give every vulnerable child a chance at a better life.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </article>

            {/* Member 2 */}
            <article className="group rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 transition hover:border-brand-200 hover:shadow-warm-md">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src="/images/board/member-2.jpg"
                  alt="Mr. Chinedu Balogun"
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Vice Chairperson
                </p>
                <h2 className="mt-1 font-display text-xl text-neutral-900">Mr. Chinedu Balogun</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  A seasoned educator and school administrator who has dedicated his
                  career to improving access to quality education for underprivileged
                  children across Nigeria.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </article>

            {/* Member 3 */}
            <article className="group rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 transition hover:border-brand-200 hover:shadow-warm-md">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src="/images/board/member-3.jpg"
                  alt="Mrs. Fatima Yusuf"
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Secretary
                </p>
                <h2 className="mt-1 font-display text-xl text-neutral-900">Mrs. Fatima Yusuf</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  A lawyer specializing in human rights and child protection laws. She
                  brings legal expertise and advocacy experience to guide the foundation's
                  programs and partnerships.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </article>

            {/* Member 4 */}
            <article className="group rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 transition hover:border-brand-200 hover:shadow-warm-md">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src="/images/board/member-4.jpg"
                  alt="Mr. Emeka Nwosu"
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Treasurer
                </p>
                <h2 className="mt-1 font-display text-xl text-neutral-900">Mr. Emeka Nwosu</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  A certified accountant with extensive experience in nonprofit financial
                  management. He ensures transparency and accountability in all financial
                  operations.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </article>

            {/* Member 5 */}
            <article className="group rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 transition hover:border-brand-200 hover:shadow-warm-md sm:col-span-2 lg:col-span-1">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src="/images/board/member-5.jpg"
                  alt="Mrs. Ngozi Eze"
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Member
                </p>
                <h2 className="mt-1 font-display text-xl text-neutral-900">Mrs. Ngozi Eze</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  A social worker and community development specialist who has led
                  numerous outreach programs focusing on women empowerment and child
                  welfare in rural communities.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ---- What We Stand For ---- */}
      <section className="py-16 sm:py-24 bg-neutral-50/80 border-t border-neutral-100">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="eyebrow eyebrow--center">Our values</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-neutral-900">
              What we stand for
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MISSION_STATEMENTS.map(({ icon, title, text }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-neutral-100 bg-white p-6 transition hover:border-brand-200 hover:shadow-warm-sm"
              >
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <span className="text-lg">{icon.trim()}</span>
                </span>
                <div>
                  <h3 className="font-display text-base text-neutral-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="full-bleed border-t border-neutral-100 bg-brand-50/40">
        <div className="relative overflow-hidden">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl text-neutral-900">
              Inspired to get involved?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-500">
              Whether you want to give, volunteer, or simply learn more — there's a place
              for you here.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                to="/donate"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-warm-md transition hover:bg-brand-700"
              >
                Donate now
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
              >
                Volunteer with us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
