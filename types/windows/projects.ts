import { ProjectsCustomizationState } from "@/types/interfaces/ProjectsCustomizationState";

export const defaultWindowsProjectsStyles: ProjectsCustomizationState = {
    layout: "grid",
    gridColumns: 2,
    cardSpacing: 20,
    cardBorderRadius: 6,
    imageBorderRadius: 4,
    cardBackground: "bg-white/5",
    cardBorder: "border-white/10",
    cardStyle: "default",
    imageAspectRatio: "wide",
    imageHeight: 200,
    githubButtonStyle: "default",
    liveButtonStyle: "default",
    buttonBorderRadius: 4,
    techStackStyle: "badges",
    animationSpeed: 0.3,
    titleAlignment: "left",
    cardPadding: 5,
    imageOverlay: false,
    imagePosition: "left",
    hoverEffects: true,
    glowEffect: false,
    borderWidth: 1,

    // Typography
    titleSize: "md",
    titleWeight: "semibold",
    descriptionSize: "sm",
    descriptionWeight: "normal",
};
