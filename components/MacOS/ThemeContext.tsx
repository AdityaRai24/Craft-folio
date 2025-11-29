"use client";

import { createContext, useContext, useEffect, useState } from "react";
import MacOSThemes from "@/lib/json/MacOS.json";

// Define the structure of a single theme
export interface MacOSThemeColors {
  text: {
    primary: string;
    secondary: string;
  };
  accent: string;
  states: {
    muted: string;
  };
  primary: string;
  gradients: {
    hover: string;
    header: string;
    primary: string;
  };
  secondary: string;
  background: {
    primary: string;
    secondary: string;
  };
  primaryHover: string;
}

export interface MacOSTheme {
  colors: MacOSThemeColors;
}

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  currentTheme: MacOSThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme (Monterey) to fallback to
const defaultTheme: MacOSThemeColors = {
  text: {
    primary: "#F1F5F9",
    secondary: "#94A3B8"
  },
  accent: "#60A5FA",
  states: {
    muted: "rgba(148, 163, 184, 0.5)"
  },
  primary: "#3B82F6",
  gradients: {
    hover: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
    header: "linear-gradient(90deg, rgba(59,130,246,0.1), transparent, rgba(139,92,246,0.1))",
    primary: "linear-gradient(90deg, #3B82F6, #8B5CF6)"
  },
  secondary: "#8B5CF6",
  background: {
    primary: "#0F172A",
    secondary: "rgba(30, 41, 59, 0.6)"
  },
  primaryHover: "#2563EB"
};

export function MacOSThemeProvider({
  children,
  currentPortTheme,
}: {
  children: React.ReactNode;
  currentPortTheme?: string;
}) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("macos-theme") as "light" | "dark";
      return savedTheme || "dark";
    }
    return "dark";
  });

  const [currentTheme, setCurrentTheme] = useState<MacOSThemeColors>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("macos-light", "macos-dark");
    root.classList.add(`macos-${theme}`);
    localStorage.setItem("macos-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (currentPortTheme) {
      // Find the theme in the JSON
      // The JSON structure is { sections: [ ..., { type: "themes", data: { Monterey: { ... }, ... } } ] }
      const themesSection = MacOSThemes.sections.find((s: any) => s.type === "themes");
      if (themesSection && themesSection.data) {
        const themeData = (themesSection.data as any)[currentPortTheme];
        if (themeData && themeData.colors) {
          setCurrentTheme(themeData.colors);
        }
      }
    }
  }, [currentPortTheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useMacOSTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useMacOSTheme must be used within a MacOSThemeProvider"
    );
  }
  return context;
}
