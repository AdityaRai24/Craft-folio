"use client";
import React, { useState } from "react";
import {
    Layout,
    RotateCcw,
    X,
    Maximize
} from "lucide-react";
import SliderControl from "../Shared/SliderControl";
import { useDraggable } from "@/hooks/useDraggable";
import { CanvasCustomization } from "@/types/canvas";
import { ColorTheme } from "@/lib/colorThemes";

interface CanvasVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: CanvasCustomization;
    onUpdate: (key: keyof CanvasCustomization, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const CanvasVisualEditor: React.FC<CanvasVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    onUpdate,
    onSave,
    onReset
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = useState<"layout">("layout");

    if (!isOpen) return null;

    const getWidthValue = () => {
        if (customization.maxWidth === "100%") return 100;
        const match = customization.maxWidth.match(/(\d+)%/);
        if (match) return parseInt(match[1]);
        return 100;
    };

    const handleWidthChange = (value: number) => {
        onUpdate("maxWidth", `${value}%`);
    };

    // Primary color for accents - FIXED to ensure consistent editor look
    const primaryColor = "#10b981"; // Emerald-500
    const primaryDarkColor = "#047857"; // Emerald-700

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
                    <h3 className="text-base sm:text-lg font-bold text-white">Canvas Editor</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-zinc-700">
                    {["layout"].map((tab) => (
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
                            <span className="hidden sm:inline">{tab}</span>
                            <span className="sm:hidden">{tab.charAt(0)}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
                    {activeTab === "layout" && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium text-gray-300">Show Navbar</label>
                                    <p className="text-xs text-gray-500">Toggle top navigation bar</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={customization.navbarVisible}
                                    onChange={(e) => onUpdate("navbarVisible", e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-zinc-700 focus:ring-2 focus:ring-offset-0"
                                    style={{ accentColor: primaryColor }}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4">
                                <SliderControl
                                    label="Content Width"
                                    value={getWidthValue()}
                                    onChange={handleWidthChange}
                                    min={50}
                                    max={100}
                                    step={5}
                                    unit="%"
                                    accentColor={primaryColor}
                                />
                                <p className="text-xs text-zinc-500 mt-1">
                                    Adjust the maximum width of the content area.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 border-t border-zinc-700 bg-zinc-800 flex justify-between gap-3">
                    <button
                        onClick={onReset}
                        className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                        title="Reset to Defaults"
                    >
                        <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={onClose}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-md transition-colors shadow-sm"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})`,
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={onClose}
            />
        </>
    );
};

export default CanvasVisualEditor;
