import { ProjectsCustomizationState } from "@/types/interfaces/ProjectsCustomizationState";

export const defaultNeoSparkProjectsStyles: ProjectsCustomizationState = {

    //layout
    cardStyle: "glass", //default
    layout: "grid",
    gridColumns: 2,
    cardSpacing: 32,
    titleAlignment: "left",

    // Typography
    titleSize: "lg",
    titleWeight: "semibold",
    descriptionSize: "md",
    descriptionWeight: "normal",

    //styling
    cardBorderRadius: 12,
    imageBorderRadius: 8,
    cardPadding: 6,
    githubButtonStyle: "minimal",
    liveButtonStyle: "filled",
    buttonBorderRadius: 8,
    techStackStyle: "pills",

    // timing
    imageAspectRatio: "auto",
    imageHeight: 210,
    imagePosition: "left",
    borderWidth: 1,
};
