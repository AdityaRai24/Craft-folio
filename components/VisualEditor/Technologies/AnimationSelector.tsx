import React from "react";
import { TechnologiesCustomizationState } from "@/types/interfaces/TechnologiesCustomizationState";
import { SliderControl } from "./SliderControl";

interface AnimationSelectorProps {
    customization: TechnologiesCustomizationState;
    updateCustomization: (key: keyof TechnologiesCustomizationState, value: any) => void;
}

export const AnimationSelector: React.FC<AnimationSelectorProps> = ({
    customization,
    updateCustomization,
}) => {
    return (
        <div className="space-y-6">
            {/* Entry Animation Style */}
            <div>
                <label className="block text-white font-medium mb-3">Entry Animation</label>
                <div className="grid grid-cols-3 gap-2">
                    {["none", "fade", "slide", "scale", "bounce"].map((anim) => (
                        <button
                            key={anim}
                            onClick={() => updateCustomization("animationStyle", anim)}
                            className={`py-2 rounded-lg text-xs font-medium capitalize transition-all ${customization.animationStyle === anim
                                ? "bg-white text-black"
                                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                }`}
                        >
                            {anim}
                        </button>
                    ))}
                </div>
            </div>

            {/* Animation Speed */}
            <SliderControl
                label="Animation Duration"
                value={customization.animationSpeed}
                min={100}
                max={1000}
                step={50}
                unit="ms"
                onChange={(val) => updateCustomization("animationSpeed", val)}
            />

            {/* Stagger Animation */}
            <div className="flex items-center justify-between">
                <label className="text-white font-medium">Stagger Items</label>
                <button
                    onClick={() => updateCustomization("staggerAnimation", !customization.staggerAnimation)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${customization.staggerAnimation ? "bg-green-500" : "bg-zinc-600"
                        }`}
                >
                    <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${customization.staggerAnimation ? "translate-x-5" : "translate-x-0"
                            }`}
                    />
                </button>
            </div>

            <hr className="border-zinc-700" />

            {/* Hover Effects */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-white font-medium">Hover Effects</label>
                    <button
                        onClick={() => updateCustomization("hoverEffects", !customization.hoverEffects)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${customization.hoverEffects ? "bg-green-500" : "bg-zinc-600"
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${customization.hoverEffects ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>

                {customization.hoverEffects && (
                    <div>
                        <label className="block text-white font-medium mb-3 text-sm">Hover Style</label>
                        <div className="grid grid-cols-3 gap-2">
                            {["none", "lift", "glow", "scale", "rotate"].map((effect) => (
                                <button
                                    key={effect}
                                    onClick={() => updateCustomization("cardHoverEffect", effect)}
                                    className={`py-2 rounded-lg text-xs font-medium capitalize transition-all ${customization.cardHoverEffect === effect
                                        ? "bg-white text-black"
                                        : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                        }`}
                                >
                                    {effect}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
