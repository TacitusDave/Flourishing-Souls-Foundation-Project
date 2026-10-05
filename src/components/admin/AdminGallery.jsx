import React, { useState } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import useAdminData from "./useAdminData";
import { listGallery, createGalleryItem, deleteGalleryItem } from "../../lib/adminStore";

/**
 * AdminGallery — add and remove gallery items (photos). URL-based in
 * demo mode; when Supabase is live the Storage upload path can slot in
 * behind the same createGalleryItem call.
 */
function AdminGallery() {
  const { data: items, loading, error, reload } = useAdminData(listGallery);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.url.trim()) {
      setFormError("An image URL is required.");
      return;
    }
    setSaving(true);
    try {
      await createGalleryItem({
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        type: "photo",
        url: form.url.trim(),
      });
      setForm({ title: "", url: "", description: "" });
      setAdding(false);
      reload();
    } catch (err) {
      setFormError(err?.message || "Could not add the image.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.title || "this image"}" from the gallery?`)) return;
    await deleteGalleryItem(item.id);
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Gallery items appear on the public Gallery page.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-warm-sm transition hover:bg-brand-700"
        >
          <FiPlus /> Add image
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(items || []).map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.url}
                alt={item.title || "Gallery image"}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => handleDelete(item)}
                aria-label={`Delete ${item.title || "image"}`}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-error-600 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-error-400"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {item.title || "Untitled"}
              </p>
              {item.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-400">{item.description}</p>
              )}
            </div>
          </div>
        ))}
        {!loading && !error && (items || []).length === 0 && (
          <p className="col-span-full rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 text-sm text-neutral-400">
            The gallery is empty — add the first image.
          </p>
        )}
      </div>

      {/* Add modal */}
      {adding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setAdding(false)}
        >
          <div className="w-full max-w-md rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-warm-lg">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-6 py-4">
              <h2 className="font-display text-xl text-neutral-900 dark:text-white">Add gallery image</h2>
              <button
                type="button"
                onClick={() => setAdding(false)}
                aria-label="Close"
                className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 px-6 py-5">
              <div>
                <label htmlFor="gal-url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Image URL *
                </label>
                <input
                  id="gal-url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="/images/hero/hero-1.jpg or https://…"
                  required
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label htmlFor="gal-title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Title
                </label>
                <input
                  id="gal-title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="block w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label htmlFor="gal-desc" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
                  Description
                </label>
                <textarea
                  id="gal-desc"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
                  onClick={() => setAdding(false)}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-warm-sm transition hover:bg-brand-700 disabled:opacity-60"
                >
                  {saving ? "Adding…" : "Add image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGallery;
