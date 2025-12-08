import React from "react";

import { ColorTheme } from "@/lib/colorThemes";

interface CardStyleOption {
    value: string;
    label: string;
    preview: string;
}

interface CardStyleSelectorProps {
    value: string;
    onChange: (value: any) => void;
    previewHeight?: string;
    primaryColor?: string;
    options?: CardStyleOption[];
}

const CardStyleSelector: React.FC<CardStyleSelectorProps> = ({
    value,
    onChange,
    previewHeight = "h-16",
    primaryColor = ColorTheme.primary,
    options = [
        { value: "default", label: "Default", preview: "bg-zinc-800 border border-zinc-700" },
        { value: "minimal", label: "Minimal", preview: "bg-transparent border-0" },
        { value: "glass", label: "Glass", preview: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50" },
        { value: "neon", label: "Neon", preview: "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20" },
        { value: "gradient", label: "Gradient", preview: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200" },
    ]
}) => {
    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">Card Style</label>
            <div className="grid grid-cols-2 gap-3">
                {options.map((style) => (
                    <div
                        key={style.value}
                        onClick={() => onChange(style.value)}
                        className={`cursor-pointer p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${value === style.value
                            ? "border-transparent text-white"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                        style={
                            value === style.value
                                ? { background: primaryColor }
                                : {}
                        }
                    >
                        <div className="space-y-2">
                            <div className={`${previewHeight} rounded-lg ${style.preview} flex flex-col justify-center items-center`}>
                                <div className="w-8 h-2 bg-zinc-600 rounded mb-1"></div>
                                <div className="w-6 h-2 bg-zinc-500 rounded"></div>
                            </div>
                        </div>
                        <div className="text-center text-sm text-white mt-2">
                            {style.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardStyleSelector;
