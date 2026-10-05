import React, { useRef, useState } from "react";
import { FiUpload, FiSearch } from "react-icons/fi";
import { useGallery } from "../hooks/useGallery";
import { useAuth } from "../context";
import GalleryGrid from "../components/gallery/GalleryGrid";
import Button from "../components/common/Button";
import Notification from "../components/common/Notification";
import SEO from "../components/common/SEO";

const Gallery = () => {
  const { items, loading, error, fetchGallery, searchGallery, uploadFile, deleteItem } = useGallery();
  const { isAdmin } = useAuth();

  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);
  const fileInputRef = useRef(null);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setTypeFilter(value);
    fetchGallery(value === "all" ? {} : { type: value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) searchGallery(search.trim());
    else fetchGallery();
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const type = file.type.startsWith("video") ? "video" : "photo";
    const result = await uploadFile(file, type, { title: file.name.replace(/\.[^.]+$/, "") });
    setUploading(false);
    setNotice(
      result.success
        ? { id: "upload-success", type: "success", message: "Media uploaded successfully." }
        : { id: "upload-error", type: "error", message: result.error?.message || "Upload failed." }
    );
  };

  const handleDelete = async (item) => {
    setDeletingId(item.id);
    const result = await deleteItem(item.id);
    setDeletingId(null);
    if (!result.success) {
      setNotice({ id: "delete-error", type: "error", message: result.error?.message || "Delete failed." });
    }
  };

  return (
    <div className="pb-16">
      <SEO
        path="/gallery"
        title="Gallery"
        description="Photos and videos from Flourishing Souls Foundation programs, events, and the communities we support."
      />
      <header className="reveal mx-auto max-w-3xl text-center mb-10">
        <p className="eyebrow eyebrow--center">See the impact</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-neutral-900 dark:text-white">
          Gallery
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
          Photos and videos from our programs, events, and the communities we support.
        </p>
      </header>

      {notice && (
        <div className="mx-auto mb-6 max-w-6xl">
          <Notification {...notice} onClose={() => setNotice(null)} />
        </div>
      )}

      {/* Toolbar: filter + search + admin upload */}
      <div className="mx-auto mb-8 flex max-w-6xl flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {/* Segmented media-type filter */}
          <div className="inline-flex rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-1 shadow-warm-sm">
            {[
              { value: "all", label: "All" },
              { value: "photo", label: "Photos" },
              { value: "video", label: "Videos" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  // Reuse the same data path as the old select control.
                  handleFilterChange({ target: { value: opt.value } });
                }}
                aria-pressed={typeFilter === opt.value}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  typeFilter === opt.value
                    ? "bg-brand-600 text-white shadow-warm-sm"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64 sm:flex-none">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gallery…"
              className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pl-10 pr-4 text-sm shadow-warm-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
            />
          </form>
        </div>

        {isAdmin && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="primary" onClick={handleUploadClick} loading={uploading} leftIcon={<FiUpload />}>
              Upload media
            </Button>
          </>
        )}
      </div>

      {error && (
        <div className="mx-auto mb-4 max-w-6xl rounded-2xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 p-5 text-center text-sm text-error-700 dark:text-error-300">
          {typeof error === "string" ? error : error.message || "Failed to load gallery."}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <GalleryGrid
          items={items}
          loading={loading}
          canManage={isAdmin}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </div>
    </div>
  );
};

export default Gallery;
