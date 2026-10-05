import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import useAdminData from "./useAdminData";
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../lib/adminStore";

const EMPTY = {
  title: "",
  description: "",
  date: "",
  location: "",
  image_url: "",
  max_attendees: "",
};

/**
 * AdminEvents — create, edit, and delete events. Writes go through
 * adminStore, which targets Supabase when reachable and the local demo
 * store otherwise (identical field names in both modes).
 */
function AdminEvents() {
  const { data: events, loading, error, reload } = useAdminData(listEvents);
  const [editing, setEditing] = useState(null); // null | 'new' | event object
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const openNew = () => {
    setForm(EMPTY);
    setEditing("new");
    setFormError("");
  };
  const openEdit = (event) => {
    setForm({
      title: event.title || "",
      description: event.description || "",
      // datetime-local needs "YYYY-MM-DDTHH:mm"
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      location: event.location || "",
      image_url: event.image_url || "",
      max_attendees: event.max_attendees ?? "",
    });
    setEditing(event);
    setFormError("");
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim() || !form.date) {
      setFormError("Title and date are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: new Date(form.date).toISOString(),
        location: form.location.trim(),
        image_url: form.image_url.trim() || null,
        max_attendees: form.max_attendees ? Number(form.max_attendees) : null,
      };
      if (editing === "new") await createEvent(payload);
      else await updateEvent(editing.id, payload);
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err?.message || "Could not save the event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    setDeletingId(event.id);
    try {
      await deleteEvent(event.id);
      reload();
    } finally {
      setDeletingId(null);
    }
  };

  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Events appear on the public Events page the moment they're saved.
        </p>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-warm-sm transition hover:bg-brand-700"
        >
          <FiPlus /> New event
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-neutral-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-2xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-5 py-4 text-sm text-error-700 dark:text-error-300">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {(events || []).map((event) => {
          const upcoming = new Date(event.date) >= now;
          return (
            <div
              key={event.id}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:flex-row sm:items-center"
            >
              <img
                src={event.image_url || "/images/hero/hero-1.jpg"}
                alt=""
                className="h-24 w-full rounded-xl object-cover sm:h-16 sm:w-24"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base text-neutral-900 dark:text-white">
                    {event.title}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      upcoming
                        ? "bg-success-50 dark:bg-success-900/40 text-success-700 dark:text-success-300"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {upcoming ? "Upcoming" : "Past"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(event.date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {event.location ? ` · ${event.location}` : ""}
                </p>
                {event.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-400">
                    {event.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(event)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300"
                >
                  <FiEdit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(event)}
                  disabled={deletingId === event.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-error-200 dark:border-error-900 px-3.5 py-1.5 text-sm font-medium text-error-600 dark:text-error-400 transition hover:bg-error-50 dark:hover:bg-error-950/40 disabled:opacity-50"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
        {!loading && !error && (events || []).length === 0 && (
          <p className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 text-sm text-neutral-400">
            No events yet — create the first one.
          </p>
        )}
      </div>

      {/* Create / edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div className="w-full max-w-lg rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-warm-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-6 py-4">
              <h2 className="font-display text-xl text-neutral-900 dark:text-white">
                {editing === "new" ? "New event" : "Edit event"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 px-6 py-5">
              <div>
                <label htmlFor="ev-title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Title *
                </label>
                <input
                  id="ev-title"
                  value={form.title}
                  onChange={set("title")}
                  required
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label htmlFor="ev-date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Date & time *
                </label>
                <input
                  id="ev-date"
                  type="datetime-local"
                  value={form.date}
                  onChange={set("date")}
                  required
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label htmlFor="ev-location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Location
                </label>
                <input
                  id="ev-location"
                  value={form.location}
                  onChange={set("location")}
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label htmlFor="ev-image" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Image URL
                </label>
                <input
                  id="ev-image"
                  value={form.image_url}
                  onChange={set("image_url")}
                  placeholder="/images/hero/hero-2.jpg or https://…"
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label htmlFor="ev-max" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Max attendees
                </label>
                <input
                  id="ev-max"
                  type="number"
                  min="1"
                  value={form.max_attendees}
                  onChange={set("max_attendees")}
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label htmlFor="ev-desc" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Description
                </label>
                <textarea
                  id="ev-desc"
                  rows={3}
                  value={form.description}
                  onChange={set("description")}
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {formError && (
                <p className="rounded-xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 px-4 py-2.5 text-sm text-error-700 dark:text-error-300">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-warm-sm transition hover:bg-brand-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : editing === "new" ? "Create event" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
