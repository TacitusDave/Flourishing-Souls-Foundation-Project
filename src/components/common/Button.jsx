import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Spinner from "./Spinner";

/**
 * Button component
 * Supports:
 *  - variant: "primary", "secondary", "danger", "outline-danger", "success",
 *             "outline", "ghost", "info", "link"
 *  - size: "xs", "sm", "md", "lg"
 *  - loading: shows loading indicator/spinner, disables button
 *  - fullWidth: stretches button to container width
 *  - leftIcon, rightIcon: for icon placement
 *
 * Usage:
 * <Button variant="primary" size="lg" loading leftIcon={<Icon />} onClick={...}>Label</Button>
 */
const VARIANT_STYLES = {
  primary:
    "bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-500 text-white border-transparent",
  secondary:
    "bg-neutral-100 hover:bg-neutral-200 focus-visible:ring-neutral-400 text-neutral-900 border-transparent dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
  danger:
    "bg-error-600 hover:bg-error-700 focus-visible:ring-error-500 text-white border-transparent",
  "outline-danger":
    "bg-transparent border border-error-300 text-error-600 hover:bg-error-50 focus-visible:ring-error-500 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-900/30",
  success:
    "bg-success-600 hover:bg-success-700 focus-visible:ring-success-500 text-white border-transparent",
  info:
    "bg-brand-50 hover:bg-brand-100 focus-visible:ring-brand-400 text-brand-700 border-transparent dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-900/60",
  outline:
    "bg-transparent border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-brand-500 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-brand-500 dark:text-neutral-200 dark:hover:bg-neutral-800",
  link: "bg-transparent text-brand-600 underline-offset-2 hover:underline p-0 border-0 dark:text-brand-400",
};

const SIZE_STYLES = {
  xs: "px-2 py-1 text-xs rounded-lg",
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
};

const Button = React.forwardRef(
  (
    {
      children,
      as: Component = "button",
      type = "button",
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className,
      onClick,
      "aria-label": ariaLabel,
      tabIndex,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const isNativeButton = Component === "button";

    const btnClass = classNames(
      "inline-flex items-center justify-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-150",
      VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
      SIZE_STYLES[size] || SIZE_STYLES.md,
      {
        "opacity-60 pointer-events-none cursor-not-allowed": isDisabled,
        "w-full": fullWidth,
        shadow: variant !== "link" && variant !== "outline" && variant !== "ghost",
      },
      className
    );

    return (
      <Component
        ref={ref}
        {...(isNativeButton ? { type, disabled: isDisabled } : {})}
        className={btnClass}
        onClick={onClick}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        {...rest}
      >
        {loading && <Spinner size={size === "lg" ? "md" : "sm"} className="mr-2" hideLabel />}
        {leftIcon && !loading && <span className="mr-2 flex items-center">{leftIcon}</span>}
        <span className={loading ? "opacity-70" : undefined}>{children}</span>
        {rightIcon && !loading && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </Component>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node,
  as: PropTypes.elementType,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "outline-danger",
    "success",
    "info",
    "outline",
    "ghost",
    "link",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  "aria-label": PropTypes.string,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Button;
