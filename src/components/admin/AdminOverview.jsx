import React from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiHelpCircle,
  FiImage,
  FiActivity,
} from "react-icons/fi";
import { getBackendMode, subscribeToMode } from "../../lib/adminStore";
import useAdminData from "./useAdminData";
import {
  listEvents,
  listDonations,
  listVolunteers,
  listSupportRequests,
  listGallery,
} from "../../lib/adminStore";

/** Small stat card used across the panel. */
export function StatCard({ icon: Icon, label, value, hint, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400",
    success: "bg-success-50 dark:bg-success-900/40 text-success-600 dark:text-success-400",
    warning: "bg-warning-50 dark:bg-warning-900/40 text-warning-600 dark:text-warning-400",
    error: "bg-error-50 dark:bg-error-900/40 text-error-600 dark:text-error-400",
    neutral: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300",
  };
  return (
    <div className="surface-card p-5">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <p className="mt-4 font-display text-3xl text-neutral-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      {hint && <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{hint}</p>}
    </div>
  );
}

/**
 * AdminOverview — the at-a-glance dashboard: totals across every
 * collection, recent donations, and requests needing attention.
 */
function AdminOverview({ onNavigate }) {
  const events = useAdminData(listEvents);
  const donations = useAdminData(listDonations);
  const volunteers = useAdminData(listVolunteers);
  const requests = useAdminData(listSupportRequests);
  const gallery = useAdminData(listGallery);
  const mode = React.useSyncExternalStore(subscribeToMode, getBackendMode);

  const loading =
    events.loading || donations.loading || volunteers.loading ||
    requests.loading || gallery.loading;
  const error = events.error || donations.error || volunteers.error ||
    requests.error || gallery.error;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-500">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        <span className="ml-3 text-sm">Loading overview…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-5 py-4 text-sm text-error-700 dark:text-error-300">
        {error}
      </div>
    );
  }

  const donationList = donations.data || [];
  const total = donationList.reduce((s, d) => s + Number(d.amount || 0), 0);
  const now = new Date();
  const thisMonth = donationList
    .filter((d) => {
      const t = new Date(d.paid_at || d.created_at);
      return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
    })
    .reduce((s, d) => s + Number(d.amount || 0), 0);
  const pending = (requests.data || []).filter((r) => r.status === "pending").length;
  const upcoming = (events.data || []).filter((e) => new Date(e.date) >= now).length;

  const cards = [
    { icon: FiDollarSign, label: "Total raised", value: `₦${total.toLocaleString()}`, hint: `₦${thisMonth.toLocaleString()} this month`, tone: "success" },
    { icon: FiCalendar, label: "Events", value: (events.data || []).length, hint: `${upcoming} upcoming`, tone: "brand" },
    { icon: FiUsers, label: "Volunteers", value: (volunteers.data || []).length, hint: `${(volunteers.data || []).filter((v) => v.status === "active").length} active`, tone: "neutral" },
    { icon: FiHelpCircle, label: "Support requests", value: (requests.data || []).length, hint: `${pending} awaiting reply`, tone: pending > 0 ? "warning" : "neutral" },
    { icon: FiImage, label: "Gallery items", value: (gallery.data || []).length, tone: "neutral" },
    { icon: FiActivity, label: "Data source", value: mode === "live" ? "Live" : "Demo", hint: mode === "live" ? "Connected to Supabase" : "Saved in this browser", tone: mode === "live" ? "success" : "warning" },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Recent donations */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-neutral-900 dark:text-white">Recent donations</h2>
          <button
            type="button"
            onClick={() => onNavigate("donations")}
            className="text-sm font-medium text-brand-600 dark:text-brand-400 link-underline"
          >
            View all
          </button>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-800">
          <table className="w-full min-w-[540px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 text-left text-xs uppercase tracking-wider text-neutral-400">
                <th className="px-5 py-3 font-semibold">Donor</th>
                <th className="px-5 py-3 font-semibold">Reference</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {donationList.slice(0, 5).map((d) => (
                <tr key={d.id} className="bg-white dark:bg-neutral-950">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{d.name}</div>
                    <div className="text-xs text-neutral-400">{d.email}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{d.reference}</td>
                  <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">
                    {new Date(d.paid_at || d.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-neutral-900 dark:text-white">
                    ₦{Number(d.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
              {donationList.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-neutral-400">
                    No donations recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Requests needing attention */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-neutral-900 dark:text-white">Needs attention</h2>
          <button
            type="button"
            onClick={() => onNavigate("messages")}
            className="text-sm font-medium text-brand-600 dark:text-brand-400 link-underline"
          >
            View all
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {(requests.data || [])
            .filter((r) => r.status === "pending" || r.status === "in_progress")
            .slice(0, 3)
            .map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{r.subject}</p>
                  <p className="mt-0.5 truncate text-xs text-neutral-400">
                    {r.name} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    r.status === "pending"
                      ? "bg-warning-50 dark:bg-warning-900/40 text-warning-700 dark:text-warning-300"
                      : "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300"
                  }`}
                >
                  {r.status.replace("_", " ")}
                </span>
              </div>
            ))}
          {(requests.data || []).filter((r) => r.status === "pending" || r.status === "in_progress").length === 0 && (
            <p className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 text-sm text-neutral-400">
              Nothing waiting — every request has been handled. 🎉
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminOverview;
