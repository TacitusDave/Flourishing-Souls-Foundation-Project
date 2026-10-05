import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../lib/supabase";
import { trackEvent } from "../../lib/monitoring";

/**
 * SupportRequestForm
 *
 * This is a production-ready component for submitting support/help requests.
 * Handles full client-side validation, form state, and error handling.
 * Actually posts to Supabase backend if environment variables are properly configured.
 *
 * For real user data -- no simulations.
 */

// Helper: Validate form fields
function validateFields({ name, email, subject, message }) {
  const errors = {};
  if (!name?.trim()) errors.name = "Name is required.";
  if (!email?.trim()) errors.email = "Email is required.";
  else if (
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim())
  )
    errors.email = "Provide a valid email address.";
  if (!subject?.trim()) errors.subject = "Subject is required.";
  if (!message?.trim()) errors.message = "Please describe your issue or question.";
  return errors;
}

const SupportRequestForm = ({
  onSuccess,
  onError,
  className = "",
  style = {},
  hideAfterSubmit = true,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [requestId, setRequestId] = useState(null);

  const formRef = useRef();

  // Handle field change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmissionError("");
    const newErrors = validateFields(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      // Insert into the `support_requests` table in Supabase
      // Table expected fields: name, email, subject, message, status
      const { data, error } = await supabase
        .from("support_requests")
        .insert([
          {
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
            status: "pending",
          },
        ])
        .select();
      if (error) {
        setSubmissionError(
          error.message ||
            "Submission failed. Please try again or contact our support team."
        );
        if (onError) onError(error);
      } else {
        setSubmitted(true);
        setRequestId(data?.[0]?.id || null);
        trackEvent("support_submit");
        if (onSuccess) onSuccess(data?.[0]);
        if (hideAfterSubmit) setTimeout(() => setSubmitted(false), 7000);
        setForm({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      }
    } catch (err) {
      setSubmissionError(
        err.message || "Submission failed. Please try again."
      );
      if (onError) onError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={
        "w-full px-0 py-0 " +
        className
      }
      style={style}
    >
      {submitted && (
        <div className="mb-4 bg-success-100 border border-success-300 text-success-800 rounded p-3 text-center transition">
          <div className="font-semibold mb-1">Request submitted successfully!</div>
          <div>
            Thank you for reaching out. Your support request{" "}
            {requestId && (
              <>
                <span className="font-mono text-xs bg-success-200 py-1 px-2 rounded ml-1">
                  #{requestId}
                </span>
              </>
            )}
            {hideAfterSubmit && (
              <span className="block text-xs text-neutral-500 mt-1">
                This notice will disappear automatically.
              </span>
            )}
          </div>
        </div>
      )}
      {!hideAfterSubmit || !submitted ? (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="support-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
              Name <span className="text-error-600">*</span>
            </label>
            <input
              id="support-name"
              name="name"
              type="text"
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition " +
                (errors.name ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="name"
              required
            />
            {errors.name && (
              <div className="text-xs text-error-600 mt-1">{errors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="support-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
              Email <span className="text-error-600">*</span>
            </label>
            <input
              id="support-email"
              name="email"
              type="email"
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition " +
                (errors.email ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="email"
              required
            />
            {errors.email && (
              <div className="text-xs text-error-600 mt-1">{errors.email}</div>
            )}
          </div>
          <div>
            <label htmlFor="support-subject" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
              Subject <span className="text-error-600">*</span>
            </label>
            <input
              id="support-subject"
              name="subject"
              type="text"
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition " +
                (errors.subject ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.subject}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="off"
              required
            />
            {errors.subject && (
              <div className="text-xs text-error-600 mt-1">{errors.subject}</div>
            )}
          </div>
          <div>
            <label htmlFor="support-message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
              Message <span className="text-error-600">*</span>
            </label>
            <textarea
              id="support-message"
              name="message"
              rows={5}
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition resize-y " +
                (errors.message ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.message}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {errors.message && (
              <div className="text-xs text-error-600 mt-1">{errors.message}</div>
            )}
          </div>
          {submissionError && (
            <div className="text-sm text-error-700 dark:text-error-300 bg-error-50 dark:bg-error-950/40 border border-error-200 dark:border-error-900 rounded-xl p-3">
              {submissionError}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-3 transition shadow-warm-md focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Submitting…
              </span>
            ) : (
              "Submit request"
            )}
          </button>
        </form>
      ) : null}
    </div>
  );
};

SupportRequestForm.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  hideAfterSubmit: PropTypes.bool,
};

export default SupportRequestForm;


