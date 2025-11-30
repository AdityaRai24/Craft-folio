"use client";

import React, { useState } from "react";
import { X, RotateCcw, Layout, Palette, Sparkles } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { LumenFlowHeroCustomizationState } from "@/types/hero/lumenflow";
import { ColorTheme } from "@/lib/colorThemes";
import { Switch } from "@/components/ui/switch";
import SliderControl from "@/components/VisualEditor/Shared/SliderControl";

interface LumenFlowHeroVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: LumenFlowHeroCustomizationState;
    draftCustomization: LumenFlowHeroCustomizationState | null;
    onUpdateDraft: (key: keyof LumenFlowHeroCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const LumenFlowHeroVisualEditor: React.FC<LumenFlowHeroVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();
    const [activeTab, setActiveTab] = useState<"layout" | "design" | "effects">("layout");

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
                            ? "bg-orange-500 text-white"
                            : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                            }`}
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
                    <h3 className="text-base sm:text-lg font-bold text-white">Hero Editor</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-700 flex-shrink-0">
                    {[
                        { id: "layout", icon: Layout, label: "Layout" },
                        { id: "design", icon: Palette, label: "Design" },
                        { id: "effects", icon: Sparkles, label: "Effects" },
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
                            {renderToggle("Show Profile Image", draftCustomization.showProfileImage, (v) =>
                                onUpdateDraft("showProfileImage", v)
                            )}

                            {draftCustomization.showProfileImage && (
                                <SliderControl
                                    label="Profile Image Size"
                                    value={draftCustomization.profileImageSize}
                                    onChange={(v) => onUpdateDraft("profileImageSize", v)}
                                    min={60}
                                    max={200}
                                    step={10}
                                    unit="px"
                                />
                            )}

                            <SliderControl
                                label="Sidebar Width"
                                value={draftCustomization.sidebarWidth}
                                onChange={(v) => onUpdateDraft("sidebarWidth", v)}
                                min={250}
                                max={500}
                                step={10}
                                unit="px"
                            />

                            {renderToggle("Social Links", draftCustomization.socialLinksVisible, (v) =>
                                onUpdateDraft("socialLinksVisible", v)
                            )}
                        </div>
                    )}

                    {activeTab === "design" && (
                        <div className="space-y-6">
                            {renderSelect(
                                "Name Size",
                                draftCustomization.nameSize,
                                [
                                    { value: "sm", label: "Small" },
                                    { value: "md", label: "Medium" },
                                    { value: "lg", label: "Large" },
                                    { value: "xl", label: "Extra Large" },
                                ],
                                (v) => onUpdateDraft("nameSize", v)
                            )}

                            {renderSelect(
                                "Title Size",
                                draftCustomization.titleSize,
                                [
                                    { value: "sm", label: "Small" },
                                    { value: "md", label: "Medium" },
                                    { value: "lg", label: "Large" },
                                ],
                                (v) => onUpdateDraft("titleSize", v)
                            )}

                            <div className="space-y-4 pt-4 border-t border-zinc-800">
                                <h4 className="text-sm font-semibold text-gray-400">Card Styling</h4>
                                <SliderControl
                                    label="Border Radius"
                                    value={draftCustomization.cardBorderRadius}
                                    onChange={(v) => onUpdateDraft("cardBorderRadius", v)}
                                    min={0}
                                    max={40}
                                    step={4}
                                    unit="px"
                                />
                                <SliderControl
                                    label="Padding"
                                    value={draftCustomization.cardPadding}
                                    onChange={(v) => onUpdateDraft("cardPadding", v)}
                                    min={16}
                                    max={64}
                                    step={4}
                                    unit="px"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-800">
                                <h4 className="text-sm font-semibold text-gray-400">Profile Image</h4>
                                {renderToggle("Border", draftCustomization.profileImageBorder, (v) =>
                                    onUpdateDraft("profileImageBorder", v)
                                )}
                                {draftCustomization.profileImageBorder && (
                                    <SliderControl
                                        label="Border Width"
                                        value={draftCustomization.profileImageBorderWidth}
                                        onChange={(v) => onUpdateDraft("profileImageBorderWidth", v)}
                                        min={1}
                                        max={10}
                                        step={1}
                                        unit="px"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "effects" && (
                        <div className="space-y-6">
                            {renderToggle("Gradient Overlay", draftCustomization.gradientOverlay, (v) =>
                                onUpdateDraft("gradientOverlay", v)
                            )}

                            {renderToggle("Background Blur", draftCustomization.backgroundBlur, (v) =>
                                onUpdateDraft("backgroundBlur", v)
                            )}

                            {draftCustomization.backgroundBlur && (
                                <SliderControl
                                    label="Blur Intensity"
                                    value={draftCustomization.blurIntensity}
                                    onChange={(v) => onUpdateDraft("blurIntensity", v)}
                                    min={0}
                                    max={20}
                                    step={1}
                                    unit="px"
                                />
                            )}

                            {renderToggle("Card Shadow", draftCustomization.cardShadow, (v) =>
                                onUpdateDraft("cardShadow", v)
                            )}

                            {draftCustomization.cardShadow && (
                                <SliderControl
                                    label="Shadow Intensity"
                                    value={draftCustomization.shadowIntensity}
                                    onChange={(v) => onUpdateDraft("shadowIntensity", v)}
                                    min={1}
                                    max={10}
                                    step={1}
                                />
                            )}

                            {renderToggle("Hover Effects", draftCustomization.hoverEffects, (v) =>
                                onUpdateDraft("hoverEffects", v)
                            )}

                            <SliderControl
                                label="Animation Speed"
                                value={draftCustomization.animationSpeed}
                                onChange={(v) => onUpdateDraft("animationSpeed", v)}
                                min={100}
                                max={2000}
                                step={100}
                                unit="ms"
                            />
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

export default LumenFlowHeroVisualEditor;
