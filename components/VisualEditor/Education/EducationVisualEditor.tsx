"use client";

import React from "react";
import {
    Palette,
    Layout,
    RotateCcw,
    X,
    Type,
    Clock,
    Eye,
} from "lucide-react";
import SideAccentSelector from "../Experience/SideAccentSelector";
import AlignmentSelector from "../Shared/AlignmentSelector";
import SliderControl from "../Shared/SliderControl";
import TypographySelector from "../Shared/TypographySelector";
import { useDraggable } from "@/hooks/useDraggable";
import { EducationCustomizationState } from "@/types/interfaces/EducationCustomizationState";
import { ColorTheme } from "@/lib/colorThemes";
import { Switch } from "@/components/ui/switch";
import CardStyleSelector from "../Shared/CardStyleSelector";

interface EducationVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: EducationCustomizationState;
    draftCustomization: EducationCustomizationState | null;
    onUpdateDraft: (key: keyof EducationCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    activeTab: "layout" | "typography" | "styling" | "timing";
    onTabChange: (tab: "layout" | "typography" | "styling" | "timing") => void;
    primaryColor?: string;
    primaryDarkColor?: string;
    showLayoutTab?: boolean;
    showStylingTab?: boolean;
    showTimingTab?: boolean;
}

const EducationVisualEditor: React.FC<EducationVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    draftCustomization,
    onUpdateDraft,
    onSave,
    onReset,
    activeTab,
    onTabChange,
    primaryColor = ColorTheme.primary,
    primaryDarkColor = ColorTheme.primaryDark,
    showLayoutTab = true,
    showStylingTab = true,
    showTimingTab = true,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();

    if (!isOpen || !draftCustomization) return null;

    const tabs = [
        showLayoutTab && "layout",
        "typography",
        showStylingTab && "styling",
        showTimingTab && "timing"
    ].filter(Boolean) as ("layout" | "typography" | "styling" | "timing")[];

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
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
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
                            {tab === "timing" && <Clock className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
                            <span className="hidden sm:inline">{tab}</span>
                            <span className="sm:hidden">{tab.charAt(0)}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
                    {activeTab === "layout" && (
                        <>
                            <CardStyleSelector
                                value={draftCustomization?.cardStyle ?? customization.cardStyle}
                                onChange={(value) => onUpdateDraft("cardStyle", value)}
                                primaryColor={primaryColor}
                            />

                            <SliderControl
                                label="Card Spacing"
                                value={draftCustomization?.cardSpacing ?? customization.cardSpacing}
                                onChange={value => onUpdateDraft("cardSpacing", value)}
                                min={0}
                                max={64}
                                step={4}
                            />

                            <AlignmentSelector
                                value={draftCustomization?.textAlignment ?? customization.textAlignment}
                                onChange={value => onUpdateDraft("textAlignment", value)}
                            />

                            <div className="space-y-3 pt-4 border-t border-zinc-700">
                                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                    <Eye className="h-4 w-4" /> Visibility
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Institution</span>
                                    <Switch
                                        checked={draftCustomization?.showInstitution ?? customization.showInstitution}
                                        onCheckedChange={checked => onUpdateDraft("showInstitution", checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Dates</span>
                                    <Switch
                                        checked={draftCustomization?.showDates ?? customization.showDates}
                                        onCheckedChange={checked => onUpdateDraft("showDates", checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Location</span>
                                    <Switch
                                        checked={draftCustomization?.showLocation ?? customization.showLocation}
                                        onCheckedChange={checked => onUpdateDraft("showLocation", checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Description</span>
                                    <Switch
                                        checked={draftCustomization?.showDescription ?? customization.showDescription}
                                        onCheckedChange={checked => onUpdateDraft("showDescription", checked)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "typography" && (
                        <div className="space-y-6">
                            <TypographySelector
                                label="Title Size"
                                value={draftCustomization?.titleSize ?? customization.titleSize}
                                onChange={value => onUpdateDraft("titleSize", value)}
                                type="size"
                                options={[
                                    { value: "sm", label: "Small", preview: "0.875rem" },
                                    { value: "md", label: "Medium", preview: "1rem" },
                                    { value: "lg", label: "Large", preview: "1.125rem" },
                                    { value: "xl", label: "Extra Large", preview: "1.25rem" },
                                ]}
                            />

                            <TypographySelector
                                label="Title Weight"
                                value={draftCustomization?.titleWeight ?? customization.titleWeight}
                                onChange={value => onUpdateDraft("titleWeight", value)}
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
                        <>
                            <SliderControl
                                label="Card Border Radius"
                                value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                                onChange={value => onUpdateDraft("cardBorderRadius", value)}
                                min={0}
                                max={32}
                                step={2}
                            />

                            <SliderControl
                                label="Card Padding"
                                value={draftCustomization?.cardPadding ?? customization.cardPadding}
                                onChange={value => onUpdateDraft("cardPadding", value)}
                                min={0}
                                max={48}
                                step={4}
                            />

                            <SliderControl
                                label="Border Width"
                                value={draftCustomization?.borderWidth ?? customization.borderWidth}
                                onChange={value => onUpdateDraft("borderWidth", value)}
                                min={0}
                                max={4}
                                step={1}
                            />

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Hover Effects</span>
                                <Switch
                                    checked={draftCustomization?.hoverEffects ?? customization.hoverEffects}
                                    onCheckedChange={checked => onUpdateDraft("hoverEffects", checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Glow Effect</span>
                                <Switch
                                    checked={draftCustomization?.glowEffect ?? customization.glowEffect}
                                    onCheckedChange={checked => onUpdateDraft("glowEffect", checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Card Shadow</span>
                                <Switch
                                    checked={draftCustomization?.cardShadow ?? customization.cardShadow}
                                    onCheckedChange={checked => onUpdateDraft("cardShadow", checked)}
                                />
                            </div>

                            <SideAccentSelector
                                isVisible={draftCustomization?.accentLine ?? customization.accentLine}
                                onVisibilityChange={value => onUpdateDraft("accentLine", value)}
                                width={draftCustomization?.accentLineWidth ?? customization.accentLineWidth}
                                onWidthChange={value => onUpdateDraft("accentLineWidth", value)}
                                color={draftCustomization?.accentLineColor ?? customization.accentLineColor}
                                onColorChange={value => onUpdateDraft("accentLineColor", value)}
                            />
                        </>
                    )}

                    {activeTab === "timing" && (
                        <>
                            <SliderControl
                                label="Animation Speed"
                                value={draftCustomization?.animationSpeed ?? customization.animationSpeed}
                                onChange={value => onUpdateDraft("animationSpeed", value)}
                                min={100}
                                max={1000}
                                step={50}
                            />
                            <SliderControl
                                label="Stagger Delay"
                                value={draftCustomization?.staggerDelay ?? customization.staggerDelay}
                                onChange={value => onUpdateDraft("staggerDelay", value)}
                                min={0}
                                max={500}
                                step={50}
                            />
                        </>
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

export default EducationVisualEditor;
