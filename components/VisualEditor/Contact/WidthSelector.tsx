import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface WidthSelectorProps {
    value: "full" | "narrow" | "wide";
    onChange: (value: "full" | "narrow" | "wide") => void;
}

const WidthSelector: React.FC<WidthSelectorProps> = ({ value, onChange }) => {
    const widths = [
        { value: "narrow", label: "Narrow", width: "60%" },
        { value: "wide", label: "Wide", width: "80%" },
        { value: "full", label: "Full", width: "100%" },
    ];

    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                Container Width
            </label>
            <div className="grid grid-cols-3 gap-2">
                {widths.map(({ value: width, label, width: widthValue }) => (
                    <div
                        key={width}
                        onClick={() => onChange(width as any)}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${value === width
                                ? "border-white bg-zinc-700"
                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                    >
                        <div className="w-full h-3 rounded" style={{
                            width: widthValue,
                            background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`
                        }}></div>
                        <div className="text-xs text-white">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WidthSelector;
