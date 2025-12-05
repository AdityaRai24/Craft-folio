"use client";

import React from "react";
import { X, RotateCcw, Layout, Palette } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { BentoContactCustomization } from "@/types/bento";
import { ColorTheme } from "@/lib/colorThemes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import CardStyleSelector from "@/components/VisualEditor/Shared/CardStyleSelector";

const OptionButton = ({ selected, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={`py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 border ${selected
            ? "bg-white text-black border-white"
            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600 hover:text-zinc-300"
            }`}
    >
        {label}
    </button>
);

const SliderControl = ({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (val: number) => void }) => (
    <div className="space-y-3">
        <div className="flex justify-between text-xs">
            <span className="text-zinc-400">{label}</span>
            <span className="text-zinc-500">{value}px</span>
        </div>
        <Slider
            value={[value || 0]}
            min={min}
            max={max}
            step={step}
            onValueChange={([val]) => onChange(val)}
            className="py-1"
        />
    </div>
);

interface BentoContactVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: BentoContactCustomization;
    draftCustomization: BentoContactCustomization | null;
    onUpdateDraft: (key: keyof BentoContactCustomization, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const BentoContactVisualEditor: React.FC<BentoContactVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = React.useState<"layout" | "style">("style");

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
                    <h3 className="text-base sm:text-lg font-bold text-white">Contact Editor</h3>
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
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto p-4 space-y-6">
                    {activeTab === "layout" && (
                        <div className="space-y-4">
                            <p className="text-zinc-500 text-sm text-center py-4">No layout options available.</p>
                        </div>
                    )}

                    {activeTab === "style" && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <CardStyleSelector
                                    value={currentSettings.cardStyle}
                                    onChange={(value) => onUpdateDraft("cardStyle", value)}
                                    options={[
                                        { value: "solid", label: "Solid", preview: "bg-zinc-800 border border-zinc-700" },
                                        { value: "glass", label: "Glass", preview: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50" },
                                        { value: "neon", label: "Neon", preview: "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20" },
                                        { value: "gradient", label: "Gradient", preview: "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700" },
                                        { value: "minimal", label: "Minimal", preview: "bg-transparent border-0" },
                                    ]}
                                />
                            </div>

                            <SliderControl
                                label="Card Radius"
                                value={currentSettings.cardBorderRadius}
                                min={0}
                                max={48}
                                step={4}
                                onChange={(val: number) => onUpdateDraft("cardBorderRadius", val)}
                            />

                            <SliderControl
                                label="Card Padding"
                                value={currentSettings.cardPadding}
                                min={16}
                                max={64}
                                step={4}
                                onChange={(val: number) => onUpdateDraft("cardPadding", val)}
                            />

                            {currentSettings.cardStyle === 'gradient' && (
                                <div className="space-y-4 pt-4 border-t border-zinc-800">
                                    <Label className="text-white text-xs font-semibold uppercase tracking-wider">Gradient Colors</Label>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-xs">Start Color</Label>
                                        <Select
                                            value={currentSettings.gradientFrom}
                                            onValueChange={(value) => onUpdateDraft("gradientFrom", value)}
                                        >
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                                                <SelectValue placeholder="Select color" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectItem value="blue-600">Blue</SelectItem>
                                                <SelectItem value="purple-600">Purple</SelectItem>
                                                <SelectItem value="green-600">Green</SelectItem>
                                                <SelectItem value="orange-600">Orange</SelectItem>
                                                <SelectItem value="pink-600">Pink</SelectItem>
                                                <SelectItem value="red-600">Red</SelectItem>
                                                <SelectItem value="indigo-600">Indigo</SelectItem>
                                                <SelectItem value="cyan-600">Cyan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-xs">End Color</Label>
                                        <Select
                                            value={currentSettings.gradientTo}
                                            onValueChange={(value) => onUpdateDraft("gradientTo", value)}
                                        >
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                                                <SelectValue placeholder="Select color" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectItem value="blue-600">Blue</SelectItem>
                                                <SelectItem value="purple-600">Purple</SelectItem>
                                                <SelectItem value="green-600">Green</SelectItem>
                                                <SelectItem value="orange-600">Orange</SelectItem>
                                                <SelectItem value="pink-600">Pink</SelectItem>
                                                <SelectItem value="red-600">Red</SelectItem>
                                                <SelectItem value="indigo-600">Indigo</SelectItem>
                                                <SelectItem value="cyan-600">Cyan</SelectItem>
                                            </SelectContent>
                                        </Select>
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

export default BentoContactVisualEditor;
