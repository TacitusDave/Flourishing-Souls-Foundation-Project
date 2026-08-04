import React from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiTrendingUp, FiShield, FiCheckCircle } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-indigo-600 via-gray-900 to-white-950 opacity-80" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <section className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100">
                Trusted by organizations building measurable community outcomes.
              </div>
              <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  One platform for donations, volunteers, and mission operations.
                </h1>
                <p className="text-lg leading-8 text-slate-300">
                  Flourishing Souls gives your team a polished, enterprise-style home for campaign management, secure giving, and community engagement.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    to="/donate"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
                  >
                    Give now
                  </Link>
                  <Link
                    to="/support"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                  >
                    Explore the platform
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { metric: "120+", label: "Programs launched" },
                  { metric: "18k", label: "People supported" },
                  { metric: "9.8/10", label: "Partner trust score" },
                  { metric: "100%", label: "Transparent reporting" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
                    <p className="text-2xl font-semibold text-white">{item.metric}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl ring-1 ring-white/10">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-inner">
                  <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Operations view</p>
                  <h2 className="mt-4 text-2xl font-semibold">Organization dashboards made simple</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Monitor donations, volunteer engagement, and campaign progress in a professional dashboard designed for teams.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: <FiTrendingUp className="h-5 w-5 text-indigo-400" />, title: "Performance metrics", text: "Track funding progress and community outcomes in real time." },
                    { icon: <FiUsers className="h-5 w-5 text-indigo-400" />, title: "Volunteer coordination", text: "Keep applications, schedules, and roles organized." },
                    { icon: <FiShield className="h-5 w-5 text-indigo-400" />, title: "Trusted security", text: "Operate with reliable data controls and safe payment flows." },
                    { icon: <FiCheckCircle className="h-5 w-5 text-indigo-400" />, title: "Clear reporting", text: "Share concise impact summaries with donors and stakeholders." },
                  ].map((item) => (
                    <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950 p-5">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-white">
                        {item.icon}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <section className="grid gap-10 lg:grid-cols-3 mb-16">
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/95 p-8 shadow-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Program leadership</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Launch initiatives faster</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">Create campaigns, manage volunteers, and track progress from one polished interface.</p>
          </article>
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/95 p-8 shadow-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Community engagement</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Keep supporters aligned</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">Share outcomes with donors and volunteers through transparent updates and impact stories.</p>
          </article>
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/95 p-8 shadow-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Impact reporting</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Evidence-based results</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">Use data-backed summaries to build trust and improve funding decisions.</p>
          </article>
        </section>
        <section className="rounded-[2rem] bg-slate-900/95 border border-white/10 p-10 shadow-2xl mb-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">How it works</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">A structured process for mission delivery</h2>
              <p className="mt-4 text-base leading-8 text-slate-400">Organize programs, engage volunteers, and report outcomes with confidence using a single coherent workflow.</p>
            </div>
            <div className="grid gap-4">
              {[
                { step: "01", title: "Plan campaigns", description: "Build structured initiatives with clear goals, schedules, and team assignments." },
                { step: "02", title: "Activate volunteers", description: "Align volunteers with roles, communication, and support systems." },
                { step: "03", title: "Show results", description: "Deliver impact summaries and transparent reporting to supporters." },
              ].map((item) => (
                <div key={item.step} className="rounded-3xl border border-white/10 bg-slate-950 p-6">
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white font-semibold">{item.step}</span>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Trusted by impact teams</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Built for organizations that care.</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950 p-4 text-center text-sm text-slate-400">Community Care</div>
              <div className="rounded-3xl border border-white/10 bg-slate-950 p-4 text-center text-sm text-slate-400">Youth Outreach</div>
              <div className="rounded-3xl border border-white/10 bg-slate-950 p-4 text-center text-sm text-slate-400">Health Initiatives</div>
              <div className="rounded-3xl border border-white/10 bg-slate-950 p-4 text-center text-sm text-slate-400">Volunteer Operations</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

