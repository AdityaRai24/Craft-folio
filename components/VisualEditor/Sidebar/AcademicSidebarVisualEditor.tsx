"use client";

import React, { useState } from "react";
import { X, RotateCcw, Layout, Palette, Type, Settings } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { SidebarCustomizationState } from "@/types/interfaces/SidebarCustomizationState";
import { ColorTheme } from "@/lib/colorThemes";
import { Switch } from "@/components/ui/switch";
import SliderControl from "@/components/VisualEditor/Shared/SliderControl";

interface AcademicSidebarVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: SidebarCustomizationState;
    draftCustomization: SidebarCustomizationState | null;
    onUpdateDraft: (key: keyof SidebarCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const AcademicSidebarVisualEditor: React.FC<AcademicSidebarVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = useState<"layout" | "design" | "content">("layout");

    if (!isOpen || !draftCustomization) return null;

    const renderToggle = (label: string, value: boolean, onChange: (value: boolean) => void) => (
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <Switch checked={value} onCheckedChange={onChange} />
        </div>
    );

    const renderSelect = (
        label: string,
        value: string,
        options: { value: string; label: string }[],
        onChange: (value: string) => void
    ) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="grid grid-cols-2 gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${value === option.value
                            ? "text-white"
                            : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                            }`}
                        style={
                            value === option.value
                                ? { background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})` }
                                : {}
                        }
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );

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
                    <h3 className="text-base sm:text-lg font-bold text-white">Sidebar Editor</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-700 flex-shrink-0">
                    {[
                        { id: "layout", icon: Layout, label: "Layout" },
                        { id: "design", icon: Palette, label: "Design" },
                        { id: "content", icon: Settings, label: "Content" },
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
                    {activeTab === "layout" && (
                        <div className="space-y-6">
                            <SliderControl
                                label="Sidebar Width"
                                value={parseInt(draftCustomization.width)}
                                onChange={(v) => onUpdateDraft("width", `${v}px`)}
                                min={200}
                                max={400}
                                step={10}
                                unit="px"
                            />

                            {renderSelect(
                                "Alignment",
                                draftCustomization.alignment,
                                [
                                    { value: "left", label: "Left" },
                                    { value: "right", label: "Right" },
                                ],
                                (v) => onUpdateDraft("alignment", v)
                            )}
                        </div>
                    )}

                    {activeTab === "design" && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Background Color</label>
                                <input
                                    type="color"
                                    value={draftCustomization.backgroundColor}
                                    onChange={(e) => onUpdateDraft("backgroundColor", e.target.value)}
                                    className="w-full h-10 rounded-md cursor-pointer bg-transparent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Text Color</label>
                                <input
                                    type="color"
                                    value={draftCustomization.textColor}
                                    onChange={(e) => onUpdateDraft("textColor", e.target.value)}
                                    className="w-full h-10 rounded-md cursor-pointer bg-transparent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Border Color</label>
                                <input
                                    type="color"
                                    value={draftCustomization.borderColor}
                                    onChange={(e) => onUpdateDraft("borderColor", e.target.value)}
                                    className="w-full h-10 rounded-md cursor-pointer bg-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "content" && (
                        <div className="space-y-6">
                            {renderToggle("Show Profile Image", draftCustomization.showProfileImage, (v) =>
                                onUpdateDraft("showProfileImage", v)
                            )}

                            {draftCustomization.showProfileImage && (
                                <SliderControl
                                    label="Profile Image Size"
                                    value={draftCustomization.profileImageSize}
                                    onChange={(v) => onUpdateDraft("profileImageSize", v)}
                                    min={80}
                                    max={200}
                                    step={10}
                                    unit="px"
                                />
                            )}

                            {renderToggle("Show Name", draftCustomization.showName, (v) =>
                                onUpdateDraft("showName", v)
                            )}

                            {renderToggle("Show Title", draftCustomization.showTitle, (v) =>
                                onUpdateDraft("showTitle", v)
                            )}

                            {renderToggle("Show Social Links", draftCustomization.showSocialLinks, (v) =>
                                onUpdateDraft("showSocialLinks", v)
                            )}

                            {renderToggle("Show Download Button", draftCustomization.showDownloadButton, (v) =>
                                onUpdateDraft("showDownloadButton", v)
                            )}

                            {renderToggle("Show Footer", draftCustomization.showFooter, (v) =>
                                onUpdateDraft("showFooter", v)
                            )}
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

export default AcademicSidebarVisualEditor;
