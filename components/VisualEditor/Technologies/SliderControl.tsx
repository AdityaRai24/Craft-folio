import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface SliderControlProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    unit?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    unit = "",
}) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return (
        <div>
            <div className="flex justify-between mb-2">
                <label className="text-white font-medium text-sm">{label}</label>
                <span className="text-gray-400 text-xs">
                    {value}
                    {unit}
                </span>
            </div>
            <div className="relative h-2 w-full bg-zinc-700 rounded-lg">
                <div
                    className="absolute h-full rounded-lg pointer-events-none"
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <div
                    className="absolute h-4 w-4 bg-white rounded-full shadow-md pointer-events-none top-1/2 -translate-y-1/2 -ml-2"
                    style={{ left: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
