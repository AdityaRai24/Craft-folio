import React from "react";
import { TechnologiesCustomizationState } from "@/types/technologies/portfolio";
import { SliderControl } from "./SliderControl";

interface StyleSelectorProps {
    customization: TechnologiesCustomizationState;
    updateCustomization: (key: keyof TechnologiesCustomizationState, value: any) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
    customization,
    updateCustomization,
}) => {
    const cardStyles = [
        { value: "default", label: "Default", preview: "bg-zinc-800 border-zinc-700" },
        { value: "minimal", label: "Minimal", preview: "bg-transparent border-transparent" },
        { value: "glass", label: "Glass", preview: "bg-white/10 backdrop-blur border-white/20" },
        { value: "neon", label: "Neon", preview: "bg-black border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" },
        { value: "gradient", label: "Gradient", preview: "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30" },
        { value: "elevated", label: "Elevated", preview: "bg-zinc-800 shadow-lg border-zinc-700" },
        { value: "outlined", label: "Outlined", preview: "bg-transparent border-zinc-500 border-2" },
        { value: "filled", label: "Filled", preview: "bg-zinc-700 border-transparent" },
    ];

    return (
        <div className="space-y-6">
            {/* Card Style Grid */}
            <div>
                <label className="block text-white font-medium mb-3">Card Style</label>
                <div className="grid grid-cols-2 gap-3">
                    {cardStyles.map((style) => (
                        <button
                            key={style.value}
                            onClick={() => updateCustomization("cardStyle", style.value)}
                            className={`p-3 rounded-lg border-2 transition-all text-left group ${customization.cardStyle === style.value
                                ? "border-white bg-zinc-700"
                                : "border-zinc-700 hover:border-zinc-600 bg-zinc-800"
                                }`}
                        >
                            <div className={`h-12 w-full rounded mb-2 border ${style.preview}`} />
                            <span className={`text-xs ${customization.cardStyle === style.value ? "text-white" : "text-gray-400"
                                }`}>
                                {style.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Border Radius */}
            <SliderControl
                label="Border Radius"
                value={customization.cardBorderRadius}
                min={0}
                max={32}
                unit="px"
                onChange={(val) => updateCustomization("cardBorderRadius", val)}
            />

            {/* Card Padding */}
            <SliderControl
                label="Card Padding"
                value={customization.cardPadding}
                min={8}
                max={48}
                step={4}
                unit="px"
                onChange={(val) => updateCustomization("cardPadding", val)}
            />

            {/* Border Width */}
            <SliderControl
                label="Border Width"
                value={customization.borderWidth}
                min={0}
                max={4}
                unit="px"
                onChange={(val) => updateCustomization("borderWidth", val)}
            />

            {/* Background Opacity */}
            <SliderControl
                label="Background Opacity"
                value={customization.backgroundOpacity}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={(val) => updateCustomization("backgroundOpacity", val)}
            />

            {/* Shadow Intensity */}
            <div>
                <label className="block text-white font-medium mb-3">Shadow Intensity</label>
                <div className="flex gap-2">
                    {["none", "light", "medium", "heavy"].map((intensity) => (
                        <button
                            key={intensity}
                            onClick={() => updateCustomization("cardShadow", intensity)}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${customization.cardShadow === intensity
                                ? "bg-white text-black"
                                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                }`}
                        >
                            {intensity}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
