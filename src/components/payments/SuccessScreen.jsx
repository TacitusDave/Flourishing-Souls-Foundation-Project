import React from "react";
import PropTypes from "prop-types";

/**
 * SuccessScreen
 * Celebratory confirmation shown right after a verified donation.
 * For the full printable/downloadable record, see <Receipt /> - this
 * component links out to it via onViewReceipt rather than duplicating
 * the same table twice.
 *
 * Props:
 *   show: (bool) - Whether the modal/screen is visible
 *   onClose: (func) - Handler when dismissed (required)
 *   amount: (number|string) - Amount donated (optional, for confirmation)
 *   receipt: (object) - Receipt information, e.g. { name, reference, email, phone, created_at } (optional)
 *   organization: (string) - Optional override for displayed org name
 *   onViewReceipt: (func) - Opens the full Receipt view
 */
const SuccessScreen = ({
  show = false,
  onClose,
  amount,
  receipt,
  organization,
  onViewReceipt,
  className = "",
}) => {
  const orgName =
    organization || receipt?.organization || "Flourishing Souls Foundation";
  const donorName =
    receipt?.name || (typeof receipt?.email === "string" ? receipt.email.split("@")[0] : "") || "";

  if (!show) return null;

  return (
    <div
      className={`fixed z-50 inset-0 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm transition-all ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-success-title"
      tabIndex={-1}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-warm-lg max-w-md w-full px-8 py-7 text-center relative animate-fade-in">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          onClick={onClose}
          aria-label="Close"
          tabIndex={0}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex justify-center mb-4">
          <span className="inline-block bg-success-50 dark:bg-success-900/40 text-success-600 dark:text-success-400 rounded-full p-4 shadow-warm-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M7 13.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </div>

        <h2
          className="font-display text-2xl font-bold text-brand-700 dark:text-brand-300 mb-2"
          id="donation-success-title"
        >
          Thank You, {donorName ? donorName : "Donor"}!
        </h2>
        <div className="text-neutral-700 dark:text-neutral-200 font-medium text-lg">
          Your donation was successful.
        </div>

        {amount ? (
          <div className="mt-2 text-brand-600 dark:text-brand-300 font-semibold text-xl">
            ₦{Number(amount).toLocaleString()}
          </div>
        ) : null}

        {receipt?.reference && (
          <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">Reference:</span> {receipt.reference}
          </div>
        )}

        <div className="my-4 text-neutral-600 dark:text-neutral-400 text-sm">
          We appreciate your generosity. Your donation will help us continue our mission at{" "}
          <span className="font-semibold">{orgName}</span>.
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-3">
          {onViewReceipt && receipt && (
            <button
              type="button"
              onClick={onViewReceipt}
              className="px-6 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold transition hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:ring-2 focus:ring-brand-500"
            >
              View receipt
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition focus:ring-2 focus:ring-brand-500"
            autoFocus
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

SuccessScreen.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  receipt: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    reference: PropTypes.string,
    created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    organization: PropTypes.string,
  }),
  organization: PropTypes.string,
  onViewReceipt: PropTypes.func,
  className: PropTypes.string,
};

export default SuccessScreen;
