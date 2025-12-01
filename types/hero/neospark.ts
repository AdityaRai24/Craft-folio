import { HeroCustomizationState } from "./portfolio";

export const defaultNeoSparkHeroStyles: HeroCustomizationState = {
    // Layout & Structure
    contentAlignment: "center",
    verticalAlignment: "center",
    maxWidth: "full",
    containerPadding: 16,
    containerWidth: "full",

    // Background Theme
    backgroundTheme: "noise-pattern",

    // Badge Customization
    badgeVisible: true,

    // Typography
    titleSize: "lg",
    titleWeight: "bold",
    titleLineHeight: "snug",
    titleLetterSpacing: "tight",
    subtitleSize: "lg",
    subtitleWeight: "medium",
    descriptionSize: "md",
    descriptionWeight: "medium",
    descriptionMaxWidth: "lg",

    // Button Customization
    buttonLayout: "horizontal",
    buttonSize: "md",
    buttonStyle: "default",

    // Effects
    scrollIndicator: true,
    scrollIndicatorStyle: "animated",
    glowEffect: false,
    textShadow: false,
};
