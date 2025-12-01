"use client";

import React from "react";
import { TechnologiesVisualEditor } from "./TechnologiesVisualEditor";
import { LumenFlowTechnologiesCustomizationState } from "@/types/lumenflow/technologies";
import { ColorTheme } from "@/lib/colorThemes";

interface LumenFlowTechnologiesVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    customization: LumenFlowTechnologiesCustomizationState;
    updateCustomization: (key: keyof LumenFlowTechnologiesCustomizationState, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

const LumenFlowTechnologiesVisualEditor: React.FC<LumenFlowTechnologiesVisualEditorProps> = ({
    isOpen,
    onClose,
    customization,
    updateCustomization,
    onSave,
    onReset,
}) => {
    return (
        <TechnologiesVisualEditor
            isOpen={isOpen}
            onClose={onClose}
            customization={customization}
            updateCustomization={updateCustomization}
            onSave={onSave}
            onReset={onReset}
            primaryColor={ColorTheme.primary}
            primaryDarkColor={ColorTheme.primaryDark}
        />
    );
};

export default LumenFlowTechnologiesVisualEditor;
