import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiLayout,
  FiCalendar,
  FiImage,
  FiDollarSign,
  FiMail,
  FiSettings,
} from "react-icons/fi";
import AdminGuard from "../components/admin/AdminGuard";
import SEO from "../components/common/SEO";
import AdminOverview from "../components/admin/AdminOverview";
import AdminEvents from "../components/admin/AdminEvents";
import AdminGallery from "../components/admin/AdminGallery";
import AdminDonations from "../components/admin/AdminDonations";
import AdminMessages from "../components/admin/AdminMessages";
import AdminSettings from "../components/admin/AdminSettings";

/**
 * Admin panel — passcode-gated (AdminGuard) and powered by adminStore,
 * which targets the live Supabase project when it's reachable and a
 * local demo store otherwise. Every section below works in both modes.
 */

const ADMIN_TABS = [
  { label: "Overview", value: "overview", icon: FiLayout, component: AdminOverview },
  { label: "Events", value: "events", icon: FiCalendar, component: AdminEvents },
  { label: "Gallery", value: "gallery", icon: FiImage, component: AdminGallery },
  { label: "Donations", value: "donations", icon: FiDollarSign, component: AdminDonations },
  { label: "Messages", value: "messages", icon: FiMail, component: AdminMessages },
  { label: "Settings", value: "settings", icon: FiSettings, component: AdminSettings },
];

function Admin() {
  const [activeTab, setActiveTab] = useState(ADMIN_TABS[0].value);

  const ActiveComponent =
    ADMIN_TABS.find((tab) => tab.value === activeTab)?.component || AdminOverview;

  return (
    <>
      <SEO path="/admin" title="Admin panel" noIndex />
      <AdminGuard>
      <section className="admin-root w-full min-h-screen text-neutral-800 dark:text-neutral-100 pb-16">
        <header className="reveal -mx-4 sm:-mx-6 border-b border-neutral-100 dark:border-neutral-800 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                to="/"
                className="text-xs font-medium text-neutral-400 transition hover:text-brand-600"
              >
                &larr; Back to site
              </Link>
              <h1 className="mt-2 font-display text-4xl text-neutral-900 dark:text-white">
                Admin panel
              </h1>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Manage events, gallery, donations, messages, and site settings.
              </p>
            </div>
            <div
              role="tablist"
              aria-label="Admin sections"
              className="flex flex-wrap gap-1.5"
            >
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={activeTab === tab.value}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.value
                      ? "bg-brand-600 text-white shadow-warm-sm"
                      : "border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300"
                  }`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="mt-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20 text-neutral-500">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
                <span className="ml-3 text-sm">Loading admin content…</span>
              </div>
            }
          >
            <ActiveComponent onNavigate={setActiveTab} />
          </Suspense>
        </main>
      </section>
    </AdminGuard>
    </>
  );
}

export default Admin;
