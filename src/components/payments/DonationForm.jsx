import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { PaystackButton } from "./PaystackButton";
import { supabase } from "../../lib/supabase";
import Notification from "../common/Notification";
import Modal from "../common/Modal";
import Receipt from "./Receipt";
import SuccessScreen from "./SuccessScreen";

const DONATION_MIN = 100; // Minimum amount in Naira

const DonationForm = ({
  publicKey,
  organization,
  presetAmounts = [1000, 2500, 5000, 10000],
  onSuccess,
  onError,
}) => {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  // Pure - no state writes. Safe to call during render (e.g. for `disabled`).
  const getValidationErrors = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Your name is required.";
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim())
    ) {
      errs.email = "Please provide a valid email address.";
    }
    if (!amount || Number(amount) < DONATION_MIN) {
      errs.amount = `Minimum donation is ₦${DONATION_MIN}.`;
    }
    if (phone && !/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) {
      errs.phone = "Please provide a valid phone number.";
    }
    return errs;
  };

  const isFormValid = useMemo(
    () => Object.keys(getValidationErrors()).length === 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, email, phone, amount]
  );

  // Show error messages for a field once the user leaves it (blur),
  // rather than mutating state during render.
  const handleBlur = () => setErrors(getValidationErrors());

  const onAmountChange = (val) => {
    setAmount(val);
  };

  const handlePaystackSuccess = async (response) => {
    // The Paystack popup reporting "success" is a client-side claim, not
    // proof - paystack-verify re-checks the reference against Paystack's
    // API server-side and is the only thing allowed to write the donations
    // row (see supabase/schema.sql: no client insert policy on donations).
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-verify", {
        body: { reference: response.reference },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const donation = data.donation;
      setReceiptInfo(donation);
      setSuccessOpen(true);
      setNotification({
        type: "success",
        message: "Donation successful! Thank you for your support.",
      });
      if (onSuccess) onSuccess(donation);
      setAmount("");
      setName("");
      setEmail("");
      setPhone("");
    } catch (e) {
      setNotification({
        type: "error",
        message: e?.message || "We could not process your donation. Please contact support.",
      });
      if (onError) onError(e);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaystackClose = () => {
    setProcessing(false);
    setNotification({
      type: "warning",
      message: "Donation process was not completed.",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotification(null);
    setErrors(getValidationErrors());
  };

  const paystackButtonConfig = {
    email,
    amount: Number(amount) * 100, // Paystack expects in Kobo
    metadata: {
      name,
      phone,
      organization,
    },
    publicKey,
    text: processing ? "Processing..." : "Donate",
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
    className: "w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition active:scale-95 mt-4 disabled:opacity-50",
    disabled: processing || !isFormValid,
  };

  return (
    <div className="max-w-lg w-full mx-auto p-6 sm:p-8 rounded-2xl bg-white shadow-warm-sm dark:bg-neutral-900">
      <h2 className="font-display text-2xl font-bold mb-1 text-center text-brand-700 dark:text-brand-300">
        Support {organization || "Us"} with a Donation
      </h2>
      <p className="mb-4 text-neutral-600 text-center dark:text-neutral-300">
        Your support helps us reach more lives. Every donation counts!
      </p>
      {notification && (
        <Notification
          id="donation-form-notification"
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <SuccessScreen
        show={successOpen}
        onClose={() => setSuccessOpen(false)}
        amount={receiptInfo?.amount}
        receipt={receiptInfo}
        organization={organization}
        onViewReceipt={() => setReceiptOpen(true)}
      />
      <Modal open={receiptOpen} onClose={() => setReceiptOpen(false)} size="sm" showClose={false}>
        {receiptInfo && (
          <Receipt receipt={receiptInfo} organization={organization} onClose={() => setReceiptOpen(false)} />
        )}
      </Modal>
      {!successOpen && (
        <form className="grid gap-4" onSubmit={handleSubmit} autoComplete="off">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="donor-name" className="font-medium mb-1">
              Name <span className="text-error-600">*</span>
            </label>
            <input
              id="donor-name"
              name="name"
              className={`rounded-xl border bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-brand-500 transition outline-none ${
                errors.name ? "border-error-400" : "border-neutral-300"
              }`}
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
              disabled={processing}
              required
            />
            {errors.name && (
              <span className="text-xs mt-1 text-error-600">{errors.name}</span>
            )}
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="donor-email" className="font-medium mb-1">
              Email <span className="text-error-600">*</span>
            </label>
            <input
              id="donor-email"
              name="email"
              type="email"
              value={email}
              autoComplete="email"
              className={`rounded-xl border bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-brand-500 transition outline-none ${
                errors.email ? "border-error-400" : "border-neutral-300"
              }`}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur}
              disabled={processing}
              required
            />
            {errors.email && (
              <span className="text-xs mt-1 text-error-600">{errors.email}</span>
            )}
          </div>
          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="donor-phone" className="font-medium mb-1">
              Phone number
              <span className="text-xs text-neutral-400 ml-1">(optional)</span>
            </label>
            <input
              id="donor-phone"
              name="phone"
              type="tel"
              value={phone}
              autoComplete="tel"
              placeholder="e.g 09012345678"
              className={`rounded-xl border bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-brand-500 transition outline-none ${
                errors.phone ? "border-error-400" : "border-neutral-300"
              }`}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={handleBlur}
              disabled={processing}
            />
            {errors.phone && (
              <span className="text-xs mt-1 text-error-600">{errors.phone}</span>
            )}
          </div>
          {/* Donation amount */}
          <div className="flex flex-col">
            <label htmlFor="donation-amount" className="font-medium mb-1">
              Amount (₦)
              <span className="text-error-600">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              {presetAmounts?.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  className={`rounded px-2.5 py-1 text-sm font-medium border transition focus:ring-2
                    ${
                      Number(amount) === amt
                        ? "bg-brand-600 border-brand-700 text-white"
                        : "bg-white border-neutral-300 dark:bg-neutral-800 text-brand-700 dark:text-white"
                    }`}
                  disabled={processing}
                  onClick={() => {
                    onAmountChange(amt);
                  }}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              id="donation-amount"
              name="amount"
              type="number"
              min={DONATION_MIN}
              step={100}
              value={amount}
              placeholder={`Enter amount (min ₦${DONATION_MIN})`}
              className={`rounded-xl border bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-brand-500 transition outline-none ${
                errors.amount ? "border-error-400" : "border-neutral-300"
              }`}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              onBlur={handleBlur}
              disabled={processing}
              required
              inputMode="numeric"
              autoComplete="off"
            />
            {errors.amount && (
              <span className="text-xs mt-1 text-error-600">{errors.amount}</span>
            )}
          </div>
          {/* PaystackButton - real payment */}
          <PaystackButton {...paystackButtonConfig} />
        </form>
      )}
      <div className="mt-6 text-center text-xs text-neutral-500">
        Payments securely powered by <strong>Paystack</strong>.
      </div>
    </div>
  );
};

DonationForm.propTypes = {
  publicKey: PropTypes.string.isRequired,
  organization: PropTypes.string,
  presetAmounts: PropTypes.arrayOf(PropTypes.number),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default DonationForm;