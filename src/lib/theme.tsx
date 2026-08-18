import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Ctx = { dark: boolean; toggle: () => void };
const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("spdf-theme");
    if (stored) setDark(stored === "dark");
    else setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("spdf-theme", dark ? "dark" : "light");
  }, [dark]);

  const value = useMemo(() => ({ dark, toggle: () => setDark((d) => !d) }), [dark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
