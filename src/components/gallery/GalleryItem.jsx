import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import Modal from "../common/Modal";
import VideoPlayer from "./VideoPlayer";
import PhotoViewer from "./PhotoViewer";

// GalleryItem: displays a single photo or video. Purely presentational -
// all data mutations (delete) are handled by the parent via callbacks,
// backed by the single useGallery() hook instance the page owns.
const GalleryItem = ({ item, canManage = false, onDelete, deleting = false }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleConfirmDelete = async () => {
    await onDelete?.(item);
    setShowDeleteModal(false);
  };

  return (
    <div className="gallery-item relative group rounded-2xl overflow-hidden shadow-warm-sm bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
      <div
        className="aspect-square cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
        onClick={() => setPreviewOpen(true)}
        tabIndex={0}
        role="button"
        aria-label={item.type === "video" ? item.title || "Play video" : item.title || "View photo"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setPreviewOpen(true);
        }}
      >
        {item.type === "video" ? (
          <div className="relative h-full w-full bg-neutral-950 flex items-center justify-center">
            <VideoPlayer src={item.url} title={item.title} controls={false} className="object-cover h-full w-full" />
            <span className="absolute bottom-2 right-2 bg-black/70 text-white rounded-lg px-2 py-1 text-xs">
              Video
            </span>
          </div>
        ) : (
          <img
            src={item.url}
            alt={item.title || "Gallery photo"}
            className="object-cover w-full h-full transition-opacity duration-200 group-hover:opacity-90"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-3 pt-3 pb-2 min-h-[56px]">
        {item.title && (
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 break-words">
            {item.title}
          </p>
        )}
        {item.created_at && (
          <span className="text-xs text-neutral-400">
            {new Date(item.created_at).toLocaleDateString([], {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
        {canManage && (
          <div className="flex gap-2 mt-2">
            <Button
              size="xs"
              variant="outline-danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} size={item.type === "photo" ? "md" : "xl"}>
        {previewOpen &&
          (item.type === "photo" ? (
            <PhotoViewer src={item.url} alt={item.title || ""} caption={item.title} />
          ) : (
            <VideoPlayer src={item.url} title={item.title} autoPlay controls />
          ))}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6 text-center">
          <h4 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
            Delete {item.type === "photo" ? "Photo" : "Video"}?
          </h4>
          <p className="mb-4 text-neutral-600 dark:text-neutral-300">
            Are you sure you want to delete{" "}
            <span className="font-bold">{item.title || (item.type === "photo" ? "this photo" : "this video")}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-center mt-2">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} loading={deleting} disabled={deleting}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

GalleryItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(["photo", "video"]).isRequired,
    created_at: PropTypes.string,
  }).isRequired,
  canManage: PropTypes.bool,
  onDelete: PropTypes.func,
  deleting: PropTypes.bool,
};

export default GalleryItem;
