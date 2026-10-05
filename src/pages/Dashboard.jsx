import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import { useAuth } from "../context";
import { supabase } from "../lib/supabase";
import {
  FaDonate,
  FaHandsHelping,
  FaCalendarAlt,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";

/**
 * User Dashboard - personal hub for authenticated users.
 * Shows profile info, donation history, volunteer activity, and event registrations.
 */
function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [donationCount, setDonationCount] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [volunteerHours, setVolunteerHours] = useState(0);
  const [eventRegistrations, setEventRegistrations] = useState(0);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState("");

  // All hooks must run on every render, regardless of auth state - the
  // redirect check happens after, in the render body, not before a hook.
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      setDashboardLoading(true);
      setError("");
      try {
        const { data: donations, error: donationErr } = await supabase
          .from("donations")
          .select("amount")
          .eq("email", user.email);
        if (donationErr) throw donationErr;
        setDonationCount(donations?.length || 0);
        setTotalDonated(donations?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0);

        const { data: volunteer, error: volErr } = await supabase
          .from("volunteers")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (volErr && volErr.code !== "PGRST116") throw volErr;
        setVolunteerHours(volunteer?.volunteer_hours || 0);

        const { count, error: eventErr } = await supabase
          .from("event_registrations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (eventErr) throw eventErr;
        setEventRegistrations(count || 0);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        <span className="ml-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">
          Loading dashboard…
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const firstName =
    user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const STATS = [
    {
      label: "Total donated",
      icon: FaDonate,
      value: dashboardLoading ? "…" : `₦${totalDonated.toLocaleString()}`,
      sub: `${donationCount} donation${donationCount !== 1 ? "s" : ""}`,
      chip: "bg-success-50 dark:bg-success-950/50 text-success-600 dark:text-success-400",
    },
    {
      label: "Volunteer hours",
      icon: FaHandsHelping,
      value: dashboardLoading ? "…" : volunteerHours,
      sub: "hours contributed",
      chip: "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400",
    },
    {
      label: "Events attended",
      icon: FaCalendarAlt,
      value: dashboardLoading ? "…" : eventRegistrations,
      sub: "registrations",
      chip: "bg-accent-50 dark:bg-accent-950/50 text-accent-600 dark:text-accent-400",
    },
    {
      label: "Your impact",
      icon: FaHeart,
      value: dashboardLoading ? "…" : donationCount + eventRegistrations + (volunteerHours ? 1 : 0),
      sub: "contributions",
      chip: "bg-error-50 dark:bg-error-950/50 text-error-600 dark:text-error-400",
    },
  ];

  const QUICK_ACTIONS = [
    { to: "/donate", icon: FaDonate, label: "Make a donation", hint: "Every gift reaches a program" },
    { to: "/volunteer", icon: FaHandsHelping, label: "Join as a volunteer", hint: "Lend your hours and skills" },
    { to: "/events", icon: FaCalendarAlt, label: "View events", hint: "See what's coming up" },
  ];

  return (
    <div className="pb-16">
      <SEO path="/dashboard" title="Dashboard" noIndex />

      <header className="reveal mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your hub</p>
          <h1 className="mt-2 font-display text-4xl text-neutral-900 dark:text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Here's your activity across donations, volunteering, and events.
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-8 rounded-2xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-5 py-4 text-sm text-error-700 dark:text-error-300">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, icon: Icon, value, sub, chip }) => (
          <div
            key={label}
            className="surface-card hover-lift p-6"
          >
            <div className="flex items-start justify-between">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${chip}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-5 font-display text-3xl text-neutral-900 dark:text-white">
              {value}
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</p>
              <p className="whitespace-nowrap text-xs text-neutral-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
        {/* Profile panel */}
        <section className="surface-card p-8">
          <h2 className="font-display text-xl text-neutral-900 dark:text-white">
            Profile information
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              ["Full name", user?.full_name || "Not set"],
              ["Email", user?.email],
              ["Phone", user?.phone || "Not set"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {label}
                </p>
                <p className="mt-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 px-4 py-2.5 text-neutral-900 dark:text-neutral-100">
                  {value}
                </p>
              </div>
            ))}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Account status
              </p>
              <p className="mt-1.5 inline-flex items-center gap-2 rounded-xl bg-success-50 dark:bg-success-950/40 px-4 py-2.5 font-medium text-success-700 dark:text-success-400">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                Active
              </p>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="surface-card p-8">
          <h2 className="font-display text-xl text-neutral-900 dark:text-white">
            Quick actions
          </h2>
          <div className="mt-6 space-y-3">
            {QUICK_ACTIONS.map(({ to, icon: Icon, label, hint }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 transition hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/40 dark:hover:bg-brand-950/30"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-neutral-900 dark:text-neutral-100">{label}</span>
                  <span className="block text-xs text-neutral-400">{hint}</span>
                </span>
                <FaArrowRight className="h-4 w-4 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
