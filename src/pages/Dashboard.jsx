import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "../context";
import { supabase } from "../lib/supabase";
import { FaUser, FaDonate, FaHandsHelping, FaCalendarAlt, FaHeart } from "react-icons/fa";

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
        <span className="ml-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const STATS = [
    {
      label: "Total Donations",
      icon: FaDonate,
      value: `₦${totalDonated.toLocaleString()}`,
      sub: `${donationCount} donation${donationCount !== 1 ? "s" : ""}`,
      accent: "success",
    },
    {
      label: "Volunteer Hours",
      icon: FaHandsHelping,
      value: dashboardLoading ? "..." : volunteerHours,
      sub: "hours contributed",
      accent: "brand",
    },
    {
      label: "Events",
      icon: FaCalendarAlt,
      value: dashboardLoading ? "..." : eventRegistrations,
      sub: "registered",
      accent: "accent",
    },
    {
      label: "Your Impact",
      icon: FaHeart,
      value: donationCount + eventRegistrations + (volunteerHours ? 1 : 0),
      sub: "contributions",
      accent: "error",
    },
  ];

  const ACCENT_CLASSES = {
    success: { border: "border-success-500", icon: "text-success-600", value: "text-success-600" },
    brand: { border: "border-brand-500", icon: "text-brand-600", value: "text-brand-600" },
    accent: { border: "border-accent-500", icon: "text-accent-600", value: "text-accent-600" },
    error: { border: "border-error-500", icon: "text-error-600", value: "text-error-600" },
  };

  const QUICK_ACTIONS = [
    { to: "/donate", icon: FaDonate, label: "Make Donation", color: "text-success-600" },
    { to: "/volunteer", icon: FaHandsHelping, label: "Join Volunteer", color: "text-brand-600" },
    { to: "/events", icon: FaCalendarAlt, label: "View Events", color: "text-accent-600" },
  ];

  return (
    <div>
      <Helmet>
        <title>Dashboard | Flourishing Souls Foundation</title>
        <meta name="description" content="Your personal dashboard and activity" />
      </Helmet>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-neutral-900 dark:text-white">
          Welcome back, {user?.full_name?.split(" ")[0] || user?.email}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Here's your activity summary</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-200 rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {STATS.map(({ label, icon: Icon, value, sub, accent }) => (
          <div
            key={label}
            className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-warm-sm p-6 border-l-4 ${ACCENT_CLASSES[accent].border}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">{label}</h3>
              <Icon className={`text-2xl ${ACCENT_CLASSES[accent].icon}`} />
            </div>
            <div className={`text-3xl font-display font-bold ${ACCENT_CLASSES[accent].value}`}>{value}</div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-warm-sm p-8 mb-10">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 flex items-center">
          <FaUser className="mr-3 text-brand-600" />
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["Full Name", user?.full_name || "Not set"],
            ["Email", user?.email],
            ["Phone", user?.phone || "Not set"],
          ].map(([label, value]) => (
            <div key={label}>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{label}</label>
              <p className="text-lg text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl">
                {value}
              </p>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Account Status
            </label>
            <p className="text-lg text-success-700 dark:text-success-400 bg-success-50 dark:bg-success-900/20 p-3 rounded-xl font-semibold">
              Active
            </p>
          </div>
        </div>
      </div>

      <div className="border border-neutral-100 dark:border-neutral-800 rounded-2xl p-8">
        <h2 className="font-display text-2xl text-neutral-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label, color }) => (
            <Link
              key={to}
              to={to}
              className="block p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-warm-sm transition text-center"
            >
              <Icon className={`text-3xl mx-auto mb-2 ${color}`} />
              <span className="font-semibold text-neutral-800 dark:text-neutral-100">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
