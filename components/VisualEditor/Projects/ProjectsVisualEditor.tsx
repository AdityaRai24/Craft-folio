"use client";

import React from "react";
import {
  Palette,
  Layout,
  Move,
  RotateCcw,
  X,
  Type,
} from "lucide-react";
import LayoutSelector from "./LayoutSelector";
import AlignmentSelector from "../Shared/AlignmentSelector";
import ButtonStyleSelector from "./ButtonStyleSelector";
import AspectRatioSelector from "./AspectRatioSelector";
import TechStackStyleSelector from "../Shared/TechStackStyleSelector";
import SliderControl from "../Shared/SliderControl";
import TypographySelector from "../Shared/TypographySelector";
import ImagePositionSelector from "./ImagePositionSelector";
import CardStyleSelector from "../Shared/CardStyleSelector";
import { useDraggable } from "@/hooks/useDraggable";
import { ProjectsCustomizationState } from "@/types/projects/portfolio";
import { ColorTheme } from "@/lib/colorThemes";

interface ProjectsVisualEditorProps {
  isOpen: boolean;
  onClose: () => void;
  customization: ProjectsCustomizationState;
  draftCustomization: ProjectsCustomizationState | null;
  onUpdateDraft: (key: keyof ProjectsCustomizationState, value: any) => void;
  onSave: () => void;
  onReset: () => void;
  activeTab: "layout" | "typography" | "styling" | "timing";
  onTabChange: (tab: "layout" | "typography" | "styling" | "timing") => void;
  primaryColor?: string;
  primaryDarkColor?: string;
}

const ProjectsVisualEditor: React.FC<ProjectsVisualEditorProps> = ({
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
              {tab === "timing" && <Move className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />}
              <span className="hidden sm:inline">{tab}</span>
              <span className="sm:hidden">{tab.charAt(0)}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 custom-scrollbar">
          {activeTab === "layout" && (
            <>
              <CardStyleSelector
                value={draftCustomization?.cardStyle ?? customization.cardStyle}
                onChange={value => onUpdateDraft("cardStyle", value)}
              />

              <LayoutSelector
                value={draftCustomization?.layout ?? customization.layout}
                onChange={value => onUpdateDraft("layout", value)}
                gridColumns={draftCustomization?.gridColumns ?? customization.gridColumns}
                onGridColumnsChange={cols => onUpdateDraft("gridColumns", cols)}
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
                value={draftCustomization?.titleAlignment ?? customization.titleAlignment}
                onChange={value => onUpdateDraft("titleAlignment", value)}
              />

              <div className="space-y-3 pt-2 border-t border-zinc-700">
                <label className="flex items-center justify-between text-sm text-gray-300">
                  <span>Show Images</span>
                  <input
                    type="checkbox"
                    checked={draftCustomization?.showImages ?? customization.showImages ?? true}
                    onChange={e => onUpdateDraft("showImages", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between text-sm text-gray-300">
                  <span>Show Tech Stack</span>
                  <input
                    type="checkbox"
                    checked={draftCustomization?.techStackVisible ?? customization.techStackVisible ?? true}
                    onChange={e => onUpdateDraft("techStackVisible", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between text-sm text-gray-300">
                  <span>Show Links</span>
                  <input
                    type="checkbox"
                    checked={draftCustomization?.linksVisible ?? customization.linksVisible ?? true}
                    onChange={e => onUpdateDraft("linksVisible", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              {(draftCustomization?.layout ?? customization.layout) === "single" && (
                <ImagePositionSelector
                  value={draftCustomization?.imagePosition ?? customization.imagePosition}
                  onChange={value => onUpdateDraft("imagePosition", value)}
                />
              )}
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

              <div className="border-t border-zinc-700 pt-4 space-y-4">
                <TypographySelector
                  label="Description Size"
                  value={draftCustomization?.descriptionSize ?? customization.descriptionSize}
                  onChange={value => onUpdateDraft("descriptionSize", value)}
                  type="size"
                  options={[
                    { value: "xs", label: "Extra Small", preview: "0.75rem" },
                    { value: "sm", label: "Small", preview: "0.875rem" },
                    { value: "md", label: "Medium", preview: "1rem" },
                    { value: "lg", label: "Large", preview: "1.125rem" },
                  ]}
                />

                <TypographySelector
                  label="Description Weight"
                  value={draftCustomization?.descriptionWeight ?? customization.descriptionWeight}
                  onChange={value => onUpdateDraft("descriptionWeight", value)}
                  type="weight"
                  options={[
                    { value: "normal", label: "Normal", preview: "font-normal" },
                    { value: "medium", label: "Medium", preview: "font-medium" },
                    { value: "semibold", label: "Semibold", preview: "font-semibold" },
                    { value: "bold", label: "Bold", preview: "font-bold" },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === "styling" && (
            <>

              <SliderControl
                label="Card Border Radius"
                value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                onChange={value => onUpdateDraft("cardBorderRadius", value)}
                min={0}
                max={24}
                step={2}
              />

              <SliderControl
                label="Image Border Radius"
                value={draftCustomization?.imageBorderRadius ?? customization.imageBorderRadius}
                onChange={value => onUpdateDraft("imageBorderRadius", value)}
                min={0}
                max={24}
                step={2}
              />

              <SliderControl
                label="Card Padding"
                value={draftCustomization?.cardPadding ?? customization.cardPadding}
                onChange={value => onUpdateDraft("cardPadding", value)}
                min={0}
                max={12}
                step={2}
              />

              <ButtonStyleSelector
                value={draftCustomization?.githubButtonStyle ?? customization.githubButtonStyle}
                onChange={value => onUpdateDraft("githubButtonStyle", value)}
                label="GitHub Button Style"
              />

              <ButtonStyleSelector
                value={draftCustomization?.liveButtonStyle ?? customization.liveButtonStyle}
                onChange={value => onUpdateDraft("liveButtonStyle", value)}
                label="Live Demo Button Style"
              />

              {(draftCustomization?.githubButtonStyle === "default" || draftCustomization?.githubButtonStyle === "filled" ||
                draftCustomization?.liveButtonStyle === "default" || draftCustomization?.liveButtonStyle === "filled") && (
                  <SliderControl
                    label="Button Border Radius"
                    value={draftCustomization?.buttonBorderRadius ?? customization.buttonBorderRadius}
                    onChange={value => onUpdateDraft("buttonBorderRadius", value)}
                    min={0}
                    max={24}
                    step={2}
                  />
                )}

              <TechStackStyleSelector
                value={draftCustomization?.techStackStyle ?? customization.techStackStyle}
                onChange={value => onUpdateDraft("techStackStyle", value)}
              />
            </>
          )}

          {activeTab === "timing" && (
            <>
              <AspectRatioSelector
                value={draftCustomization?.imageAspectRatio ?? customization.imageAspectRatio}
                onChange={value => onUpdateDraft("imageAspectRatio", value)}
                imageHeight={draftCustomization?.imageHeight ?? customization.imageHeight}
                onImageHeightChange={height => onUpdateDraft("imageHeight", height)}
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

export default ProjectsVisualEditor;
