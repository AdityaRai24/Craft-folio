import React from "react";
import ExperienceVisualEditor from "./ExperienceVisualEditor";
import { ExperienceCustomizationState } from "@/types/interfaces/ExperienceCustomizationState";

interface SimpleWhiteExperienceVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: ExperienceCustomizationState;
    draftCustomization: ExperienceCustomizationState | null;
    onUpdateDraft: (key: keyof ExperienceCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    activeTab: "layout" | "typography" | "styling" | "timing";
    onTabChange: (tab: "layout" | "typography" | "styling" | "timing") => void;
    primaryColor: string;
    primaryDarkColor: string;
}

const SimpleWhiteExperienceVisualEditor: React.FC<
    SimpleWhiteExperienceVisualEditorProps
> = (props) => {
    return <ExperienceVisualEditor {...props} onUpdateDraft={props.onUpdateDraft as any} showTimelineControls={false} />;
};

export default SimpleWhiteExperienceVisualEditor;
