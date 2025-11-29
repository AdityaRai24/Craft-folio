import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

export interface VerticalAlignmentSelectorProps {
    value: "top" | "center" | "bottom";
    onChange: (value: "top" | "center" | "bottom") => void;
    label: string;
}

export const VerticalAlignmentSelector: React.FC<VerticalAlignmentSelectorProps> = ({
    value,
    onChange,
    label,
}) => {
    const alignments = [
        { value: "top", icon: "↑", label: "Top" },
        { value: "center", icon: "↕", label: "Center" },
        { value: "bottom", icon: "↓", label: "Bottom" },
    ];

    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                {label}
            </label>
            <div className="grid grid-cols-3 gap-2">
                {alignments.map(({ value: align, icon, label: alignLabel }) => (
                    <div
                        key={align}
                        onClick={() => onChange(align as any)}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${value === align
                                ? "border-white bg-zinc-700 shadow-lg"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800 hover:shadow-md"
                            }`}
                    >
                        <div className="text-2xl text-white">{icon}</div>
                        <div className="relative w-full h-12 flex items-center justify-center">
                            {/* Background container */}
                            <div className="w-1 h-10 bg-gray-600 rounded-full"></div>
                            {/* Alignment indicator */}
                            <div
                                className={`absolute w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${align === "top"
                                        ? "top-0"
                                        : align === "center"
                                            ? "top-1/2 transform -translate-y-1/2"
                                            : "bottom-0"
                                    }`}
                                style={{
                                    background: `linear-gradient(135deg, ${ColorTheme.primary} ${ColorTheme.primaryDark})`,
                                    boxShadow: `0 0 8px ${ColorTheme.primary}40`,
                                }}
                            ></div>
                            {/* Subtle pulse animation for selected state */}
                            {value === align && (
                                <div
                                    className="absolute w-3 h-3 rounded-full animate-pulse"
                                    style={{
                                        background: `linear-gradient(135deg, ${ColorTheme.primary}20, ${ColorTheme.primaryDark}20)`,
                                    }}
                                ></div>
                            )}
                        </div>
                        <div className="text-xs text-white font-medium">{alignLabel}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
