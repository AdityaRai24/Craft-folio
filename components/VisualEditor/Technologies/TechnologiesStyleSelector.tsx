import React from "react";
import { TechnologiesCustomizationState } from "@/types/interfaces/TechnologiesCustomizationState";
import SliderControl from "../Shared/SliderControl";

interface TechnologiesStyleSelectorProps {
    customization: TechnologiesCustomizationState;
    updateCustomization: (key: keyof TechnologiesCustomizationState, value: any) => void;
}

export const TechnologiesStyleSelector: React.FC<TechnologiesStyleSelectorProps> = ({
    customization,
    updateCustomization,
}) => {

    return (
        <div className="space-y-6">
            {/* Card Style Grid */}

            {/* Border Radius */}
            <SliderControl
                label="Border Radius"
                value={customization.cardBorderRadius}
                min={0}
                max={32}
                onChange={(val) => updateCustomization("cardBorderRadius", val)}
            />

            {/* Card Padding */}
            <SliderControl
                label="Card Padding"
                value={customization.cardPadding}
                min={8}
                max={48}
                step={4}
                onChange={(val) => updateCustomization("cardPadding", val)}
            />

            {/* Border Width */}
            <SliderControl
                label="Border Width"
                value={customization.borderWidth}
                min={0}
                max={4}
                onChange={(val) => updateCustomization("borderWidth", val)}
            />

            {/* Background Opacity */}
            {/* <SliderControl
                label="Background Opacity"
                value={customization.backgroundOpacity}
                min={0}
                max={100}
                step={5}
                onChange={(val) => updateCustomization("backgroundOpacity", val)}
            /> */}

            {/* Shadow Intensity */}
            {/* <div>
                <label className="block text-white text-left font-medium mb-3">Shadow Intensity</label>
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
            </div> */}
        </div>
    );
};
