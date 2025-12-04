"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { generateBlankCanvasTheme } from "@/lib/portfolioThemes";

type Theme = "light" | "dark";

interface BlankCanvasThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const BlankCanvasThemeContext = createContext<BlankCanvasThemeContextType | undefined>(undefined);

export function BlankCanvasThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("blank-canvas-theme") as Theme;
            return savedTheme || "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Manage global class for Tailwind dark mode (optional, but good for some utility classes)
        root.classList.remove("light", "dark");
        root.classList.add(theme);

        // Apply scoped CSS variables
        const themeVars = generateBlankCanvasTheme(theme);
        Object.entries(themeVars).forEach(([key, value]) => {
            root.style.setProperty(key, value as string);
        });

        localStorage.setItem("blank-canvas-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <BlankCanvasThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </BlankCanvasThemeContext.Provider>
    );
}

export function useBlankCanvasTheme() {
    const context = useContext(BlankCanvasThemeContext);
    if (context === undefined) {
        throw new Error("useBlankCanvasTheme must be used within a BlankCanvasThemeProvider");
    }
    return context;
}
