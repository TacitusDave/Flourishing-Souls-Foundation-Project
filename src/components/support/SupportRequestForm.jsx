import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../lib/supabase";

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
        "max-w-lg w-full mx-auto px-4 py-6 rounded-2xl shadow-warm-sm bg-white dark:bg-neutral-900 " +
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
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <h2 className="text-2xl font-bold mb-4 text-brand-700 dark:text-brand-300 text-center">
            Contact Support
          </h2>
          <div className="mb-3">
            <label htmlFor="support-name" className="block font-medium mb-1">
              Name <span className="text-error-600">*</span>
            </label>
            <input
              id="support-name"
              name="name"
              type="text"
              className={
                "w-full px-3 py-2 border rounded-xl bg-white dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-brand-500 transition " +
                (errors.name ? "border-error-400" : "border-neutral-300")
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
          <div className="mb-3">
            <label htmlFor="support-email" className="block font-medium mb-1">
              Email <span className="text-error-600">*</span>
            </label>
            <input
              id="support-email"
              name="email"
              type="email"
              className={
                "w-full px-3 py-2 border rounded-xl bg-white dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-brand-500 transition " +
                (errors.email ? "border-error-400" : "border-neutral-300")
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
          <div className="mb-3">
            <label htmlFor="support-subject" className="block font-medium mb-1">
              Subject <span className="text-error-600">*</span>
            </label>
            <input
              id="support-subject"
              name="subject"
              type="text"
              className={
                "w-full px-3 py-2 border rounded-xl bg-white dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-brand-500 transition " +
                (errors.subject ? "border-error-400" : "border-neutral-300")
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
          <div className="mb-4">
            <label htmlFor="support-message" className="block font-medium mb-1">
              Message <span className="text-error-600">*</span>
            </label>
            <textarea
              id="support-message"
              name="message"
              rows={5}
              className={
                "w-full px-3 py-2 border rounded-xl bg-white dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-brand-500 transition resize-vertical " +
                (errors.message ? "border-error-400" : "border-neutral-300")
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
            <div className="mb-3 text-error-600 bg-error-50 border border-error-300 rounded p-2 text-xs">
              {submissionError}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 rounded bg-brand-600 hover:bg-brand-700 text-white font-semibold transition focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
          >
            {submitting ? (
              <span>
                <span className="inline-block animate-spin mr-2">&#9696;</span>
                Submitting...
              </span>
            ) : (
              "Submit Request"
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


