import React from "react";
import { AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";
import { TechnologiesCustomizationState } from "@/types/technologies/portfolio";
import { SliderControl } from "./SliderControl";

interface TypographySelectorProps {
    customization: TechnologiesCustomizationState;
    updateCustomization: (key: keyof TechnologiesCustomizationState, value: any) => void;
}

export const TypographySelector: React.FC<TypographySelectorProps> = ({
    customization,
    updateCustomization,
}) => {
    return (
        <div className="space-y-6">
            {/* Icon Settings */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-white font-medium">Show Icons</label>
                    <button
                        onClick={() => updateCustomization("showIcons", !customization.showIcons)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${customization.showIcons ? "bg-green-500" : "bg-zinc-600"
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${customization.showIcons ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>

                {customization.showIcons && (
                    <SliderControl
                        label="Icon Size"
                        value={customization.iconSize}
                        min={16}
                        max={96}
                        step={4}
                        unit="px"
                        onChange={(val) => updateCustomization("iconSize", val)}
                    />
                )}
            </div>

            <hr className="border-zinc-700" />

            {/* Label Settings */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-white font-medium">Show Labels</label>
                    <button
                        onClick={() => updateCustomization("showLabels", !customization.showLabels)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${customization.showLabels ? "bg-green-500" : "bg-zinc-600"
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${customization.showLabels ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>

                {customization.showLabels && (
                    <>
                        {/* Label Position */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">Position</label>
                            <div className="flex gap-2">
                                {["bottom", "right", "overlay"].map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => updateCustomization("labelPosition", pos)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${customization.labelPosition === pos
                                                ? "bg-white text-black"
                                                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                            }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Label Size */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">Size</label>
                            <div className="flex gap-2">
                                {["xs", "sm", "md", "lg"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => updateCustomization("labelSize", size)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium uppercase transition-all ${customization.labelSize === size
                                                ? "bg-white text-black"
                                                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Label Weight */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">Weight</label>
                            <div className="flex gap-2">
                                {["normal", "medium", "semibold", "bold"].map((weight) => (
                                    <button
                                        key={weight}
                                        onClick={() => updateCustomization("labelWeight", weight)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${customization.labelWeight === weight
                                                ? "bg-white text-black"
                                                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                            }`}
                                    >
                                        {weight}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Alignment */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">Alignment</label>
                            <div className="flex gap-2">
                                {[
                                    { value: "left", icon: AlignLeft },
                                    { value: "center", icon: AlignCenter },
                                    { value: "right", icon: AlignRight },
                                ].map(({ value, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => updateCustomization("textAlignment", value)}
                                        className={`flex-1 py-2 flex justify-center rounded-lg transition-all ${customization.textAlignment === value
                                                ? "bg-white text-black"
                                                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                                            }`}
                                    >
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
