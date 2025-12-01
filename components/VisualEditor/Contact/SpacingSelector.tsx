import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface SpacingSelectorProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
    type: "gap" | "padding";
}

const SpacingSelector: React.FC<SpacingSelectorProps> = ({ value, onChange, label, type }) => {
    return (
        <div>
            <label className="block text-left text-sm font-medium text-gray-300 mb-2">
                {label}: {value}px
            </label>
            <input
                type="range"
                min={type === "gap" ? 2 : 1}
                max={type === "gap" ? 64 : 12}
                step={type === "gap" ? 4 : 1}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${(value / (type === "gap" ? 64 : 12)) * 100}%, #3f3f46 ${(value / (type === "gap" ? 64 : 12)) * 100}%, #3f3f46 100%)`
                }}
            />
        </div>
    );
};

export default SpacingSelector;
