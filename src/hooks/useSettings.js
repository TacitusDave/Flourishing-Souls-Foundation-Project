import { useState, useEffect } from "react";
import { getSettings } from "../lib/adminStore";

/**
 * useSettings — reads the org settings (contact details, donation
 * presets, impact tiers) from adminStore, which targets Supabase when
 * reachable and the local store otherwise.
 *
 * Consumers should treat the result as possibly-null (still loading or
 * unavailable) and fall back to the exported defaults below, so the
 * site renders identically even before any settings exist.
 */

export const DEFAULT_PRESETS = [1000, 2500, 5000, 10000];

export const DEFAULT_TIERS = [
  {
    amount: 5000,
    tag: "School supplies",
    text: "Books, uniform, and materials for one child for a full term.",
  },
  {
    amount: 25000,
    tag: "Medical outreach",
    text: "Sponsors a community health screening day for a dozen families.",
  },
  {
    amount: 100000,
    tag: "A year of care",
    text: "Funds shelter, meals, and schooling for one child for a year.",
  },
];

/** Format a numeric naira amount the way the site displays it. */
export const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

/** Sanitise whatever the settings store holds into usable presets/tiers. */
export function resolveDonationSettings(settings) {
  const presets =
    Array.isArray(settings?.donation_presets) && settings.donation_presets.length
      ? settings.donation_presets.map(Number).filter((n) => n > 0)
      : DEFAULT_PRESETS;

  const tiers =
    Array.isArray(settings?.donation_tiers) && settings.donation_tiers.length
      ? settings.donation_tiers
          .map((t) => ({
            amount: Number(t?.amount) || 0,
            tag: t?.tag || "",
            text: t?.text || "",
          }))
          .filter((t) => t.amount > 0)
      : DEFAULT_TIERS;

  return {
    presets: presets.length ? presets : DEFAULT_PRESETS,
    tiers: tiers.length ? tiers : DEFAULT_TIERS,
  };
}

export default function useSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    getSettings()
      .then((s) => mounted && setSettings(s))
      .catch(() => {
        /* keep defaults — the site must render regardless */
      });
    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}
