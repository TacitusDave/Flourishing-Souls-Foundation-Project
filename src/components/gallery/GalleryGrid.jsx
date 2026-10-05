import React from "react";
import PropTypes from "prop-types";
import GalleryItem from "./GalleryItem";

/**
 * GalleryGrid - purely presentational. Data (items/loading/error) and
 * mutations (delete) all come from the single useGallery() hook instance
 * owned by the Gallery page - this component does not fetch anything itself.
 */
const GalleryGrid = ({ items, loading, canManage = false, onDelete, deletingId }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-testid="gallery-grid-loading">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800"
          >
            <div className="aspect-square bg-neutral-100 dark:bg-neutral-800" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-2.5 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
          <svg className="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0120.25 3H3.75A1.5 1.5 0 012.25 4.5v15A1.5 1.5 0 003.75 21z" />
          </svg>
        </div>
        <p className="mt-4 font-display text-lg text-neutral-900 dark:text-white">No media found</p>
        <p className="mt-1 text-sm text-neutral-400">Check back soon — new moments are added as programs grow.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-testid="gallery-grid">
      {items.map((item) => (
        <GalleryItem
          key={item.id}
          item={item}
          canManage={canManage}
          onDelete={onDelete}
          deleting={deletingId === item.id}
        />
      ))}
    </div>
  );
};

GalleryGrid.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  canManage: PropTypes.bool,
  onDelete: PropTypes.func,
  deletingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default GalleryGrid;
