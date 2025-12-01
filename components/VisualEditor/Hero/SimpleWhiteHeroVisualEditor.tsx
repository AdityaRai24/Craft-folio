"use client";

import React from "react";
import { Grid3X3, RotateCcw, Type, Zap, Eye, X } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { useDraggable } from "@/hooks/useDraggable";
import { SimpleWhiteHeroCustomizationState } from "@/types/interfaces/SimpleWhiteHeroCustomizationState";

// Visual Size Selector Component
const SizeSelector: React.FC<{
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: { value: string; label: string; size: string }[];
}> = ({ value, onChange, label, options }) => {
    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                {label}
            </label>
            <div className="grid grid-cols-2 gap-2">
                {options.map(({ value: optionValue, label: optionLabel, size }) => (
                    <div
                        key={optionValue}
                        onClick={() => onChange(optionValue)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === optionValue
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                    >
                        <div className="flex justify-center mb-2">
                            <div
                                className="bg-gradient-to-r rounded text-white text-center font-bold"
                                style={{ fontSize: size }}
                            >
                                Aa
                            </div>
                        </div>
                        <div className="text-center text-xs text-white">{optionLabel}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Visual Style Selector Component
const StyleSelector: React.FC<{
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: { value: string; label: string; style: string }[];
}> = ({ value, onChange, label, options }) => {
    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                {label}
            </label>
            <div className="grid grid-cols-2 gap-2">
                {options.map(({ value: optionValue, label: optionLabel, style }) => (
                    <div
                        key={optionValue}
                        onClick={() => onChange(optionValue)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === optionValue
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                    >
                        <div className="flex justify-center mb-2">
                            <div className={`px-3 py-1 text-xs rounded transition-all ${style}`}>
                                Button
                            </div>
                        </div>
                        <div className="text-center text-xs text-white">{optionLabel}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Visual Background Theme Selector Component
const BackgroundThemeSelector: React.FC<{
    value: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning";
    onChange: (value: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning") => void;
}> = ({ value, onChange }) => {
    const getThemeStyle = (theme: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning") => {
        switch (theme) {
            case "diagonal-grid":
                return {
                    backgroundColor: "#fafafa",
                    backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px)
          `,
                    backgroundSize: "16px 16px",
                };
            case "crosshatch":
                return {
                    backgroundColor: "#ffffff",
                    backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 1px, rgba(75, 85, 99, 0.2) 1px, rgba(75, 85, 99, 0.2) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(67.5deg, transparent, transparent 1px, rgba(107, 114, 128, 0.15) 1px, rgba(107, 114, 128, 0.15) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(112.5deg, transparent, transparent 1px, rgba(55, 65, 81, 0.1) 1px, rgba(55, 65, 81, 0.1) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(157.5deg, transparent, transparent 1px, rgba(31, 41, 55, 0.08) 1px, rgba(31, 41, 55, 0.08) 2px, transparent 2px, transparent 4px)
          `,
                };
            case "circuit-board":
                return {
                    backgroundColor: "#ffffff",
                    backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(75, 85, 99, 0.25) 8px, rgba(75, 85, 99, 0.25) 9px, transparent 9px, transparent 16px, rgba(75, 85, 99, 0.25) 16px, rgba(75, 85, 99, 0.25) 17px),
            repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(75, 85, 99, 0.25) 8px, rgba(75, 85, 99, 0.25) 9px, transparent 9px, transparent 16px, rgba(75, 85, 99, 0.25) 16px, rgba(75, 85, 99, 0.25) 17px),
            radial-gradient(circle at 8px 8px, rgba(55, 65, 81, 0.4) 1px, transparent 1px),
            radial-gradient(circle at 16px 16px, rgba(55, 65, 81, 0.4) 1px, transparent 1px)
          `,
                    backgroundSize: "16px 16px, 16px 16px, 16px 16px, 16px 16px",
                };
            case "zigzag-lightning":
                return {
                    backgroundColor: "#ffffff",
                    backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(75, 85, 99, 0.25) 8px, rgba(75, 85, 99, 0.25) 9px),
            repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(107, 114, 128, 0.2) 12px, rgba(107, 114, 128, 0.2) 13px),
            repeating-linear-gradient(60deg, transparent, transparent 16px, rgba(55, 65, 81, 0.15) 16px, rgba(55, 65, 81, 0.15) 17px),
            repeating-linear-gradient(150deg, transparent, transparent 14px, rgba(31, 41, 55, 0.12) 14px, rgba(31, 41, 55, 0.12) 15px)
          `,
                };
            default:
                return {
                    backgroundColor: "#fafafa",
                    backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.3) 0, rgba(255, 0, 100, 0.3) 2px, transparent 2px, transparent 8px)
          `,
                    backgroundSize: "16px 16px",
                };
        }
    };

    const themes: Array<{
        value: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning";
        label: string;
    }> = [
            {
                value: "diagonal-grid",
                label: "Diagonal Grid",
            },
            {
                value: "crosshatch",
                label: "Crosshatch",
            },
            {
                value: "circuit-board",
                label: "Circuit Board",
            },
            {
                value: "zigzag-lightning",
                label: "Zigzag Lightning",
            },
        ];

    return (
        <div>
            <label className="block text-white text-left font-medium mb-3">
                Background Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
                {themes.map(({ value: themeValue, label }) => (
                    <div
                        key={themeValue}
                        onClick={() => onChange(themeValue)}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value === themeValue
                            ? "border-white bg-zinc-700"
                            : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                            }`}
                    >
                        <div
                            className="w-full h-20 rounded mb-2"
                            style={getThemeStyle(themeValue)}
                        ></div>
                        <div className="text-center text-xs text-white">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface SimpleWhiteHeroVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: SimpleWhiteHeroCustomizationState;
    draftCustomization: SimpleWhiteHeroCustomizationState | null;
    onUpdateDraft: (key: keyof SimpleWhiteHeroCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    activeTab: "layout" | "typography" | "buttons" | "effects";
    onTabChange: (tab: "layout" | "typography" | "buttons" | "effects") => void;
}

const SimpleWhiteHeroVisualEditor: React.FC<SimpleWhiteHeroVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
    activeTab,
    onTabChange,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();

    if (!isOpen) return null;

    return (
        <>
            <div
                ref={dragRef}
                className="fixed bg-zinc-900 shadow-2xl rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden"
                style={{
                    left: `${windowPosition.x}px`,
                    top: `${windowPosition.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                    zIndex: 99999999,
                }}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-base sm:text-lg font-bold text-white">Visual Editor</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-zinc-700">
                    {["layout", "typography", "buttons", "effects"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab as any)}
                            className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === tab ? "text-white" : "text-gray-400 hover:text-white"
                                }`}
                            style={{
                                background: activeTab === tab ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                            }}
                        >
                            {tab === "layout" && (
                                <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                            )}
                            {tab === "typography" && (
                                <Type className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                            )}
                            {tab === "buttons" && (
                                <Zap className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                            )}
                            {tab === "effects" && (
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                            )}
                            <span className="hidden sm:inline">{tab}</span>
                            <span className="sm:hidden">{tab.charAt(0)}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {activeTab === "layout" && (
                        <div className="space-y-4">
                            <BackgroundThemeSelector
                                value={draftCustomization?.backgroundTheme ?? customization.backgroundTheme}
                                onChange={value => onUpdateDraft("backgroundTheme", value)}
                            />
                        </div>
                    )}

                    {activeTab === "typography" && (
                        <div className="space-y-4">
                            <SizeSelector
                                value={draftCustomization?.titleSize ?? customization.titleSize}
                                onChange={value => onUpdateDraft("titleSize", value)}
                                label="Title Size"
                                options={[
                                    { value: "sm", label: "Small", size: "24px" },
                                    { value: "md", label: "Medium", size: "32px" },
                                    { value: "lg", label: "Large", size: "40px" },
                                    { value: "xl", label: "Extra Large", size: "52px" },
                                ]}
                            />

                            <div>
                                <label className="block text-white text-left font-medium mb-3">
                                    Title Weight
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { value: "normal", label: "Normal", weight: "font-normal" },
                                        { value: "medium", label: "Medium", weight: "font-medium" },
                                        { value: "semibold", label: "Semibold", weight: "font-semibold" },
                                        { value: "bold", label: "Bold", weight: "font-bold" },
                                        { value: "extrabold", label: "Extrabold", weight: "font-extrabold" },
                                    ].map(({ value, label, weight }) => (
                                        <div
                                            key={value}
                                            onClick={() => onUpdateDraft("titleWeight", value)}
                                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${(draftCustomization?.titleWeight ?? customization.titleWeight) === value
                                                ? "border-white bg-zinc-700"
                                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                                }`}
                                        >
                                            <div className="flex justify-center mb-2">
                                                <div className={`text-white text-center px-3 py-1 ${weight}`} style={{ fontSize: "14px" }}>
                                                    Aa
                                                </div>
                                            </div>
                                            <div className="text-center text-xs text-white">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-zinc-700 pt-4 mt-4">
                                <SizeSelector
                                    value={draftCustomization?.subtitleSize ?? customization.subtitleSize}
                                    onChange={value => onUpdateDraft("subtitleSize", value)}
                                    label="Subtitle Size"
                                    options={[
                                        { value: "sm", label: "Small", size: "16px" },
                                        { value: "md", label: "Medium", size: "18px" },
                                        { value: "lg", label: "Large", size: "20px" },
                                        { value: "xl", label: "Extra Large", size: "24px" },
                                    ]}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4 mt-4">
                                <SizeSelector
                                    value={draftCustomization?.descriptionSize ?? customization.descriptionSize}
                                    onChange={value => onUpdateDraft("descriptionSize", value)}
                                    label="Description Size"
                                    options={[
                                        { value: "sm", label: "Small", size: "14px" },
                                        { value: "md", label: "Medium", size: "16px" },
                                        { value: "lg", label: "Large", size: "18px" },
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "buttons" && (
                        <div className="space-y-4">
                            <StyleSelector
                                value={draftCustomization?.resumeButtonStyle ?? customization.resumeButtonStyle}
                                onChange={value => onUpdateDraft("resumeButtonStyle", value)}
                                label="Button Style"
                                options={[
                                    { value: "default", label: "Default", style: "bg-gray-900 text-white rounded" },
                                    { value: "animated", label: "Animated", style: "bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded" },
                                    { value: "minimal", label: "Minimal", style: "border border-gray-300 text-gray-700 rounded" },
                                    { value: "outline", label: "Outline", style: "border-2 border-gray-900 text-gray-900 rounded" },
                                ]}
                            />

                            <div>
                                <label className="block text-white text-left font-medium mb-3">
                                    Button Size
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: "sm", label: "Small", size: "px-4 py-2 text-sm" },
                                        { value: "md", label: "Medium", size: "px-6 py-3 text-base" },
                                        { value: "lg", label: "Large", size: "px-8 py-4 text-lg" },
                                    ].map(({ value, label, size }) => (
                                        <div
                                            key={value}
                                            onClick={() => onUpdateDraft("resumeButtonSize", value)}
                                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${(draftCustomization?.resumeButtonSize ?? customization.resumeButtonSize) === value
                                                ? "border-white bg-zinc-700"
                                                : "border-gray-600 hover:border-gray-400 bg-zinc-800"
                                                }`}
                                        >
                                            <div className="flex justify-center mb-2">
                                                <div className={`px-3 py-1 text-xs rounded bg-gray-900 text-white ${size}`}>
                                                    Button
                                                </div>
                                            </div>
                                            <div className="text-center text-xs text-white">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "effects" && (
                        <div className="space-y-4">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-300">Hover Effects</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={draftCustomization?.hoverEffects ?? customization.hoverEffects}
                                            onChange={(e) => onUpdateDraft("hoverEffects", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                                            style={{
                                                backgroundColor: (draftCustomization?.hoverEffects ?? customization.hoverEffects) ? ColorTheme.primary : "",
                                            }}
                                        ></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-300">Stagger Animation</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={draftCustomization?.staggerAnimation ?? customization.staggerAnimation}
                                            onChange={(e) => onUpdateDraft("staggerAnimation", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                                            style={{
                                                backgroundColor: (draftCustomization?.staggerAnimation ?? customization.staggerAnimation) ? ColorTheme.primary : "",
                                            }}
                                        ></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 border-t border-zinc-700 bg-zinc-800">
                    <div className="flex gap-2">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1 flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </button>
                        <button
                            onClick={onSave}
                            className="flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm text-white rounded transition-colors"
                            style={{
                                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for floating window */}
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={onClose}
            />
        </>
    );
};

export default SimpleWhiteHeroVisualEditor;
