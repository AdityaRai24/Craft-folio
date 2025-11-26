"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, LayoutGrid, Palette, Type, Move } from "lucide-react";
import { TechnologiesCustomizationState } from "@/types/technologies/portfolio";
import { LayoutSelector } from "./LayoutSelector";
import { StyleSelector } from "./StyleSelector";
import { TypographySelector } from "./TypographySelector";
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
}

export const TechnologiesVisualEditor: React.FC<TechnologiesVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    updateCustomization,
    onSave,
    onReset,
}) => {
    const [activeTab, setActiveTab] = useState<"layout" | "style" | "typography" | "animation">("layout");
    const dragRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDraggable({ x: 20, y: 80 });

    if (!isOpen) return null;

    const tabs = [
        { id: "layout", label: "Layout", icon: LayoutGrid },
        { id: "style", label: "Style", icon: Palette },
        { id: "typography", label: "Text", icon: Type },
        { id: "animation", label: "Motion", icon: Move },
    ];

    return (
        <div
            ref={dragRef}
            className="fixed z-[9999] w-[360px] bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700 flex flex-col overflow-hidden"
            style={{
                left: position.x,
                top: position.y,
                maxHeight: "85vh",
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700 cursor-move"
                onMouseDown={handleMouseDown}
            >
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <Palette size={16} className="text-green-400" />
                    Technologies Editor
                </h3>
                <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-700 bg-zinc-800/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all relative ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <Icon size={18} className="mb-1" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
                            {isActive && (
                                <div
                                    className="absolute bottom-0 left-0 w-full h-0.5"
                                    style={{ background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {activeTab === "layout" && (
                    <LayoutSelector
                        customization={customization}
                        updateCustomization={updateCustomization}
                    />
                )}
                {activeTab === "style" && (
                    <StyleSelector
                        customization={customization}
                        updateCustomization={updateCustomization}
                    />
                )}
                {activeTab === "typography" && (
                    <TypographySelector
                        customization={customization}
                        updateCustomization={updateCustomization}
                    />
                )}
                {activeTab === "animation" && (
                    <AnimationSelector
                        customization={customization}
                        updateCustomization={updateCustomization}
                    />
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-700 bg-zinc-800 flex gap-3">
                <button
                    onClick={onReset}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={onSave}
                    className="flex-1 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    style={{
                        background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    }}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};
