import React from "react";
import { HeroCustomizationState } from "@/types/hero/portfolio";

type BackgroundTheme = HeroCustomizationState["backgroundTheme"];

export interface BackgroundThemeSelectorProps {
    value: BackgroundTheme;
    onChange: (value: BackgroundTheme) => void;
}

export const BackgroundThemeSelector: React.FC<BackgroundThemeSelectorProps> = ({ value, onChange }) => {
    // Helper function to generate the actual background styles for each theme
    const getThemeStyle = (themeValue: BackgroundTheme) => {
        switch (themeValue) {
            case "pearl-mist":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.3), transparent 90%)",
                };
            case "aurora-midnight":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.4), transparent 90%)",
                };
            case "crimson-shadow":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 80, 120, 0.4), transparent 90%)",
                };
            case "ocean-abyss":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.4), transparent 90%)",
                };
            case "noise-pattern":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.4) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.35) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.3) 1px, transparent 0)
          `,
                    backgroundSize: "12px 12px, 18px 18px, 15px 15px",
                    backgroundPosition: "0 0, 6px 6px, 9px 3px",
                };
            case "diagonal-lines":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.2) 0, rgba(0, 255, 65, 0.2) 1px, transparent 1px, transparent 8px),
            repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.2) 0, rgba(0, 255, 65, 0.2) 1px, transparent 1px, transparent 8px),
            repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.1) 0, rgba(0, 255, 65, 0.1) 1px, transparent 1px, transparent 3px)
          `,
                    backgroundSize: "16px 16px, 16px 16px, 6px 6px",
                };
            case "magenta-orb-grid":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
                    backgroundSize: "20px 20px, 20px 20px, 100% 100%",
                };
            case "black-grid-dots":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
                    backgroundSize: "10px 10px, 10px 10px, 10px 10px",
                    backgroundPosition: "0 0, 0 0, 0 0",
                };
            default:
                return {
                    backgroundColor: "#000000",
                    backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.3), transparent 90%)",
                };
        }
    };

    const themes: Array<{
        value: BackgroundTheme;
        label: string;
    }> = [
            { value: "noise-pattern", label: "Noise Pattern" },
            { value: "diagonal-lines", label: "Diagonal Lines" },
            { value: "magenta-orb-grid", label: "Magenta Orb Grid" },
            { value: "black-grid-dots", label: "Black Grid Dots" },
            { value: "pearl-mist", label: "Pearl Mist" },
            { value: "aurora-midnight", label: "Aurora Midnight" },
            { value: "crimson-shadow", label: "Crimson Shadow" },
            { value: "ocean-abyss", label: "Ocean Abyss" },
        ];

    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                Background Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
                {themes.map(({ value: themeValue, label }) => (
                    <div
                        key={themeValue}
                        onClick={() => onChange(themeValue)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === themeValue
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                    >
                        <div
                            className="w-full h-20 rounded mb-2"
                            style={getThemeStyle(themeValue)}
                        ></div>
                        <div className="text-center text-xs text-white">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
