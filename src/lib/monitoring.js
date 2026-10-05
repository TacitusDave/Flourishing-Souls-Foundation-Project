/**
 * monitoring — Sentry error tracking + GA4 analytics.
 *
 * Both integrations activate ONLY when their env var is set, so the site
 * runs identically (and costs nothing) without them:
 *   - VITE_SENTRY_DSN  → Sentry via the official loader script
 *   - VITE_GA4_ID      → Google Analytics 4 via gtag.js
 *
 * Why loader-based instead of npm SDKs: the DSN/ID are injected at
 * runtime from env, and the scripts are async + fail-open — a blocked
 * tracking domain never breaks the site itself.
 */

/* ------------------------------- Sentry ------------------------------- */

let sentryReady = false;

export function initSentry() {
  if (sentryReady || typeof window === "undefined") return;
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  sentryReady = true;
  // Sentry Loader Script (v4): async, fail-open, sets up onload hooks so
  // errors thrown before the SDK lands are still captured.
  window.SENTRY_SDK_SOURCE = "loader";
  const script = document.createElement("script");
  script.src = "https://browser.sentry-cdn.com/10.12.0/bundle.tracing.replay.min.js";
  script.crossOrigin = "anonymous";
  script.async = true;
  script.onload = () => {
    if (window.Sentry) {
      window.Sentry.init({
        dsn,
        environment: import.meta.env.MODE || "development",
        release: import.meta.env.VITE_SITE_VERSION || undefined,
        // Privacy-conscious defaults: never send payloads/localStorage
        sendDefaultPii: false,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0.5,
      });
    }
  };
  document.head.appendChild(script);
}

/** Attach a breadcrumb/tag to the Sentry scope (no-op without Sentry). */
export function captureError(error, context = {}) {
  if (window.Sentry?.captureException) {
    window.Sentry.captureException(error, { extra: context });
  }
}

/* -------------------------------- GA4 --------------------------------- */

let gtagReady = false;

export function initAnalytics() {
  if (gtagReady || typeof window === "undefined") return;
  const gaId = import.meta.env.VITE_GA4_ID;
  if (!gaId) return;

  gtagReady = true;
  // Standard gtag.js bootstrap
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // IP anonymisation + no ad signals: measurement without the extras
  window.gtag("config", gaId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/**
 * Track a named conversion/interaction event. Safe no-op when GA4 is off.
 * Recommended events are called from the app:
 *   donation_success  { amount, reference }
 *   volunteer_submit  {}
 *   support_submit    {}
 *   gallery_view      {}
 */
export function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
