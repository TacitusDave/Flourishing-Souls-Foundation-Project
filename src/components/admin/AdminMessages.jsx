import React, { useState } from "react";
import useAdminData from "./useAdminData";
import { listSupportRequests, updateSupportRequest, listVolunteers } from "../../lib/adminStore";

const STATUS_FLOW = ["pending", "in_progress", "resolved", "closed"];

const statusStyles = {
  pending: "bg-warning-50 dark:bg-warning-900/40 text-warning-700 dark:text-warning-300",
  in_progress: "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300",
  resolved: "bg-success-50 dark:bg-success-900/40 text-success-700 dark:text-success-300",
  closed: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400",
};

/**
 * AdminMessages — support requests (public "Request support" form
 * submissions) with a status workflow, plus the volunteer applications
 * list. Support status changes write through adminStore in both modes.
 */
function AdminMessages() {
  const requests = useAdminData(listSupportRequests);
  const volunteers = useAdminData(listVolunteers);
  const [openId, setOpenId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loading = requests.loading || volunteers.loading;
  const error = requests.error || volunteers.error;

  const advance = async (request) => {
    const i = STATUS_FLOW.indexOf(request.status);
    const next = STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)];
    setUpdatingId(request.id);
    try {
      await updateSupportRequest(request.id, { status: next });
      await requests.reload();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-500">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
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

  const requestList = requests.data || [];
  const volunteerList = volunteers.data || [];

  return (
    <div className="space-y-10">
      {/* Support requests */}
      <section>
        <h2 className="font-display text-xl text-neutral-900 dark:text-white">
          Support requests
          <span className="ml-2 text-sm font-sans font-normal text-neutral-400">
            ({requestList.filter((r) => r.status === "pending").length} pending)
          </span>
        </h2>
        <div className="mt-4 space-y-3">
          {requestList.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950"
            >
              <button
                type="button"
                onClick={() => setOpenId(openId === r.id ? null : r.id)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
                aria-expanded={openId === r.id}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{r.subject}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {r.name} · {r.email} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyles[r.status] || statusStyles.closed}`}
                >
                  {r.status.replace("_", " ")}
                </span>
              </button>
              {openId === r.id && (
                <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-4">
                  <p className="whitespace-pre-line text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {r.message}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {r.status !== "closed" && r.status !== "resolved" && (
                      <button
                        type="button"
                        onClick={() => advance(r)}
                        disabled={updatingId === r.id}
                        className="rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
                      >
                        {updatingId === r.id
                          ? "Saving…"
                          : r.status === "pending"
                          ? "Start handling"
                          : "Mark resolved"}
                      </button>
                    )}
                    <a
                      href={`mailto:${r.email}?subject=Re: ${encodeURIComponent(r.subject)}`}
                      className="rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300"
                    >
                      Reply by email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
          {requestList.length === 0 && (
            <p className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 text-sm text-neutral-400">
              No support requests yet.
            </p>
          )}
        </div>
      </section>

      {/* Volunteers */}
      <section>
        <h2 className="font-display text-xl text-neutral-900 dark:text-white">
          Volunteers
          <span className="ml-2 text-sm font-sans font-normal text-neutral-400">
            ({volunteerList.filter((v) => v.status === "active").length} active)
          </span>
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-800">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 text-left text-xs uppercase tracking-wider text-neutral-400">
                <th className="px-5 py-3 font-semibold">Volunteer</th>
                <th className="px-5 py-3 font-semibold">Skills</th>
                <th className="px-5 py-3 font-semibold">Availability</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {volunteerList.map((v) => (
                <tr key={v.id} className="bg-white dark:bg-neutral-950">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{v.name}</div>
                    <div className="text-xs text-neutral-400">{v.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {(v.skills || []).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-brand-50 dark:bg-brand-900/40 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">{v.availability}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                        v.status === "active"
                          ? "bg-success-50 dark:bg-success-900/40 text-success-700 dark:text-success-300"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
              {volunteerList.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-neutral-400">
                    No volunteer applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminMessages;
