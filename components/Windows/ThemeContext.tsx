"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the structure of a single theme (matching MacOS for compatibility)
export interface WindowsThemeColors {
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

interface ThemeContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
    currentTheme: WindowsThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default Windows 11-like theme
const defaultTheme: WindowsThemeColors = {
    text: {
        primary: "#ffffff",
        secondary: "#a0a0a0"
    },
    accent: "#60CDFF",
    states: {
        muted: "rgba(160, 160, 160, 0.5)"
    },
    primary: "#0078D4", // Windows Blue
    gradients: {
        hover: "linear-gradient(90deg, rgba(0,120,212,0.2), rgba(96,205,255,0.2))",
        header: "linear-gradient(90deg, rgba(0,120,212,0.1), transparent, rgba(96,205,255,0.1))",
        primary: "linear-gradient(90deg, #0078D4, #005A9E)"
    },
    secondary: "#005A9E",
    background: {
        primary: "#202020", // Windows Dark
        secondary: "rgba(32, 32, 32, 0.6)"
    },
    primaryHover: "#006CC1"
};

const lightTheme: WindowsThemeColors = {
    text: {
        primary: "#000000",
        secondary: "#5d5d5d"
    },
    accent: "#0078D4",
    states: {
        muted: "rgba(93, 93, 93, 0.5)"
    },
    primary: "#0078D4",
    gradients: {
        hover: "linear-gradient(90deg, rgba(0,120,212,0.1), rgba(0,90,158,0.1))",
        header: "linear-gradient(90deg, rgba(0,120,212,0.05), transparent, rgba(0,90,158,0.05))",
        primary: "linear-gradient(90deg, #0078D4, #005A9E)"
    },
    secondary: "#005A9E",
    background: {
        primary: "#f3f3f3", // Windows Light
        secondary: "rgba(243, 243, 243, 0.8)"
    },
    primaryHover: "#005A9E"
};

import WindowsData from "@/lib/json/Windows.json";

// ... (interfaces remain the same)

export function WindowsThemeProvider({
    children,
    currentPortTheme,
}: {
    children: React.ReactNode;
    currentPortTheme?: string;
}) {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    // Default to Windows 11 from JSON, or fallback to hardcoded if needed (but JSON should exist)
    const [currentTheme, setCurrentTheme] = useState<WindowsThemeColors>(
        (WindowsData as any)["Windows 11"]?.colors || defaultTheme
    );

    useEffect(() => {
        const themeName = currentPortTheme || "Windows 11";
        const themeData = (WindowsData as any)[themeName];

        if (themeData && themeData.colors) {
            setCurrentTheme(themeData.colors);
        } else {
            // Fallback to Windows 11 if requested theme not found
            const defaultThemeData = (WindowsData as any)["Windows 11"];
            if (defaultThemeData && defaultThemeData.colors) {
                setCurrentTheme(defaultThemeData.colors);
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

export function useWindowsTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            "useWindowsTheme must be used within a WindowsThemeProvider"
        );
    }
    return context;
}
