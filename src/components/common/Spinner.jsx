import React from "react";
import PropTypes from "prop-types";

const SIZE_CLASSES = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export default function Spinner({ className = "", label = "Loading", size = "md", hideLabel = false }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`animate-spin rounded-full border-neutral-300 border-t-brand-600 dark:border-neutral-700 dark:border-t-brand-400 ${
          SIZE_CLASSES[size] || SIZE_CLASSES.md
        }`}
        aria-hidden="true"
      />
      {!hideLabel && <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>}
    </div>
  );
}

Spinner.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  hideLabel: PropTypes.bool,
};
