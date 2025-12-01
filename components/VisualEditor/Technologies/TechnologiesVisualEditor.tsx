"use client";

import React, { useState } from "react";
import {
    Palette,
    Layout,
    Move,
    RotateCcw,
    X,
    Type,
} from "lucide-react";
import { TechnologiesCustomizationState } from "@/types/interfaces/TechnologiesCustomizationState";
import { TechnologiesLayoutSelector } from "./TechnologiesLayoutSelector";
import { TechnologiesStyleSelector } from "./TechnologiesStyleSelector";
import TypographySelector from "../Shared/TypographySelector";
import { AnimationSelector } from "./AnimationSelector";
import { useDraggable } from "@/hooks/useDraggable";
import { ColorTheme } from "@/lib/colorThemes";

interface TechnologiesVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: TechnologiesCustomizationState;
    updateCustomization: (key: keyof TechnologiesCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    primaryColor?: string;
    primaryDarkColor?: string;
}

export const TechnologiesVisualEditor: React.FC<TechnologiesVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    updateCustomization,
    onSave,
    onReset,
    primaryColor = ColorTheme.primary,
    primaryDarkColor = ColorTheme.primaryDark,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = useState<"layout" | "typography" | "styling" | "motion">("layout");

    if (!isOpen) return null;

    return (
        <>
            {/* Floating Visual Editor Window */}
            <div
                ref={dragRef}
                className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden"
                style={{
                    left: `${windowPosition.x}px`,
                    top: `${windowPosition.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-base sm:text-lg font-bold text-white">Technologies Editor</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-zinc-700">
                    {["layout", "typography", "styling", "motion"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === tab
                                ? "text-white"
                                : "text-gray-400 hover:text-white hover:bg-zinc-800"
                                }`}
                            style={
                                activeTab === tab
                                    ? {
                                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})`,
                                    }
                                    : {}
                            }
                        >
                            {tab === "layout" && <Layout className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            {tab === "typography" && <Type className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            {tab === "styling" && <Palette className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            {tab === "motion" && <Move className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            <span className="hidden sm:inline">{tab}</span>
                            <span className="sm:hidden">{tab.charAt(0)}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 custom-scrollbar">
                    {activeTab === "layout" && (
                        <TechnologiesLayoutSelector
                            customization={customization}
                            updateCustomization={updateCustomization}
                            onChange={value => updateCustomization("cardStyle", value)}
                            value={customization.cardStyle}
                        />
                    )}

                    {activeTab === "typography" && (
                        <div className="space-y-6">
                            <TypographySelector
                                label="Label Size"
                                value={customization.labelSize}
                                onChange={value => updateCustomization("labelSize", value)}
                                type="size"
                                options={[
                                    { value: "xs", label: "Extra Small", preview: "0.75rem" },
                                    { value: "sm", label: "Small", preview: "0.875rem" },
                                    { value: "md", label: "Medium", preview: "1rem" },
                                    { value: "lg", label: "Large", preview: "1.125rem" },
                                ]}
                            />

                            <TypographySelector
                                label="Label Weight"
                                value={customization.labelWeight}
                                onChange={value => updateCustomization("labelWeight", value)}
                                type="weight"
                                options={[
                                    { value: "normal", label: "Normal", preview: "font-normal" },
                                    { value: "medium", label: "Medium", preview: "font-medium" },
                                    { value: "semibold", label: "Semibold", preview: "font-semibold" },
                                    { value: "bold", label: "Bold", preview: "font-bold" },
                                ]}
                            />
                        </div>
                    )}

                    {activeTab === "styling" && (
                        <TechnologiesStyleSelector
                            customization={customization}
                            updateCustomization={updateCustomization}

                        />
                    )}

                    {activeTab === "motion" && (
                        <AnimationSelector
                            customization={customization}
                            updateCustomization={updateCustomization}
                        />
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
                                background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})`,
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
