"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function BlankCanvasThemeProvider({
    children,
    currentPortTheme,
}: {
    children: React.ReactNode;
    currentPortTheme?: string;
}) {
    // Initialize theme from prop or local storage, default to light
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("blank-canvas-theme") as "light" | "dark";
            return savedTheme || (currentPortTheme === "dark" ? "dark" : "light");
        }
        return currentPortTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("dark", "light");
        root.classList.add(theme);
        localStorage.setItem("blank-canvas-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useBlankCanvasTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            "useBlankCanvasTheme must be used within a BlankCanvasThemeProvider"
        );
    }
    return context;
}
