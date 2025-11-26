import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface TimelineSelectorProps {
    styleValue: "line" | "dots" | "gradient" | "minimal";
    onStyleChange: (value: "line" | "dots" | "gradient" | "minimal") => void;
    positionValue: "left" | "center" | "alternating";
    onPositionChange: (value: "left" | "center" | "alternating") => void;
}

const TimelineSelector: React.FC<TimelineSelectorProps> = ({
    styleValue,
    onStyleChange,
    positionValue,
    onPositionChange,
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
                                    ? "border-white bg-zinc-700"
                                    : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                }`}
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
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: "left", label: "Left" },
                        { value: "center", label: "Center" },
                        { value: "alternating", label: "Alternating" },
                    ].map((pos) => (
                        <div
                            key={pos.value}
                            onClick={() => onPositionChange(pos.value as any)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${positionValue === pos.value
                                    ? "border-white bg-zinc-700"
                                    : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                }`}
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
