"use client";

import React from "react";
import {
    X,
    Grid3X3,
    Palette,
    RotateCcw,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ContactCustomizationState } from "@/types/contact/portfolio";
import { useDraggable } from "@/hooks/useDraggable";
import { ColorTheme } from "@/lib/colorThemes";

// Import all selector components
import GridColumnsSelector from "./GridColumnsSelector";
import CardLayoutSelector from "./CardLayoutSelector";
import WidthSelector from "./WidthSelector";
import SpacingSelector from "./SpacingSelector";
import AlignmentSelector from "./AlignmentSelector";
import CardStyleSelector from "./CardStyleSelector";
import IconStyleSelector from "./IconStyleSelector";
import SliderControl from "./SliderControl";

interface ContactVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: ContactCustomizationState;
    draftCustomization: ContactCustomizationState | null;
    onUpdateDraft: (key: keyof ContactCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    activeTab: "layout" | "styling";
    onTabChange: (tab: "layout" | "styling") => void;
    primaryColor?: string;
    primaryDarkColor?: string;
}

export const ContactVisualEditor: React.FC<ContactVisualEditorProps> = ({
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
}) => {
    const { dragRef, isDragging, position: windowPosition, handleMouseDown } = useDraggable({
        x: 100,
        y: 100,
    });

    // Helper function to get theme-based button style
    const getThemeButtonStyle = (isActive: boolean) => {
        if (isActive) {
            return {
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})`,
                color: 'white'
            };
        }
        return {};
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Floating Visual Editor Window */}
            <div
                ref={dragRef}
                className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-96 max-h-[80vh] overflow-hidden"
                style={{
                    left: `${windowPosition.x}px`,
                    top: `${windowPosition.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-lg font-bold text-white">Contact Settings</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-zinc-700">
                    {["layout", "styling"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab as any)}
                            className={`flex-1 py-2 px-2 text-xs capitalize transition-colors ${activeTab === tab
                                ? "text-white"
                                : "text-gray-400 hover:text-white hover:bg-zinc-800"
                                }`}
                            style={getThemeButtonStyle(activeTab === tab)}
                        >
                            {tab === "layout" && (
                                <Grid3X3 className="h-3 w-3 mx-auto mb-1" />
                            )}
                            {tab === "styling" && (
                                <Palette className="h-3 w-3 mx-auto mb-1" />
                            )}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                    {activeTab === "layout" && (
                        <>
                            <GridColumnsSelector
                                value={draftCustomization?.gridColumns ?? customization.gridColumns}
                                onChange={(value) => onUpdateDraft("gridColumns", value)}
                            />

                            <CardLayoutSelector
                                value={draftCustomization?.cardLayout ?? customization.cardLayout}
                                onChange={(value) => onUpdateDraft("cardLayout", value)}
                            />

                            <WidthSelector
                                value={draftCustomization?.containerWidth ?? customization.containerWidth}
                                onChange={(value) => onUpdateDraft("containerWidth", value)}
                            />

                            <SpacingSelector
                                value={draftCustomization?.cardSpacing ?? customization.cardSpacing}
                                onChange={(value) => onUpdateDraft("cardSpacing", value)}
                                label="Card Spacing"
                                type="gap"
                            />

                            <AlignmentSelector
                                value={draftCustomization?.textAlignment ?? customization.textAlignment}
                                onChange={(value) => onUpdateDraft("textAlignment", value)}
                            />
                        </>
                    )}

                    {activeTab === "styling" && (
                        <>
                            <CardStyleSelector
                                value={draftCustomization?.cardStyle ?? customization.cardStyle}
                                onChange={(value) => onUpdateDraft("cardStyle", value)}
                            />

                            <SliderControl
                                label="Border Radius"
                                value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                                onChange={(value) => onUpdateDraft("cardBorderRadius", value)}
                                min={0}
                                max={24}
                                step={1}
                            />

                            <SliderControl
                                label="Icon Size"
                                value={draftCustomization?.iconSize ?? customization.iconSize}
                                onChange={(value) => onUpdateDraft("iconSize", value)}
                                min={24}
                                max={64}
                                step={1}
                            />

                            <IconStyleSelector
                                value={draftCustomization?.iconStyle ?? customization.iconStyle}
                                onChange={(value) => onUpdateDraft("iconStyle", value)}
                            />

                            <SliderControl
                                label="Background Opacity"
                                value={draftCustomization?.backgroundOpacity ?? customization.backgroundOpacity}
                                onChange={(value) => onUpdateDraft("backgroundOpacity", value)}
                                min={10}
                                max={100}
                                step={1}
                                unit="%"
                            />

                            <SliderControl
                                label="Border Width"
                                value={draftCustomization?.borderWidth ?? customization.borderWidth}
                                onChange={(value) => onUpdateDraft("borderWidth", value)}
                                min={0}
                                max={4}
                                step={1}
                            />

                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium">Show Labels</span>
                                <Switch
                                    checked={draftCustomization?.showLabels ?? customization.showLabels}
                                    onCheckedChange={(checked) => onUpdateDraft("showLabels", checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium">
                                    Show Descriptions
                                </span>
                                <Switch
                                    checked={draftCustomization?.showDescriptions ?? customization.showDescriptions}
                                    onCheckedChange={(checked) => onUpdateDraft("showDescriptions", checked)}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-700 p-4 bg-zinc-800">
                    <div className="flex gap-2">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1 flex-1 py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </button>
                        <button
                            onClick={onSave}
                            className="flex-1 py-2 px-3 text-sm text-white rounded transition-colors"
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
