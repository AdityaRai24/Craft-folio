import React from "react";
import { LayoutGrid, List, GalleryHorizontal, Columns, Maximize } from "lucide-react";
import { TechnologiesCustomizationState } from "@/types/technologies/portfolio";
import { SliderControl } from "./SliderControl";
import { ColorTheme } from "@/lib/colorThemes";

interface LayoutSelectorProps {
    customization: TechnologiesCustomizationState;
    updateCustomization: (key: keyof TechnologiesCustomizationState, value: any) => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
    customization,
    updateCustomization,
}) => {
    return (
        <div className="space-y-6">
            {/* Layout Mode */}
            <div>
                <label className="block text-white font-medium mb-3">Display Mode</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: "grid", label: "Grid", icon: LayoutGrid },
                        { value: "marquee", label: "Marquee", icon: GalleryHorizontal },
                        { value: "carousel", label: "Carousel", icon: List },
                    ].map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => updateCustomization("layout", value)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${customization.layout === value
                                    ? "border-white bg-zinc-700"
                                    : "border-zinc-700 hover:border-zinc-600 bg-zinc-800"
                                }`}
                        >
                            <Icon
                                className={`mb-2 ${customization.layout === value ? "text-white" : "text-gray-400"
                                    }`}
                                size={20}
                            />
                            <span
                                className={`text-xs ${customization.layout === value ? "text-white" : "text-gray-400"
                                    }`}
                            >
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Columns (Only for Grid layout) */}
            {customization.layout === "grid" && (
                <SliderControl
                    label="Grid Columns"
                    value={customization.gridColumns}
                    min={2}
                    max={8}
                    onChange={(val) => updateCustomization("gridColumns", val)}
                />
            )}

            {/* Gap/Spacing */}
            <SliderControl
                label="Item Spacing"
                value={customization.gap}
                min={4}
                max={64}
                step={4}
                unit="px"
                onChange={(val) => updateCustomization("gap", val)}
            />

            {/* Container Width */}
            <div>
                <label className="block text-white font-medium mb-3">Container Width</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: "md", label: "Medium" },
                        { value: "lg", label: "Large" },
                        { value: "xl", label: "Extra Large" },
                        { value: "2xl", label: "2XL" },
                        { value: "full", label: "Full Width" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateCustomization("containerWidth", value)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${customization.containerWidth === value
                                    ? "bg-white text-black"
                                    : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Marquee Specific Settings */}
            {customization.layout === "marquee" && (
                <div className="space-y-4 pt-4 border-t border-zinc-700">
                    <h4 className="text-white font-medium text-sm">Marquee Settings</h4>

                    <div className="flex gap-2">
                        {["left", "right"].map((dir) => (
                            <button
                                key={dir}
                                onClick={() => updateCustomization("marqueeDirection", dir)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${customization.marqueeDirection === dir
                                        ? "bg-white text-black"
                                        : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                    }`}
                            >
                                {dir}
                            </button>
                        ))}
                    </div>

                    <SliderControl
                        label="Speed"
                        value={customization.marqueeSpeed}
                        min={10}
                        max={200}
                        step={10}
                        onChange={(val) => updateCustomization("marqueeSpeed", val)}
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">Pause on Hover</span>
                        <button
                            onClick={() => updateCustomization("pauseOnHover", !customization.pauseOnHover)}
                            className={`w-11 h-6 rounded-full transition-colors relative ${customization.pauseOnHover ? "bg-green-500" : "bg-zinc-600"
                                }`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${customization.pauseOnHover ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
