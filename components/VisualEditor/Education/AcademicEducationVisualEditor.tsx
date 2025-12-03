import React from "react";
import EducationVisualEditor from "./EducationVisualEditor";
import { EducationCustomizationState } from "@/types/interfaces/EducationCustomizationState";
import { ColorTheme } from "@/lib/colorThemes";

interface AcademicEducationVisualEditorProps {
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
}

const AcademicEducationVisualEditor: React.FC<AcademicEducationVisualEditorProps> = (props) => {
    return (
        <EducationVisualEditor
            {...props}
            showLayoutTab={false}
            showStylingTab={false}
            showTimingTab={false}
            primaryColor={props.primaryColor || ColorTheme.primary}
            onUpdateDraft={props.onUpdateDraft as any}
        />
    );
};

export default AcademicEducationVisualEditor;
