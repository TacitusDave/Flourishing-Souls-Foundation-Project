import React, { useState, useMemo } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";
import useAdminData from "./useAdminData";
import { listDonations } from "../../lib/adminStore";

/**
 * AdminDonations — read-only donation ledger with search, totals, and
 * CSV export. Rows are written by payment verification, so this view
 * intentionally has no create/edit controls.
 */
function AdminDonations() {
  const { data: donations, loading, error } = useAdminData(listDonations);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return donations || [];
    return (donations || []).filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.reference?.toLowerCase().includes(q)
    );
  }, [donations, query]);

  const total = filtered.reduce((s, d) => s + Number(d.amount || 0), 0);

  const exportCsv = () => {
    const rows = [
      ["Name", "Email", "Amount (NGN)", "Reference", "Status", "Date"],
      ...(donations || []).map((d) => [
        d.name,
        d.email,
        d.amount,
        d.reference,
        d.status,
        new Date(d.paid_at || d.created_at).toISOString(),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Every verified donation, newest first. Records are written by payment
          verification — this ledger is read-only.
        </p>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-neutral-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-2xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-5 py-4 text-sm text-error-700 dark:text-error-300">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Search + total */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, or reference"
                className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              <span className="font-display text-lg font-semibold text-neutral-900 dark:text-white">
                ₦{total.toLocaleString()}
              </span>{" "}
              across {filtered.length} {filtered.length === 1 ? "donation" : "donations"}
            </p>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-left text-xs uppercase tracking-wider text-neutral-400">
                  <th className="px-5 py-3 font-semibold">Donor</th>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filtered.map((d) => (
                  <tr key={d.id} className="bg-white dark:bg-neutral-950">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{d.name}</div>
                      <div className="text-xs text-neutral-400">{d.email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{d.reference}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-success-50 dark:bg-success-900/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-success-700 dark:text-success-300">
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">
                      {new Date(d.paid_at || d.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-neutral-900 dark:text-white">
                      ₦{Number(d.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-neutral-400">
                      {query ? "No donations match your search." : "No donations recorded yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDonations;
