import React, { createContext, useContext, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

export type AppThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  primary: string;
  primaryText: string;
  text: string;
  mutedText: string;
  border: string;
  button: string;
  buttonText: string;
  inputBackground: string;
};

const lightColors: AppThemeColors = {
  background: "#f4f6f8",
  surface: "#ffffff",
  surfaceMuted: "#f8fafb",
  primary: "#2f5f73",
  primaryText: "#ffffff",
  text: "#111827",
  mutedText: "#6b7280",
  border: "#d9e2e8",
  button: "#111827",
  buttonText: "#ffffff",
  inputBackground: "#ffffff",
};

const darkColors: AppThemeColors = {
  background: "#0f1720",
  surface: "#172331",
  surfaceMuted: "#1f2d3a",
  primary: "#6fa4b8",
  primaryText: "#ffffff",
  text: "#f8fafc",
  mutedText: "#b8c4ce",
  border: "#344553",
  button: "#2f5f73",
  buttonText: "#ffffff",
  inputBackground: "#101a24",
};

type ThemeContextValue = {
  mode: ThemeMode;
  colors: AppThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  const value = useMemo(
    () => ({
      mode,
      colors: mode === "dark" ? darkColors : lightColors,
      setMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}
