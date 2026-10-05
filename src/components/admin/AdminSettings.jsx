import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiPlus, FiX } from "react-icons/fi";
import useAdminData from "./useAdminData";
import { getSettings, updateSettings, resetDemoData, getBackendMode } from "../../lib/adminStore";
import { DEFAULT_PRESETS, DEFAULT_TIERS, formatNaira } from "../../hooks/useSettings";

/**
 * AdminSettings — organisation contact details, donation goal, the
 * donation quick-pick amounts, and the impact tiers shown across the
 * site. All of it is content the foundation can change without code.
 */
function AdminSettings() {
  const { data: settings, loading, error, reload } = useAdminData(getSettings);
  const [form, setForm] = useState(null);
  const [presetsText, setPresetsText] = useState("");
  const [tiers, setTiers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (settings) {
      setForm({
        org_name: settings.org_name || "",
        contact_email: settings.contact_email || "",
        contact_phone: settings.contact_phone || "",
        donation_goal: settings.donation_goal ?? "",
      });
      const presets = Array.isArray(settings.donation_presets) && settings.donation_presets.length
        ? settings.donation_presets
        : DEFAULT_PRESETS;
      setPresetsText(presets.join(", "));
      const storedTiers = Array.isArray(settings.donation_tiers) && settings.donation_tiers.length
        ? settings.donation_tiers
        : DEFAULT_TIERS;
      setTiers(storedTiers.map((t) => ({ ...t })));
    }
  }, [settings]);

  const set = (k) => (e) => {
    setSaved(false);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const setTier = (i, key) => (e) => {
    setSaved(false);
    setTiers((list) => list.map((t, j) => (j === i ? { ...t, [key]: e.target.value } : t)));
  };

  const addTier = () => {
    setSaved(false);
    setTiers((list) => [...list, { amount: "", tag: "", text: "" }]);
  };

  const removeTier = (i) => {
    setSaved(false);
    setTiers((list) => list.filter((_, j) => j !== i));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const presets = presetsText
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      if (!presets.length) {
        throw new Error("Enter at least one valid quick-pick amount (e.g. 1000, 2500, 5000).");
      }
      const cleanTiers = tiers
        .map((t) => ({
          amount: Number(t.amount) || 0,
          tag: String(t.tag || "").trim(),
          text: String(t.text || "").trim(),
        }))
        .filter((t) => t.amount > 0);

      await updateSettings({
        org_name: form.org_name.trim(),
        contact_email: form.contact_email.trim(),
        contact_phone: form.contact_phone.trim(),
        donation_goal: form.donation_goal ? Number(form.donation_goal) : null,
        donation_presets: presets,
        donation_tiers: cleanTiers,
      });
      setSaved(true);
      reload();
    } catch (err) {
      setSaveError(err?.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset all demo data? Events, gallery, donations, and messages return to the original sample set. Your own entries will be lost."
      )
    )
      return;
    await resetDemoData();
    reload();
  };

  if (loading || !form) {
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

  const inputCls =
    "block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100";
  const labelCls = "block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5";

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSave} className="space-y-10">
        {/* Organisation */}
        <section className="space-y-4">
          <h2 className="font-display text-xl text-neutral-900 dark:text-white">Organisation</h2>
          <div>
            <label htmlFor="set-org" className={labelCls}>Organisation name</label>
            <input id="set-org" value={form.org_name} onChange={set("org_name")} className={inputCls} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="set-email" className={labelCls}>Contact email</label>
              <input id="set-email" type="email" value={form.contact_email} onChange={set("contact_email")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="set-phone" className={labelCls}>Contact phone</label>
              <input id="set-phone" value={form.contact_phone} onChange={set("contact_phone")} className={inputCls} />
            </div>
          </div>
          <div>
            <label htmlFor="set-goal" className={labelCls}>Annual donation goal (₦)</label>
            <input id="set-goal" type="number" min="0" step="1000" value={form.donation_goal} onChange={set("donation_goal")} className={inputCls} />
            <p className="mt-1 text-xs text-neutral-400">Shown as the fundraising target on the site.</p>
          </div>
        </section>

        {/* Donation quick-pick amounts */}
        <section className="space-y-3">
          <h2 className="font-display text-xl text-neutral-900 dark:text-white">
            Donation quick-pick amounts
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The preset buttons on the donation form. Comma-separated naira
            amounts, in the order they should appear.
          </p>
          <div>
            <label htmlFor="set-presets" className={labelCls}>Amounts (₦)</label>
            <input
              id="set-presets"
              value={presetsText}
              onChange={(e) => {
                setSaved(false);
                setPresetsText(e.target.value);
              }}
              placeholder="1000, 2500, 5000, 10000"
              className={inputCls}
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {presetsText
                .split(",")
                .map((s) => Number(s.trim()))
                .filter((n) => Number.isFinite(n) && n > 0)
                .map((n) => (
                  <span
                    key={n}
                    className="rounded-full bg-brand-50 dark:bg-brand-900/40 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-300"
                  >
                    {formatNaira(n)}
                  </span>
                ))}
            </div>
          </div>
        </section>

        {/* Impact tiers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl text-neutral-900 dark:text-white">
              Impact tiers
            </h2>
            <button
              type="button"
              onClick={addTier}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300"
            >
              <FiPlus className="h-3.5 w-3.5" /> Add tier
            </button>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Shown as the "What your gift does" cards on the homepage and the
            impact ladder on the Donate page.
          </p>
          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-32 shrink-0">
                    <label htmlFor={`tier-amount-${i}`} className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                      Amount (₦)
                    </label>
                    <input
                      id={`tier-amount-${i}`}
                      type="number"
                      min="1"
                      value={tier.amount}
                      onChange={setTier(i, "amount")}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`tier-tag-${i}`} className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                      Label
                    </label>
                    <input
                      id={`tier-tag-${i}`}
                      value={tier.tag}
                      onChange={setTier(i, "tag")}
                      placeholder="e.g. School supplies"
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTier(i)}
                    aria-label={`Remove tier ${i + 1}`}
                    className="mt-6 rounded-full p-2 text-neutral-400 transition hover:bg-error-50 dark:hover:bg-error-950/40 hover:text-error-600"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3">
                  <label htmlFor={`tier-text-${i}`} className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                    Description
                  </label>
                  <textarea
                    id={`tier-text-${i}`}
                    rows={2}
                    value={tier.text}
                    onChange={setTier(i, "text")}
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
            {tiers.length === 0 && (
              <p className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 text-sm text-neutral-400">
                No tiers — the homepage and Donate page will fall back to their default tiers.
              </p>
            )}
          </div>
        </section>

        {saveError && (
          <p className="rounded-xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-4 py-2.5 text-sm text-error-700 dark:text-error-300">
            {saveError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-warm-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-success-600 dark:text-success-400">
              Saved ✓ — changes are live across the site
            </span>
          )}
        </div>
      </form>

      {getBackendMode() !== "live" && (
        <div className="mt-10 rounded-2xl border border-warning-200 dark:border-warning-900 bg-warning-50/60 dark:bg-warning-950/30 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-warning-800 dark:text-warning-200">
            <FiRefreshCw className="h-4 w-4" /> Demo data
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-warning-700 dark:text-warning-300">
            You're in demo mode — everything is stored in this browser. Resetting
            restores the original sample events, gallery, donations, and messages.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 rounded-xl border border-warning-300 dark:border-warning-800 px-4 py-2 text-sm font-semibold text-warning-800 dark:text-warning-200 transition hover:bg-warning-100/60 dark:hover:bg-warning-900/40"
          >
            Reset demo data
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
