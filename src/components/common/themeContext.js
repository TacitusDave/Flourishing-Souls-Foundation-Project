import { createContext } from "react";

export const ThemeContext = createContext({
  theme: "system", // user-set: 'light'|'dark'|'system'
  resolvedTheme: "light", // resolved: 'light'|'dark'
  setTheme: () => {},
  loading: true,
});
