/**
 * Single source of truth for page metadata. Consumed by two readers:
 *  - src/components/common/SEO.jsx (runtime <head> tags via react-helmet)
 *  - scripts/generate-route-meta.mjs (build step that bakes per-route meta
 *    into static HTML so share crawlers — which don't run JavaScript —
 *    still unfurl correct preview cards for deep links)
 * Adding a public route means adding it here.
 */
export const SITE_NAME = "Flourishing Souls Foundation";
export const SITE_TAGLINE = "Empowering Lives, Nurturing Hope";
export const ORIGIN = "https://flourishingsoulsfoundation.org";
export const DEFAULT_IMAGE = "/images/og-image.png";
export const IMAGE_ALT =
  "Flourishing Souls Foundation logo — a circle of joined hands in purple and gold";
export const DEFAULT_DESCRIPTION =
  "We support orphaned and vulnerable children through education, healthcare, and community upliftment — with full transparency into every donation.";

/**
 * Per-route metadata. `title` is suffixed with the site name at render
 * time; `description` is the page-specific share/search snippet.
 * Routes absent from this map (staff areas) get noindex static pages.
 */
export const PAGE_META = {
  "/": {
    title: null, // home uses the default "<Site> — <Tagline>" title
    description: DEFAULT_DESCRIPTION,
  },
  "/donate": {
    title: "Donate",
    description:
      "Give securely through Paystack. Every donation funds orphan care, education, healthcare, and community programs — fully transparent, instantly receipted.",
  },
  "/volunteer": {
    title: "Volunteer",
    description:
      "Volunteer with Flourishing Souls Foundation — lend your hours and skills to uplift communities through education, health, and social support.",
  },
  "/support": {
    title: "Support",
    description:
      "Contact Flourishing Souls Foundation — support requests, feedback, and partnership inquiries. We respond within 24–48 hours.",
  },
  "/events": {
    title: "Events",
    description:
      "Upcoming events from Flourishing Souls Foundation — outreach days, community programs, and ways to get involved.",
  },
  "/gallery": {
    title: "Gallery",
    description:
      "Photos and videos from Flourishing Souls Foundation programs, events, and the communities we support.",
  },
  "/board": {
    title: "Board Members",
    description:
      "Meet the dedicated board members who guide Flourishing Souls Foundation's mission to support orphaned and vulnerable children through education, healthcare, and community upliftment.",
  },
};
