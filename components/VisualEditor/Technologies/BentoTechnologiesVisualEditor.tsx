"use client";

import React from "react";
import { X, RotateCcw, Layout, Palette } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { BentoTechnologiesCustomization } from "@/types/bento";
import { ColorTheme } from "@/lib/colorThemes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SliderControl from "../Shared/SliderControl";
import CardStyleSelector from "../Shared/CardStyleSelector";

interface BentoTechnologiesVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: BentoTechnologiesCustomization;
    draftCustomization: BentoTechnologiesCustomization | null;
    onUpdateDraft: (key: keyof BentoTechnologiesCustomization, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const OptionButton = ({
    selected,
    onClick,
    label,
    preview
}: {
    selected: boolean;
    onClick: () => void;
    label: string;
    preview?: React.ReactNode
}) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 gap-2 ${selected
            ? "border-white bg-zinc-700"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-800"
            }`}
    >
        {preview}
        <span className="text-xs font-medium text-white">{label}</span>
    </button>
);

const BentoTechnologiesVisualEditor: React.FC<BentoTechnologiesVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = React.useState<"layout" | "style">("layout");

    if (!isOpen) return null;

    const currentSettings = draftCustomization || customization;

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
                    <h3 className="text-base sm:text-lg font-bold text-white">Tech Editor</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-zinc-700">
                    <button
                        onClick={() => setActiveTab("layout")}
                        className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === "layout" ? "text-white" : "text-gray-400 hover:text-white"
                            }`}
                        style={{
                            background: activeTab === "layout" ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                        }}
                    >
                        <Layout className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                        Layout
                    </button>
                    <button
                        onClick={() => setActiveTab("style")}
                        className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${activeTab === "style" ? "text-white" : "text-gray-400 hover:text-white"
                            }`}
                        style={{
                            background: activeTab === "style" ? `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` : "transparent",
                        }}
                    >
                        <Palette className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                        Style
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {activeTab === "layout" && (
                        <div className="space-y-6">
                            {/* Show Icons Toggle */}
                            <div className="flex items-center justify-between">
                                <Label className="text-white">Show Icons</Label>
                                <Switch
                                    checked={currentSettings.showIcons ?? true}
                                    onCheckedChange={(checked) => onUpdateDraft("showIcons", checked)}
                                />
                            </div>

                            <SliderControl
                                label="Icon Size"
                                value={currentSettings.iconSize}
                                min={20}
                                max={100}
                                step={4}
                                onChange={(val) => onUpdateDraft("iconSize", val)}
                            />

                            <SliderControl
                                label="Grid Gap"
                                value={currentSettings.gap}
                                min={8}
                                max={48}
                                step={4}
                                onChange={(val) => onUpdateDraft("gap", val)}
                            />

                            <SliderControl
                                label="Card Padding"
                                value={currentSettings.cardPadding}
                                min={8}
                                max={48}
                                step={4}
                                onChange={(val) => onUpdateDraft("cardPadding", val)}
                            />
                        </div>
                    )}

                    {activeTab === "style" && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-white">Card Style</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <OptionButton
                                        selected={currentSettings.cardStyle === "glass"}
                                        onClick={() => onUpdateDraft("cardStyle", "glass")}
                                        label="Glass"
                                        preview={<div className="w-full h-8 bg-zinc-800/50 backdrop-blur-sm border border-white/10 rounded" />}
                                    />
                                    <OptionButton
                                        selected={currentSettings.cardStyle === "solid"}
                                        onClick={() => onUpdateDraft("cardStyle", "solid")}
                                        label="Solid"
                                        preview={<div className="w-full h-8 bg-zinc-800 border border-zinc-700 rounded" />}
                                    />
                                    <OptionButton
                                        selected={currentSettings.cardStyle === "neon"}
                                        onClick={() => onUpdateDraft("cardStyle", "neon")}
                                        label="Neon"
                                        preview={<div className="w-full h-8 bg-black border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] rounded" />}
                                    />
                                    <OptionButton
                                        selected={currentSettings.cardStyle === "gradient"}
                                        onClick={() => onUpdateDraft("cardStyle", "gradient")}
                                        label="Gradient"
                                        preview={<div className="w-full h-8 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded" />}
                                    />
                                    <OptionButton
                                        selected={currentSettings.cardStyle === "minimal"}
                                        onClick={() => onUpdateDraft("cardStyle", "minimal")}
                                        label="Minimal"
                                        preview={<div className="w-full h-8 border border-zinc-800 rounded" />}
                                    />
                                </div>
                            </div>

                            <SliderControl
                                label="Card Radius"
                                value={currentSettings.cardBorderRadius}
                                min={0}
                                max={48}
                                step={4}
                                onChange={(val) => onUpdateDraft("cardBorderRadius", val)}
                            />

                            {currentSettings.cardStyle === 'solid' && (
                                <div className="space-y-3">
                                    <Label className="text-white">Background Color</Label>
                                    <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-600 shadow-sm">
                                            <input
                                                type="color"
                                                value={currentSettings.cardBackground.startsWith('#') ? currentSettings.cardBackground : '#18181b'}
                                                onChange={(e) => onUpdateDraft("cardBackground", e.target.value)}
                                                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-400">Hex Code</span>
                                            <span className="text-sm font-mono text-white uppercase">
                                                {currentSettings.cardBackground.startsWith('#') ? currentSettings.cardBackground : 'Default'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
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

            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={onClose}
            />
        </>
    );
};

export default BentoTechnologiesVisualEditor;
