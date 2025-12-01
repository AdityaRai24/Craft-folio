"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layout, Move, RotateCcw, X, Type, Zap } from "lucide-react";
import { AlignmentSelector } from "./AlignmentSelector";
import { VerticalAlignmentSelector } from "./VerticalAlignmentSelector";
import { SizeSelector } from "./SizeSelector";
import { ButtonStyleSelector } from "./ButtonStyleSelector";
import { BackgroundThemeSelector } from "./BackgroundThemeSelector";
import WidthSelector from "../Contact/WidthSelector";
import { useDraggable } from "@/hooks/useDraggable";
import { HeroCustomizationState } from "@/types/hero/portfolio";
import { ColorTheme } from "@/lib/colorThemes";

interface HeroVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: HeroCustomizationState;
    draftCustomization: HeroCustomizationState | null;
    onUpdateDraft: (key: keyof HeroCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    activeTab: "layout" | "typography" | "buttons" | "effects";
    onTabChange: (tab: "layout" | "typography" | "buttons" | "effects") => void;
}

const HeroVisualEditor: React.FC<HeroVisualEditorProps> = ({
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

    if (!isOpen || !draftCustomization) return null;

    const renderToggle = (label: string, value: boolean, onChange: (value: boolean) => void) => (
        <div className="mb-4 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <div
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                    style={{ backgroundColor: value ? ColorTheme.primary : "" }}
                ></div>
            </label>
        </div>
    );

    return (
        <>
            <div
                ref={dragRef}
                className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden"
                style={{
                    left: `${windowPosition.x}px`,
                    top: `${windowPosition.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                <div
                    className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-base sm:text-lg font-bold text-white">Hero Visual Editor</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                <div className="flex border-b border-zinc-700">
                    {["layout", "typography", "buttons", "effects"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab as any)}
                            className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === tab ? "text-white" : "text-gray-400 hover:text-white hover:bg-zinc-800"
                                }`}
                            style={
                                activeTab === tab
                                    ? { background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }
                                    : {}
                            }
                        >
                            {tab === "layout" && <Layout className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            {tab === "typography" && <Type className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            {tab === "buttons" && <Move className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            {tab === "effects" && <Zap className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            <span className="hidden sm:inline">{tab}</span>
                            <span className="sm:hidden">{tab.charAt(0)}</span>
                        </button>
                    ))}
                </div>

                <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 custom-scrollbar">
                    {activeTab === "layout" && (
                        <>


                            <BackgroundThemeSelector
                                value={draftCustomization.backgroundTheme}
                                onChange={(value) => onUpdateDraft("backgroundTheme", value)}
                            />
                            <AlignmentSelector
                                value={draftCustomization.contentAlignment}
                                onChange={(value) => onUpdateDraft("contentAlignment", value)}
                                label="Content Alignment"
                            />
                            <WidthSelector
                                value={draftCustomization.containerWidth}
                                onChange={(value) => onUpdateDraft("containerWidth", value)}
                            />
                            {renderToggle("Show Badge", draftCustomization.badgeVisible, (value) =>
                                onUpdateDraft("badgeVisible", value)
                            )}
                        </>
                    )}

                    {activeTab === "typography" && (
                        <div className="space-y-6">
                            <SizeSelector
                                value={draftCustomization.titleSize}
                                onChange={(value) => onUpdateDraft("titleSize", value)}
                                label="Title Size"
                                options={[
                                    { value: "sm", label: "Small", size: "0.875rem" },
                                    { value: "md", label: "Medium", size: "1rem" },
                                    { value: "lg", label: "Large", size: "1.25rem" },
                                    { value: "xl", label: "XL", size: "1.5rem" },
                                    { value: "2xl", label: "2XL", size: "1.875rem" },
                                ]}
                            />
                            <SizeSelector
                                value={draftCustomization.descriptionSize}
                                onChange={(value) => onUpdateDraft("descriptionSize", value)}
                                label="Description Size"
                                options={[
                                    { value: "xs", label: "XSmall", size: "0.6rem" },
                                    { value: "sm", label: "Small", size: "0.875rem" },
                                    { value: "md", label: "Medium", size: "1rem" },
                                    { value: "lg", label: "Large", size: "1.125rem" },
                                ]}
                            />
                        </div>
                    )}

                    {activeTab === "buttons" && (
                        <>
                            <ButtonStyleSelector
                                value={draftCustomization.buttonStyle}
                                onChange={(value) => onUpdateDraft("buttonStyle", value)}
                                label="Button Style"
                                options={[
                                    { value: "default", label: "Default", style: "rounded" },
                                    { value: "rounded", label: "Rounded", style: "rounded-lg" },
                                    { value: "pill", label: "Pill", style: "rounded-full" },
                                    { value: "square", label: "Square", style: "rounded-none" },
                                ]}
                            />
                            <SizeSelector
                                value={draftCustomization.buttonSize}
                                onChange={(value) => onUpdateDraft("buttonSize", value)}
                                label="Button Size"
                                options={[
                                    { value: "sm", label: "Small", size: "0.75rem" },
                                    { value: "md", label: "Medium", size: "1rem" },
                                    { value: "lg", label: "Large", size: "1.25rem" },
                                ]}
                            />
                        </>
                    )}

                    {activeTab === "effects" && (
                        <>
                            {renderToggle("Scroll Indicator", draftCustomization.scrollIndicator, (value) =>
                                onUpdateDraft("scrollIndicator", value)
                            )}
                            {draftCustomization.scrollIndicator && (
                                <div className="mb-4 pl-2 border-l-2 border-zinc-700 ml-1">
                                    <label className="text-xs font-medium text-gray-400 mb-2 block">Style</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {["line", "arrow", "dot", "animated"].map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => onUpdateDraft("scrollIndicatorStyle", style)}
                                                className={`h-16 flex items-center justify-center rounded border transition-all relative overflow-hidden ${draftCustomization.scrollIndicatorStyle === style
                                                    ? "bg-zinc-700 border-white text-white"
                                                    : "bg-zinc-800 border-zinc-600 text-gray-400 hover:border-zinc-500"
                                                    }`}
                                                title={style.charAt(0).toUpperCase() + style.slice(1)}
                                            >
                                                {style === "line" && (
                                                    <div className="h-8 w-0.5 bg-current mx-auto" />
                                                )}
                                                {style === "arrow" && (
                                                    <motion.div
                                                        animate={{ y: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        ↓
                                                    </motion.div>
                                                )}
                                                {style === "dot" && (
                                                    <motion.div
                                                        animate={{ scale: [1, 1.5, 1] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        className="w-1.5 h-1.5 bg-current rounded-full"
                                                    />
                                                )}
                                                {style === "animated" && (
                                                    <div className="w-4 h-7 border-2 border-current rounded-full flex justify-center pt-1">
                                                        <motion.div
                                                            animate={{ y: [0, 8, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                            className="w-1 h-2 bg-current rounded-full"
                                                        />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {renderToggle("Glow Effect", draftCustomization.glowEffect, (value) =>
                                onUpdateDraft("glowEffect", value)
                            )}
                            {renderToggle("Text Shadow", draftCustomization.textShadow, (value) =>
                                onUpdateDraft("textShadow", value)
                            )}
                        </>
                    )}
                </div>

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
                            style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
        </>
    );
};

export default HeroVisualEditor;
