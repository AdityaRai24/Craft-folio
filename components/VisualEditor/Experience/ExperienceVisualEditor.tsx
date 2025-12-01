"use client";

import React from "react";
import {
    Palette,
    Layout, RotateCcw,
    X,
    Type,
    Clock
} from "lucide-react";
import CardStyleSelector from "../Shared/CardStyleSelector";
import TimelineSelector from "./TimelineSelector";
import TechStackStyleSelector from "../Shared/TechStackStyleSelector";
import SliderControl from "../Shared/SliderControl";
import TypographySelector from "../Shared/TypographySelector";
import { useDraggable } from "@/hooks/useDraggable";
import { ExperienceCustomizationState } from "@/types/experience/portfolio";
import { ColorTheme } from "@/lib/colorThemes";

interface ExperienceVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: ExperienceCustomizationState;
    draftCustomization: ExperienceCustomizationState | null;
    onUpdateDraft: (key: keyof ExperienceCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    activeTab: "layout" | "typography" | "styling" | "timing";
    onTabChange: (tab: "layout" | "typography" | "styling" | "timing") => void;
    primaryColor?: string;
    primaryDarkColor?: string;
    showTimelineControls?: boolean;
}

const ExperienceVisualEditor: React.FC<ExperienceVisualEditorProps> = ({
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
    showTimelineControls = true,
}) => {
    const { isDragging, position: windowPosition, dragRef, handleMouseDown } = useDraggable();

    if (!isOpen || !draftCustomization) return null;

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
                    {["layout", "typography", "styling", "timing"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab as any)}
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
                                value={draftCustomization?.cardLayout ?? customization.cardLayout}
                                onChange={(value) => onUpdateDraft("cardLayout", value)}
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

                            {showTimelineControls && (
                                <TimelineSelector
                                    styleValue={draftCustomization?.timelineStyle ?? customization.timelineStyle}
                                    onStyleChange={value => onUpdateDraft("timelineStyle", value)}
                                    positionValue={(draftCustomization?.timelinePosition ?? customization.timelinePosition) as any}
                                    onPositionChange={value => onUpdateDraft("timelinePosition", value)}
                                    dotStyleValue={draftCustomization?.dotStyle ?? customization.dotStyle}
                                    onDotStyleChange={value => onUpdateDraft("dotStyle", value)}
                                    primaryColor={primaryColor}
                                />
                            )}
                        </>
                    )}

                    {activeTab === "typography" && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <TypographySelector
                                    label="Role Size"
                                    value={draftCustomization?.roleSize ?? customization.roleSize}
                                    onChange={value => onUpdateDraft("roleSize", value)}
                                    type="size"
                                    options={[
                                        { value: "sm", label: "Small", preview: "text-lg" },
                                        { value: "md", label: "Medium", preview: "text-xl" },
                                        { value: "lg", label: "Large", preview: "text-2xl" },
                                        { value: "xl", label: "Extra Large", preview: "text-3xl" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                                <TypographySelector
                                    label="Role Weight"
                                    value={draftCustomization?.roleWeight ?? customization.roleWeight}
                                    onChange={value => onUpdateDraft("roleWeight", value)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "font-normal" },
                                        { value: "medium", label: "Medium", preview: "font-medium" },
                                        { value: "semibold", label: "Semibold", preview: "font-semibold" },
                                        { value: "bold", label: "Bold", preview: "font-bold" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4 space-y-4">
                                <TypographySelector
                                    label="Company Name Size"
                                    value={draftCustomization?.companyNameSize ?? customization.companyNameSize}
                                    onChange={value => onUpdateDraft("companyNameSize", value)}
                                    type="size"
                                    options={[
                                        { value: "sm", label: "Small", preview: "text-base" },
                                        { value: "md", label: "Medium", preview: "text-lg" },
                                        { value: "lg", label: "Large", preview: "text-xl" },
                                        { value: "xl", label: "Extra Large", preview: "text-2xl" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                                <TypographySelector
                                    label="Company Name Weight"
                                    value={draftCustomization?.companyNameWeight ?? customization.companyNameWeight}
                                    onChange={value => onUpdateDraft("companyNameWeight", value)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "font-normal" },
                                        { value: "medium", label: "Medium", preview: "font-medium" },
                                        { value: "semibold", label: "Semibold", preview: "font-semibold" },
                                        { value: "bold", label: "Bold", preview: "font-bold" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4 space-y-4">
                                <TypographySelector
                                    label="Date Size"
                                    value={draftCustomization?.dateSize ?? customization.dateSize ?? "sm"}
                                    onChange={value => onUpdateDraft("dateSize", value)}
                                    type="size"
                                    options={[
                                        { value: "sm", label: "Small", preview: "text-xs" },
                                        { value: "md", label: "Medium", preview: "text-sm" },
                                        { value: "lg", label: "Large", preview: "text-base" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                                <TypographySelector
                                    label="Date Weight"
                                    value={draftCustomization?.dateWeight ?? customization.dateWeight ?? "medium"}
                                    onChange={value => onUpdateDraft("dateWeight", value)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "font-normal" },
                                        { value: "medium", label: "Medium", preview: "font-medium" },
                                        { value: "semibold", label: "Semibold", preview: "font-semibold" },
                                        { value: "bold", label: "Bold", preview: "font-bold" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4 space-y-4">
                                <TypographySelector
                                    label="Location Size"
                                    value={draftCustomization?.locationSize ?? customization.locationSize ?? "sm"}
                                    onChange={value => onUpdateDraft("locationSize", value)}
                                    type="size"
                                    options={[
                                        { value: "sm", label: "Small", preview: "text-xs" },
                                        { value: "md", label: "Medium", preview: "text-sm" },
                                        { value: "lg", label: "Large", preview: "text-base" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                                <TypographySelector
                                    label="Location Weight"
                                    value={draftCustomization?.locationWeight ?? customization.locationWeight ?? "normal"}
                                    onChange={value => onUpdateDraft("locationWeight", value)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "font-normal" },
                                        { value: "medium", label: "Medium", preview: "font-medium" },
                                        { value: "semibold", label: "Semibold", preview: "font-semibold" },
                                        { value: "bold", label: "Bold", preview: "font-bold" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                            </div>

                            <div className="border-t border-zinc-700 pt-4 space-y-4">
                                <TypographySelector
                                    label="Description Text Size"
                                    value={draftCustomization?.descriptionTextSize ?? customization.descriptionTextSize}
                                    onChange={value => onUpdateDraft("descriptionTextSize", value)}
                                    type="size"
                                    options={[
                                        { value: "sm", label: "Small", preview: "text-sm" },
                                        { value: "md", label: "Medium", preview: "text-base" },
                                        { value: "lg", label: "Large", preview: "text-lg" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                                <TypographySelector
                                    label="Description Text Weight"
                                    value={draftCustomization?.descriptionTextWeight ?? customization.descriptionTextWeight ?? "normal"}
                                    onChange={value => onUpdateDraft("descriptionTextWeight", value)}
                                    type="weight"
                                    options={[
                                        { value: "normal", label: "Normal", preview: "font-normal" },
                                        { value: "medium", label: "Medium", preview: "font-medium" },
                                        { value: "semibold", label: "Semibold", preview: "font-semibold" },
                                        { value: "bold", label: "Bold", preview: "font-bold" },
                                    ]}
                                    primaryColor={primaryColor}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "styling" && (
                        <>
                            {typeof (draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius) === 'number' && (
                                <SliderControl
                                    label="Card Border Radius"
                                    value={(draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius) as number}
                                    onChange={value => onUpdateDraft("cardBorderRadius", value)}
                                    min={0}
                                    max={32}
                                    step={2}
                                />
                            )}

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

                            <TechStackStyleSelector
                                value={draftCustomization?.techStackStyle ?? customization.techStackStyle}
                                onChange={value => onUpdateDraft("techStackStyle", value)}
                            />
                        </>
                    )}

                    {activeTab === "timing" && (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Stagger Animation</span>
                                <input
                                    type="checkbox"
                                    checked={draftCustomization?.staggerAnimation ?? customization.staggerAnimation}
                                    onChange={e => onUpdateDraft("staggerAnimation", e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                                />
                            </div>

                            <SliderControl
                                label="Animation Speed (ms)"
                                value={typeof (draftCustomization?.animationSpeed ?? customization.animationSpeed) === 'number' ? (draftCustomization?.animationSpeed ?? customization.animationSpeed) as number : 500}
                                onChange={value => onUpdateDraft("animationSpeed", value)}
                                min={100}
                                max={1000}
                                step={50}
                            />
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

export default ExperienceVisualEditor;
