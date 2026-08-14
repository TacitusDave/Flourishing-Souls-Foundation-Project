import { createContext, useContext } from "react";

export const NotificationTypes = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

export const NotificationContext = createContext({
  notify: () => {},
  close: () => {},
  closeAll: () => {},
  notifications: [],
});

export function useNotification() {
  return useContext(NotificationContext);
}
