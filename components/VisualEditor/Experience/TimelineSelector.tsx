import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface TimelineSelectorProps {
    styleValue: "line" | "dots" | "gradient" | "minimal";
    onStyleChange: (value: "line" | "dots" | "gradient" | "minimal") => void;
    positionValue: "left" | "alternating";
    onPositionChange: (value: "left" | "alternating") => void;
    dotStyleValue?: "circle" | "square" | "diamond" | "hexagon";
    onDotStyleChange?: (value: "circle" | "square" | "diamond" | "hexagon") => void;
    primaryColor?: string;
}

const TimelineSelector: React.FC<TimelineSelectorProps> = ({
    styleValue,
    onStyleChange,
    positionValue,
    onPositionChange,
    dotStyleValue,
    onDotStyleChange,
    primaryColor = ColorTheme.primary,
}) => {
    return (
        <div className="space-y-6">
            {/* Timeline Style */}
            <div>
                <label className="block text-white text-left font-medium mb-3">Timeline Style</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: "line", label: "Line" },
                        { value: "dots", label: "Dots" },
                        { value: "gradient", label: "Gradient" },
                        { value: "minimal", label: "Minimal" },
                    ].map((style) => (
                        <div
                            key={style.value}
                            onClick={() => onStyleChange(style.value as any)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${styleValue === style.value
                                ? "border-transparent text-white"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                }`}
                            style={
                                styleValue === style.value
                                    ? { background: primaryColor }
                                    : {}
                            }
                        >
                            <div className="text-center text-sm text-white">
                                {style.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dot Style */}
            <div>
                <label className="block text-white text-left font-medium mb-3">Dot Style</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: "circle", label: "Circle" },
                        { value: "square", label: "Square" },
                        { value: "diamond", label: "Diamond" },
                        { value: "hexagon", label: "Hexagon" },
                    ].map((style) => (
                        <div
                            key={style.value}
                            onClick={() => onDotStyleChange?.(style.value as any)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${dotStyleValue === style.value
                                ? "border-transparent text-white"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                }`}
                            style={
                                dotStyleValue === style.value
                                    ? { background: primaryColor }
                                    : {}
                            }
                        >
                            <div className="text-center text-sm text-white">
                                {style.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Position */}
            <div>
                <label className="block text-white text-left font-medium mb-3">Timeline Position</label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: "left", label: "Left" },
                        { value: "alternating", label: "Alternating" },
                    ].map((pos) => (
                        <div
                            key={pos.value}
                            onClick={() => onPositionChange(pos.value as any)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${positionValue === pos.value
                                ? "border-transparent text-white"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                }`}
                            style={
                                positionValue === pos.value
                                    ? { background: primaryColor }
                                    : {}
                            }
                        >
                            <div className="text-center text-sm text-white">
                                {pos.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineSelector;
