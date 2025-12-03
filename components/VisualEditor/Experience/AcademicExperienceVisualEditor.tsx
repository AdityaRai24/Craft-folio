import React from "react";
import ExperienceVisualEditor from "./ExperienceVisualEditor";
import { ExperienceCustomizationState } from "@/types/interfaces/ExperienceCustomizationState";
import { ColorTheme } from "@/lib/colorThemes";

interface AcademicExperienceVisualEditorProps {
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
}

const AcademicExperienceVisualEditor: React.FC<AcademicExperienceVisualEditorProps> = (props) => {
    return (
        <ExperienceVisualEditor
            {...props}
            showCardLayout={false} // Hide Card Layout selector (Neon, Glass, etc.)
            showTechStack={true}   // Keep Tech Stack selector
            showTimelineControls={true} // Keep Timeline controls
            showLayoutTab={false}
            showStylingTab={false}
            showTimingTab={false}
            primaryColor={props.primaryColor || ColorTheme.primary}
            onUpdateDraft={props.onUpdateDraft as any}
        />
    );
};

export default AcademicExperienceVisualEditor;
