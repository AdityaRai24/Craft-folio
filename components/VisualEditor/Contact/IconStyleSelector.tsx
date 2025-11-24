import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface IconStyleSelectorProps {
    value: "outline" | "filled";
    onChange: (value: "outline" | "filled") => void;
}

const IconStyleSelector: React.FC<IconStyleSelectorProps> = ({ value, onChange }) => {
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
                Icon Style
            </label>
            <div className="flex gap-1">
                {["outline", "filled"].map((style) => (
                    <button
                        key={style}
                        onClick={() => onChange(style as any)}
                        className={`flex-1 py-2 px-3 text-sm capitalize rounded transition-colors ${value === style
                                ? "text-white"
                                : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                            }`}
                        style={getThemeButtonStyle(value === style)}
                    >
                        {style}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IconStyleSelector;
