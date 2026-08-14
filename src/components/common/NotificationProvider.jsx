/**
 * NotificationProvider.jsx
 * Production-ready React context and provider for global, actionable notifications (toasts/snackbars/banners).
 * Leverages real-time user data, supports queueing, deduplication, auto-dismiss, rich actions, and system accessibility.
 * Wrap your application in this provider at the highest level (App.jsx/main.jsx).
 */

import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { NotificationContext, NotificationTypes } from "./notificationContext";

// Notification types and severity
const DEFAULT_DURATION = 5000; // default 5s
const MAX_STACK = 5;

// Notification shape
let notificationId = 0;
function createNotification({
  type = NotificationTypes.INFO,
  message,
  description,
  actions,
  duration = DEFAULT_DURATION,
  key,
}) {
  return {
    id: key || ++notificationId,
    type,
    message,
    description,
    actions,
    duration,
    ts: Date.now(),
  };
}

// Provider
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({}); // notification.id: timeout

  // Add notification to stack with deduplication+max stack
  const notify = useCallback(
    ({
      type = NotificationTypes.INFO,
      message,
      description,
      actions,
      duration,
      key,
    }) => {
      setNotifications((prev) => {
        // deduplication on 'key', else allow duplicate messages
        if (key && prev.some((n) => n.id === key)) return prev;
        let next = [
          ...prev,
          createNotification({
            type,
            message,
            description,
            actions,
            duration,
            key,
          }),
        ];
        // Trim stack to most recent N
        if (next.length > MAX_STACK) next = next.slice(next.length - MAX_STACK);
        return next;
      });
    },
    []
  );

  // Close notification by id or key
  const close = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // Clear timer
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  // Close all notifications
  const closeAll = useCallback(() => {
    setNotifications([]);
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};
  }, []);

  // Auto-dismiss timer for new notifications
  useEffect(() => {
    notifications.forEach((n) => {
      if (!timersRef.current[n.id] && n.duration !== null) {
        timersRef.current[n.id] = setTimeout(() => {
          close(n.id);
        }, n.duration || DEFAULT_DURATION);
      }
    });
    // Cleanup for removed notifications
    Object.keys(timersRef.current).forEach((id) => {
      if (!notifications.some((n) => String(n.id) === id)) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }
    });
  }, [notifications, close]);

  // Keyboard accessibility: close most recent on Esc
  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape" && notifications.length) {
        close(notifications[notifications.length - 1].id);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [notifications, close]);

  // Render notification stack (portal container if in prod env)
  return (
    <NotificationContext.Provider
      value={{ notify, close, closeAll, notifications }}
    >
      {children}
      <NotificationStack
        notifications={notifications}
        onClose={close}
      />
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;

// NotificationStack displays all notifications, stacking appropriately.
// Renders at the end of the DOM (fixed position) for global visibility.
function NotificationStack({ notifications, onClose }) {
  // Respect reduced motion for system accessibility
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed z-50 top-4 right-4 w-[90vw] max-w-sm space-y-3 pointer-events-none"
    >
      {notifications.map((n) => (
        <NotificationToast
          key={n.id}
          notification={n}
          onClose={() => onClose(n.id)}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}

// Individual toast notification
function NotificationToast({ notification, onClose, prefersReducedMotion }) {
  const { type, message, description, actions } = notification;

  const typeMap = {
    info: {
      icon: (
        <svg
          className="w-6 h-6 text-brand-600 dark:text-brand-400"
          role="img"
          aria-label="Info"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      bg: "bg-brand-50 dark:bg-brand-900/40",
      text: "text-brand-900 dark:text-brand-100",
    },
    success: {
      icon: (
        <svg
          className="w-6 h-6 text-success-600 dark:text-success-400"
          role="img"
          aria-label="Success"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M16 10l-4.25 4L8 12.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      bg: "bg-success-50 dark:bg-success-900/40",
      text: "text-success-900 dark:text-success-100",
    },
    warning: {
      icon: (
        <svg
          className="w-6 h-6 text-warning-600 dark:text-warning-400"
          role="img"
          aria-label="Warning"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 8v4m0 4h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      bg: "bg-warning-50 dark:bg-warning-900/40",
      text: "text-warning-900 dark:text-warning-100",
    },
    error: {
      icon: (
        <svg
          className="w-6 h-6 text-error-600 dark:text-error-400"
          role="img"
          aria-label="Error"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M15 9l-6 6m0-6l6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      bg: "bg-error-50 dark:bg-error-900/40",
      text: "text-error-900 dark:text-error-100",
    },
  };

  const { icon, bg, text } = typeMap[type] || typeMap.info;

  return (
    <div
      className={`pointer-events-auto flex gap-3 items-start rounded-xl border border-black/5 dark:border-white/10 shadow-warm-md px-4 py-3 min-w-0 max-w-full ${bg} ${text} ${
        prefersReducedMotion ? "" : "transition-all duration-500 ease-in"
      }`}
      role="alert"
      tabIndex={0}
    >
      <span className="shrink-0 flex items-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{message}</div>
        {description && (
          <div className="mt-1 text-sm opacity-85">{description}</div>
        )}
        {Array.isArray(actions) && actions.length > 0 && (
          <div className="mt-2 flex gap-2">
            {actions.map((act, i) => (
              <button
                key={i}
                className="inline-flex items-center px-2 py-1 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                onClick={() => act.onClick && act.onClick()}
                aria-label={act.label}
                type="button"
              >
                {act.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        className="ml-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
        onClick={onClose}
        aria-label="Dismiss notification"
        tabIndex={0}
      >
        <svg viewBox="0 0 20 20" width="16" height="16" className="opacity-60" fill="none">
          <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}