import { ExperienceCustomizationState } from "./portfolio";

export const defaultMacOSExperienceStyles: ExperienceCustomizationState = {
    // Layout & Structure
    cardLayout: "default",
    cardBorderRadius: 16,
    cardPadding: 24,
    cardSpacing: 32,
    containerWidth: "full",
    maxWidth: "full",
    containerPadding: 4,

    // Background & Theme
    backgroundColor: "transparent",
    cardBackground: "glass",
    cardBorderColor: "gray-200",
    cardBorderStyle: "none",
    cardShadow: "none",

    // Typography
    titleSize: "lg",
    titleWeight: "bold",
    titleColor: "primary",
    titleAlignment: "left",
    descriptionSize: "sm",
    descriptionColor: "text-secondary",
    descriptionVisible: true,
    textAlignment: "left",

    // Header Section
    headerVisible: true,

    // Experience Cards (Specifics)
    companyNameSize: "lg",
    companyNameWeight: "bold",
    companyNameColor: "text-primary",
    roleSize: "md",
    roleWeight: "medium",
    roleColor: "text-secondary",
    dateFormat: "month-year",
    dateSize: "sm",
    dateWeight: "medium",
    dateColor: "text-tertiary",
    locationVisible: true,
    locationSize: "sm",
    locationWeight: "normal",
    locationColor: "text-tertiary",
    descriptionTextSize: "sm",
    descriptionTextWeight: "normal",
    descriptionTextColor: "text-secondary",

    // Visual Effects
    hoverEffects: true,
    hoverScale: false,
    hoverShadow: false,
    cardHoverEffect: "none",
    glowEffect: true,
    borderGlow: false,
    backgroundOpacity: 0,
    borderWidth: 1,

    // Animations
    animationStyle: "scale",
    animationSpeed: 500,
    staggerDelay: 200,
    staggerAnimation: true,
    entranceAnimation: "slideIn",
    alternatingLayout: false,

    // Tech Stack Display
    techStackVisible: true,
    techStackStyle: "pills",
    techStackSize: "sm",
    techStackLimit: 10,
    techStackColor: "gray",
    techStackShowIcons: true,

    // Timeline Elements
    timelineStyle: "line",
    timelinePosition: "left",
    timelineWidth: 2,
    timelineColor: "#f97316",
    dotSize: "md",
    dotStyle: "circle",

    // Badges & Tags
    locationBadge: true,
    dateBadge: true,
    badgeStyle: "default",

    // Side Accent
    sideAccent: true,
    sideAccentColor: "primary",
    sideAccentWidth: 4,
};
