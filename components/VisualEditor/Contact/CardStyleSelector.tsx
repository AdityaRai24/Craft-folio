import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface CardStyleSelectorProps {
    value: "default" | "minimal" | "glass" | "neon";
    onChange: (value: "default" | "minimal" | "glass" | "neon") => void;
}

const CardStyleSelector: React.FC<CardStyleSelectorProps> = ({ value, onChange }) => {
    const getThemeButtonStyle = (isActive: boolean) => {
        if (isActive) {
            return {
                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                color: 'white'
            };
        }
        return {};
    };

    return (
        <div>
            <label className="block text-white font-medium mb-2">
                Card Style
            </label>
            <div className="grid grid-cols-2 gap-2">
                {[
                    { value: "default", label: "Default" },
                    { value: "minimal", label: "Minimal" },
                    { value: "glass", label: "Glass" },
                    { value: "neon", label: "Neon" },
                ].map((style) => (
                    <button
                        key={style.value}
                        onClick={() => onChange(style.value as any)}
                        className={`py-2 px-3 text-sm rounded transition-colors ${value === style.value
                            ? "text-white"
                            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                            }`}
                        style={getThemeButtonStyle(value === style.value)}
                    >
                        {style.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CardStyleSelector;
