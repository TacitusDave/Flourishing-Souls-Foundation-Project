import React from "react";
import PropTypes from "prop-types";

/**
 * Receipt - Display a finalized, real donation receipt.
 * Shows user-facing transaction details for accountability, download, or printing.
 */
const Receipt = ({
  receipt,
  onClose,
  show = true,
  organization = "Flourishing Souls Foundation",
}) => {
  if (!show || !receipt) return null;

  // Fallback safely if some fields are missing
  const {
    id,
    amount,
    name,
    email,
    phone,
    reference,
    status,
    created_at,
    organization: receiptOrg,
    // Any extra custom metadata (e.g. anonymous, etc.)
  } = receipt;

  // Convert UNIX or ISO date (backend-agnostic)
  const getReadableDate = (dt) => {
    if (!dt) return "";
    try {
      const dateObj = typeof dt === "string" ? new Date(dt) : new Date(Number(dt));
      return dateObj.toLocaleString("en-NG", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return String(dt);
    }
  };

  // Print handler
  const handlePrint = () => {
    // Open printable window with just the receipt
    const printWindow = window.open("", "PRINT", "height=600,width=450");
    if (printWindow) {
      printWindow.document.write(
        `
        <html>
          <head>
            <title>Donation Receipt</title>
            <style>
              body { font-family: Arial,sans-serif; padding:2em;background:#FFF;}
              .receipt {max-width:400px;margin:auto;}
              .header {display:flex;align-items:center;gap:1em;}
              .logo {height:40px;margin-right:12px;}
              .thank-you {color:#7c3aed;font-weight:bold;}
              table {width:100%;margin-top:1em;margin-bottom:1em;}
              td {padding: 0.3em 0;}
              .info {color:#555;font-size:0.96em;}
              .amount {font-size:1.25em;color:#16a34a;font-weight:600;}
              .ref {font-size:0.95em;color:#7c3aed;}
              .footer {text-align:center;color:#575757;font-size:0.92em;}
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <img src="/images/logo.svg" alt="logo" class="logo" />
                <div>
                  <div style="font-size:1.09em;font-weight:600">${organization || receiptOrg || ""}</div>
                  <div style="font-size:0.92em;color:#94a3b8">Official Donation Receipt</div>
                </div>
              </div>
              <hr style="margin:1em 0;" />
              <div style="margin-bottom:1em;">
                <div class="thank-you">Thank you for your generosity!</div>
                <div class="info">We gratefully confirm your donation as detailed below.</div>
              </div>
              <table>
                <tbody>
                  <tr><td>Donor Name</td><td><strong>${name || "Anonymous Donor"}</strong></td></tr>
                  <tr><td>Email</td><td>${email || "-"}</td></tr>
                  <tr><td>Phone</td><td>${phone || "-"}</td></tr>
                  <tr><td>Date</td><td>${getReadableDate(created_at)}</td></tr>
                  <tr><td>Status</td><td>${status || "Success"}</td></tr>
                  <tr><td>Donation Amount</td><td class="amount">₦${Number(amount).toLocaleString()}</td></tr>
                  <tr><td>Reference ID</td><td class="ref">${reference}</td></tr>
                  ${id ? `<tr><td>Receipt ID</td><td>${id}</td></tr>` : ""}
                </tbody>
              </table>
              <div class="footer">
                A receipt has been generated for your records. <br/>
                For all queries, visit our website or contact support.<br/><br/>
                <span style="color:#0d9488">
                  ${organization || receiptOrg || ""}
                </span>
              </div>
            </div>
            <script>
              setTimeout(() => { window.print(); setTimeout(()=>window.close(), 750) }, 80);
            </script>
          </body>
        </html>
        `
      );
      printWindow.document.close();
      printWindow.focus();
    }
  };

  // Optionally export as PDF: leave for future enhancement with html2pdf.js/print-to-pdf
  // For now, the Print dialog supports "Save as PDF" in modern browsers.

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 shadow-warm-md rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 relative">
      {/* Ribbon or badge */}
      <div className="absolute top-0 right-0 bg-success-500 text-white text-[11px] px-3 py-1 rounded-tr-2xl rounded-bl-lg font-bold shadow">
        Official Receipt
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src="/images/logo.svg"
          alt="Flourishing Souls Foundation Logo"
          className="h-10 w-10 object-contain rounded"
          loading="lazy"
        />
        <div>
          <h3 className="font-display font-semibold text-lg leading-tight text-brand-600 dark:text-brand-400">
            {organization || receiptOrg || "Donation"}
          </h3>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Donation Receipt
          </div>
        </div>
      </div>

      <hr className="my-2 border-neutral-200 dark:border-neutral-700" />

      <div className="mb-2">
        <div className="text-brand-600 dark:text-brand-400 font-bold text-base mb-1">
          Thank you for your donation!
        </div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          Below is a summary of your transaction:
        </span>
      </div>

      <table className="w-full text-sm mb-3">
        <tbody>
          <tr>
            <td className="py-1 text-neutral-500 dark:text-neutral-400">Name</td>
            <td className="py-1 text-right font-medium text-neutral-900 dark:text-neutral-100">
              {name || <em>Anonymous Donor</em>}
            </td>
          </tr>
          <tr>
            <td className="py-1 text-neutral-500 dark:text-neutral-400">Email</td>
            <td className="py-1 text-right text-neutral-900 dark:text-neutral-100">{email || <span>-</span>}</td>
          </tr>
          <tr>
            <td className="py-1 text-neutral-500 dark:text-neutral-400">Phone</td>
            <td className="py-1 text-right text-neutral-900 dark:text-neutral-100">{phone || <span>-</span>}</td>
          </tr>
          <tr>
            <td className="py-1 text-neutral-500 dark:text-neutral-400">Date</td>
            <td className="py-1 text-right text-neutral-900 dark:text-neutral-100">
              {getReadableDate(created_at)}
            </td>
          </tr>
          <tr>
            <td className="py-1 text-neutral-500 dark:text-neutral-400">Status</td>
            <td className="py-1 text-right">
              <span
                className={
                  status === "success" || status === "Success"
                    ? "text-success-600 dark:text-success-400 font-semibold"
                    : "text-error-600 dark:text-error-400"
                }
              >
                {status || "Success"}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-1 text-neutral-500 dark:text-neutral-400">Amount</td>
            <td className="py-1 text-right text-lg text-success-700 dark:text-success-400 font-bold">
              ₦{Number(amount).toLocaleString()}
            </td>
          </tr>
          <tr>
            <td className="py-1 text-neutral-500 dark:text-neutral-400">Reference</td>
            <td className="py-1 text-right text-brand-500 dark:text-brand-400 break-all font-mono">
              {reference}
            </td>
          </tr>
          {id && (
            <tr>
              <td className="py-1 text-neutral-500 dark:text-neutral-400">Receipt ID</td>
              <td className="py-1 text-right text-xs text-neutral-500 dark:text-neutral-400">
                {id}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="my-4 text-xs text-neutral-500 text-center">
        <span>
          This is an official acknowledgment of your donation. Please keep this receipt for your records.
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full md:w-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow transition focus:ring-2 focus:ring-brand-400"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          className="w-full md:w-auto px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-100 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div className="mt-5 text-center text-xs text-neutral-400">
        &copy; {new Date().getFullYear()} {organization || receiptOrg || "Flourishing Souls Foundation"}. All rights reserved.
      </div>
    </div>
  );
};

Receipt.propTypes = {
  /**
   * The receipt object: must contain main fields used above.
   * Expected: { id, amount, name, email, phone, reference, status, created_at, organization }
   */
  receipt: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    reference: PropTypes.string.isRequired,
    status: PropTypes.string,
    created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    organization: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  organization: PropTypes.string,
};

export default Receipt;

