import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "../context";
import { supabase } from "../lib/supabase";
import {
  FaUser,
  FaDonate,
  FaHandsHelping,
  FaCalendarAlt,
  FaHeart,
} from "react-icons/fa";

/**
 * User Dashboard - Personal hub for authenticated users
 * Displays profile info, donation history, volunteer activity, and event registrations
 */

function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [donationCount, setDonationCount] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [volunteerHours, setVolunteerHours] = useState(0);
  const [eventRegistrations, setEventRegistrations] = useState(0);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Fetch user dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      setDashboardLoading(true);
      setError("");

      try {
        // Fetch donations
        const { data: donations, error: donationErr } = await supabase
          .from("donations")
          .select("amount")
          .eq("email", user.email);

        if (donationErr) throw donationErr;

        setDonationCount(donations?.length || 0);
        setTotalDonated(
          donations?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0
        );

        // Fetch volunteer info
        const { data: volunteer, error: volErr } = await supabase
          .from("volunteers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (volErr && volErr.code !== "PGRST116") throw volErr;
        setVolunteerHours(volunteer?.volunteer_hours || 0);

        // Fetch event registrations
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-200">
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <Helmet>
        <title>Dashboard | Flourishing Souls Foundation</title>
        <meta name="description" content="Your personal dashboard and activity" />
      </Helmet>

      {/* Header */}
      <header className="w-full bg-white dark:bg-slate-800 shadow-sm px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
            Welcome back, {user?.full_name?.split(" ")[0] || user?.email}! 👋
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Here's your activity summary
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Donations */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Total Donations
              </h3>
              <FaDonate className="text-2xl text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              ₦{totalDonated.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {donationCount} donation{donationCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Volunteer Hours */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Volunteer Hours
              </h3>
              <FaHandsHelping className="text-2xl text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {dashboardLoading ? "..." : volunteerHours}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              hours contributed
            </p>
          </div>

          {/* Events Registered */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Events
              </h3>
              <FaCalendarAlt className="text-2xl text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {dashboardLoading ? "..." : eventRegistrations}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              registered
            </p>
          </div>

          {/* Impact */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Your Impact
              </h3>
              <FaHeart className="text-2xl text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">
              {donationCount + eventRegistrations + (volunteerHours ? 1 : 0)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              contributions
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <FaUser className="mr-3 text-indigo-600" />
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 p-3 rounded">
                {user?.full_name || "Not set"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 p-3 rounded">
                {user?.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <p className="text-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 p-3 rounded">
                {user?.phone || "Not set"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Status
              </label>
              <p className="text-lg text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded font-semibold">
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/donate"
              className="block p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <FaDonate className="text-3xl text-green-600 mx-auto mb-2" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Make Donation
              </span>
            </a>

            <a
              href="/volunteer"
              className="block p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <FaHandsHelping className="text-3xl text-blue-600 mx-auto mb-2" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Join Volunteer
              </span>
            </a>

            <a
              href="/events"
              className="block p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <FaCalendarAlt className="text-3xl text-purple-600 mx-auto mb-2" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                View Events
              </span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
