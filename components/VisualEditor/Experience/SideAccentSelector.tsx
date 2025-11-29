import React from "react";
import { ColorTheme } from "@/lib/colorThemes";

interface SideAccentSelectorProps {
    isVisible: boolean;
    onVisibilityChange: (visible: boolean) => void;
    width: number;
    onWidthChange: (width: number) => void;
    color: string;
    onColorChange: (color: string) => void;
}

const SideAccentSelector: React.FC<SideAccentSelectorProps> = ({
    isVisible,
    onVisibilityChange,
    width,
    onWidthChange,
    color,
    onColorChange,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Side Accent</label>
                <button
                    onClick={() => onVisibilityChange(!isVisible)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVisible ? "bg-blue-600" : "bg-zinc-700"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVisible ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>

            {isVisible && (
                <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">Width ({width}px)</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={width}
                            onChange={(e) => onWidthChange(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${width * 10}%, #3f3f46 ${width * 10}%, #3f3f46 100%)`
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-2">Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {[ColorTheme.primary, "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b"].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => onColorChange(c)}
                                    className={`w-6 h-6 rounded-full border-2 ${color === c ? "border-white" : "border-transparent"
                                        }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideAccentSelector;
