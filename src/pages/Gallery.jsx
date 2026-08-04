import React, { useRef, useState } from "react";
import { FiUpload, FiSearch } from "react-icons/fi";
import { useGallery } from "../hooks/useGallery";
import { useAuth } from "../context";
import GalleryGrid from "../components/gallery/GalleryGrid";
import Button from "../components/common/Button";
import Notification from "../components/common/Notification";

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
    <div>
      <header className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400">
          See the impact
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
          Gallery
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Photos and videos from our programs, events, and the communities we support.
        </p>
      </header>

      {notice && (
        <div className="max-w-3xl mx-auto mb-6">
          <Notification {...notice} onClose={() => setNotice(null)} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6 max-w-6xl mx-auto">
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={handleFilterChange}
            className="rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="all">All media</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
          </select>
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gallery..."
              className="rounded-l-xl border border-r-0 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button
              type="submit"
              className="rounded-r-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-neutral-500 hover:text-brand-600"
              aria-label="Search"
            >
              <FiSearch />
            </button>
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
        <div className="max-w-6xl mx-auto mb-4 text-error-600 dark:text-error-400 text-center text-sm">
          {typeof error === "string" ? error : error.message || "Failed to load gallery."}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
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
