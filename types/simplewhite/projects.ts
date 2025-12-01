import { ProjectsCustomizationState } from "@/types/interfaces/ProjectsCustomizationState";

export const defaultSimpleWhiteProjectsStyles: ProjectsCustomizationState = {
    layout: "single",
    gridColumns: 2,
    cardSpacing: 24,
    cardBorderRadius: 12,
    imageBorderRadius: 8,
    cardBackground: "bg-stone-800/30",
    cardBorder: "border-gray-700",
    cardStyle: "default",
    imageAspectRatio: "auto",
    imageHeight: 250,
    githubButtonStyle: "default",
    liveButtonStyle: "filled",
    buttonBorderRadius: 6,
    techStackStyle: "pills",
    animationSpeed: 0.3,
    titleAlignment: "left",
    cardPadding: 0,
    imageOverlay: true,
    imagePosition: "left",
    hoverEffects: true,
    glowEffect: true,
    borderWidth: 1,

    // Typography
    titleSize: "lg",
    titleWeight: "semibold",
    descriptionSize: "md",
    descriptionWeight: "normal",



    githubLinkVisible: true,
    liveLinkVisible: true,
};
