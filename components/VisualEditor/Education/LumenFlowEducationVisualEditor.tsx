import React from "react";
import EducationVisualEditor from "./EducationVisualEditor";
import { EducationCustomizationState } from "@/types/interfaces/EducationCustomizationState";

interface LumenFlowEducationVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: EducationCustomizationState;
    draftCustomization: EducationCustomizationState | null;
    onUpdateDraft: (key: keyof EducationCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
    activeTab: "layout" | "typography" | "styling" | "timing";
    onTabChange: (tab: "layout" | "typography" | "styling" | "timing") => void;
    primaryColor: string;
    primaryDarkColor: string;
}

const LumenFlowEducationVisualEditor: React.FC<
    LumenFlowEducationVisualEditorProps
> = (props) => {
    return <EducationVisualEditor {...props} />;
};

export default LumenFlowEducationVisualEditor;
