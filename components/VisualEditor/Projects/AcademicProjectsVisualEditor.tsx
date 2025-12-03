import React from "react";
import ProjectsVisualEditor from "./ProjectsVisualEditor";
import { ProjectsCustomizationState } from "@/types/interfaces/ProjectsCustomizationState";
import { ColorTheme } from "@/lib/colorThemes";

interface AcademicProjectsVisualEditorProps {
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
}

const AcademicProjectsVisualEditor: React.FC<AcademicProjectsVisualEditorProps> = (props) => {
    return (
        <ProjectsVisualEditor
            {...props}
            showLayoutTab={false}
            showStylingTab={false}
            showTimingTab={false}
            primaryColor={props.primaryColor || ColorTheme.primary}
            onUpdateDraft={props.onUpdateDraft as any}
        />
    );
};

export default AcademicProjectsVisualEditor;
