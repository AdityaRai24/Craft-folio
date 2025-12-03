"use client";

import React, { useState } from "react";
import { X, RotateCcw, Layout, Palette, Type } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { AcademicHeroCustomization } from "@/types/academic/hero";
import { ColorTheme } from "@/lib/colorThemes";
import TypographySelector from "@/components/VisualEditor/Shared/TypographySelector";

interface AcademicHeroVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: AcademicHeroCustomization;
    draftCustomization: AcademicHeroCustomization | null;
    onUpdateDraft: (key: keyof AcademicHeroCustomization, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const AcademicHeroVisualEditor: React.FC<AcademicHeroVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = useState<"design" | "typography">("design");

    if (!isOpen || !draftCustomization) return null;

    return (
        <>
            <div
                ref={dragRef}
                className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden flex flex-col"
                style={{
                    left: `${windowPosition.x}px`,
                    top: `${windowPosition.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800 flex-shrink-0"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-base sm:text-lg font-bold text-white">Hero Editor</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-700 flex-shrink-0">
                    {[
                        { id: "design", icon: Palette, label: "Design" },
                        { id: "typography", icon: Type, label: "Typography" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors flex flex-col items-center gap-1 ${activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white hover:bg-zinc-800"
                                }`}
                            style={
                                activeTab === tab.id
                                    ? { background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }
                                    : {}
                            }
                        >
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {activeTab === "design" && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Background Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={draftCustomization.backgroundColor || "#ffffff"}
                                        onChange={(e) => onUpdateDraft("backgroundColor", e.target.value)}
                                        className="w-10 h-10 rounded cursor-pointer border-none"
                                    />
                                    <input
                                        type="text"
                                        value={draftCustomization.backgroundColor || "#ffffff"}
                                        onChange={(e) => onUpdateDraft("backgroundColor", e.target.value)}
                                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 text-white text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Text Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={draftCustomization.textColor || "#1a202c"}
                                        onChange={(e) => onUpdateDraft("textColor", e.target.value)}
                                        className="w-10 h-10 rounded cursor-pointer border-none"
                                    />
                                    <input
                                        type="text"
                                        value={draftCustomization.textColor || "#1a202c"}
                                        onChange={(e) => onUpdateDraft("textColor", e.target.value)}
                                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 text-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "typography" && (
                        <div className="space-y-6">
                            <TypographySelector
                                label="Font Family"
                                value={draftCustomization.fontFamily || "Merriweather, serif"}
                                onChange={(v) => onUpdateDraft("fontFamily", v)}
                                type="weight" // Using weight type for text preview
                                options={[
                                    { value: "Merriweather, serif", label: "Serif", preview: "font-serif" },
                                    { value: "Inter, sans-serif", label: "Sans", preview: "font-sans" },
                                    { value: "monospace", label: "Mono", preview: "font-mono" },
                                ]}
                            />

                            <div className="border-t border-zinc-700 pt-4 space-y-4">
                                <TypographySelector
                                    label="Title Size"
                                    value={draftCustomization.titleSize || "4xl"}
                                    onChange={(v) => onUpdateDraft("titleSize", v)}
                                    type="size"
                                    options={[
                                        { value: "3xl", label: "Large", preview: "text-3xl" },
                                        { value: "4xl", label: "X-Large", preview: "text-4xl" },
                                        { value: "5xl", label: "2X-Large", preview: "text-5xl" },
                                        { value: "6xl", label: "3X-Large", preview: "text-6xl" },
                                    ]}
                                />
                                <TypographySelector
                                    label="Title Weight"
                                    value={draftCustomization.titleWeight || "bold"}
                                    onChange={(v) => onUpdateDraft("titleWeight", v)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "font-normal" },
                                        { value: "medium", label: "Medium", preview: "font-medium" },
                                        { value: "bold", label: "Bold", preview: "font-bold" },
                                        { value: "extrabold", label: "Extra Bold", preview: "font-extrabold" },
                                    ]}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4 space-y-4">
                                <TypographySelector
                                    label="Summary Size"
                                    value={draftCustomization.summarySize || "lg"}
                                    onChange={(v) => onUpdateDraft("summarySize", v)}
                                    type="size"
                                    options={[
                                        { value: "base", label: "Base", preview: "text-base" },
                                        { value: "lg", label: "Large", preview: "text-lg" },
                                        { value: "xl", label: "X-Large", preview: "text-xl" },
                                    ]}
                                />
                                <TypographySelector
                                    label="Summary Weight"
                                    value={draftCustomization.summaryWeight || "normal"}
                                    onChange={(v) => onUpdateDraft("summaryWeight", v)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "font-normal" },
                                        { value: "medium", label: "Medium", preview: "font-medium" },
                                        { value: "bold", label: "Bold", preview: "font-bold" },
                                    ]}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4 space-y-4">
                                <TypographySelector
                                    label="Line Height"
                                    value={draftCustomization.lineHeight || "relaxed"}
                                    onChange={(v) => onUpdateDraft("lineHeight", v)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "leading-normal" },
                                        { value: "relaxed", label: "Relaxed", preview: "leading-relaxed" },
                                        { value: "loose", label: "Loose", preview: "leading-loose" },
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 border-t border-zinc-700 bg-zinc-800 flex-shrink-0">
                    <div className="flex gap-2">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1 flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors justify-center"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </button>
                        <button
                            onClick={onSave}
                            className="flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm text-white rounded transition-colors font-medium"
                            style={{ background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
        </>
    );
};

export default AcademicHeroVisualEditor;
