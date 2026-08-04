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
      <div className="text-center text-neutral-500 dark:text-neutral-400 py-16">
        Loading gallery...
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-neutral-500 dark:text-neutral-400 py-16">
        No media found.
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
