import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../lib/supabase";
import { trackEvent } from "../../lib/monitoring";

/**
 * Helper: Validate volunteer form fields
 */
function validateVolunteerFields({ name, email, phone, availability, skills, motivation }) {
  const errors = {};
  if (!name?.trim()) errors.name = "Full Name is required.";
  if (!email?.trim()) errors.email = "Email is required.";
  else if (
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim())
  )
    errors.email = "Provide a valid email address.";
  if (!phone?.trim()) errors.phone = "Phone number is required.";
  else if (!/^\+?\d{7,}$/.test(phone.trim()))
    errors.phone = "Provide a valid phone number.";
  if (!availability?.trim()) errors.availability = "Availability is required.";
  if (!skills?.trim()) errors.skills = "Please list at least one skill.";
  if (!motivation?.trim()) errors.motivation = "Tell us why you want to volunteer.";
  return errors;
}

/**
 * VolunteerForm Component
 * Handles volunteer application submissions with real-time data to backend (Supabase)
 */
const VolunteerForm = ({
  onSuccess,
  onError,
  className = "",
  style = {},
  hideAfterSubmit = true,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    availability: "",
    skills: "",
    motivation: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [volunteerId, setVolunteerId] = useState(null);

  const supabaseClient = supabase;
  const formRef = useRef();

  // Handle field change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmissionError("");
    const newErrors = validateVolunteerFields(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      // Insert into the `volunteers` table in Supabase
      // Table fields: name, email, phone, availability, skills, motivation, status
      const { data, error } = await supabaseClient
        .from("volunteers")
        .insert([
          {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            availability: form.availability.trim(),
            skills: form.skills.trim(),
            motivation: form.motivation.trim(),
            status: "pending",
          },
        ])
        .select();

      if (error) {
        setSubmissionError(
          error.message ||
            "Submission failed. Please try again or contact us."
        );
        if (onError) onError(error);
      } else {
        setSubmitted(true);
        setVolunteerId(data?.[0]?.id || null);
        trackEvent("volunteer_submit");
        if (onSuccess) onSuccess(data?.[0]);
        if (hideAfterSubmit) setTimeout(() => setSubmitted(false), 7000);
        setForm({
          name: "",
          email: "",
          phone: "",
          availability: "",
          skills: "",
          motivation: "",
        });
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
      {submitted && !submissionError ? (
        <div className="rounded-2xl border border-success-200 dark:border-success-900 bg-success-50 dark:bg-success-950/40 p-6 text-center">
          <div className="font-display text-lg font-semibold text-success-700 dark:text-success-300">
            Thank you for applying to volunteer!
          </div>
          <div className="mt-2 text-sm text-success-800 dark:text-success-200/80">
            We have received your application{volunteerId ? ` (ID: ${volunteerId})` : ""}.<br />
            Our team will review your information and contact you soon.
          </div>
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          aria-label="Volunteer Application Form"
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="volunteer-name"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
            >
              Full name <span className="text-error-600">*</span>
            </label>
            <input
              id="volunteer-name"
              name="name"
              type="text"
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition " +
                (errors.name ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              required
              autoComplete="name"
            />
            {errors.name && (
              <div className="text-xs text-error-600 mt-1">{errors.name}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="volunteer-email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
            >
              Email <span className="text-error-600">*</span>
            </label>
            <input
              id="volunteer-email"
              name="email"
              type="email"
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition " +
                (errors.email ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              required
              autoComplete="email"
            />
            {errors.email && (
              <div className="text-xs text-error-600 mt-1">{errors.email}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="volunteer-phone"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
            >
              Phone number <span className="text-error-600">*</span>
            </label>
            <input
              id="volunteer-phone"
              name="phone"
              type="tel"
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition " +
                (errors.phone ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.phone}
              onChange={handleChange}
              disabled={submitting}
              required
              autoComplete="tel"
              placeholder="+234..."
            />
            {errors.phone && (
              <div className="text-xs text-error-600 mt-1">{errors.phone}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="volunteer-availability"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
            >
              Availability <span className="text-error-600">*</span>
            </label>
            <input
              id="volunteer-availability"
              name="availability"
              type="text"
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition " +
                (errors.availability ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.availability}
              onChange={handleChange}
              disabled={submitting}
              required
              placeholder="e.g., Weekdays, Weekends, 5hrs/week"
            />
            {errors.availability && (
              <div className="text-xs text-error-600 mt-1">{errors.availability}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="volunteer-skills"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
            >
              Skills &amp; experience <span className="text-error-600">*</span>
            </label>
            <textarea
              id="volunteer-skills"
              name="skills"
              rows={3}
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition resize-y " +
                (errors.skills ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.skills}
              onChange={handleChange}
              disabled={submitting}
              required
              placeholder="What skills or experience can you offer?"
            />
            {errors.skills && (
              <div className="text-xs text-error-600 mt-1">{errors.skills}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="volunteer-motivation"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5"
            >
              Why do you want to volunteer? <span className="text-error-600">*</span>
            </label>
            <textarea
              id="volunteer-motivation"
              name="motivation"
              rows={3}
              className={
                "w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition resize-y " +
                (errors.motivation ? "border-error-400" : "border-neutral-200 dark:border-neutral-700")
              }
              value={form.motivation}
              onChange={handleChange}
              disabled={submitting}
              required
              placeholder="Share your motivation for volunteering with us"
            />
            {errors.motivation && (
              <div className="text-xs text-error-600 mt-1">{errors.motivation}</div>
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
              "Submit application"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

VolunteerForm.propTypes = {
  /* Custom Supabase URL if not using global default */
  supabaseUrl: PropTypes.string,
  /* Custom Supabase Key if not using global default */
  supabaseKey: PropTypes.string,
  /* Success callback: receives new volunteer data */
  onSuccess: PropTypes.func,
  /* Error callback: receives error */
  onError: PropTypes.func,
  /* CSS className override */
  className: PropTypes.string,
  /* Optional inline styles */
  style: PropTypes.object,
  /* Hide form after submit (show thank-you only) */
  hideAfterSubmit: PropTypes.bool,
};

export default VolunteerForm;
