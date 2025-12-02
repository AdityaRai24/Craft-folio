import { ExperienceCustomizationState } from "@/types/interfaces/ExperienceCustomizationState";

export const defaultWindowsExperienceStyles: ExperienceCustomizationState = {
    // Layout & Structure
    cardLayout: "default",
    cardBorderRadius: 6,
    cardPadding: 20,
    cardSpacing: 24,
    containerWidth: "wide",
    maxWidth: "full",
    containerPadding: 4,

    // Background & Theme
    backgroundColor: "transparent",
    cardBackground: "glass",
    cardBorderColor: "gray-700",
    cardBorderStyle: "subtle",
    cardShadow: "light",

    // Typography
    titleSize: "lg",
    titleWeight: "semibold",
    titleColor: "primary",
    titleAlignment: "left",
    descriptionSize: "sm",
    descriptionColor: "text-secondary",
    descriptionVisible: true,
    textAlignment: "left",

    // Header Section
    headerVisible: true,

    // Experience Cards (Specifics)
    companyNameSize: "md",
    companyNameWeight: "semibold",
    companyNameColor: "text-primary",
    roleSize: "md",
    roleWeight: "medium",
    roleColor: "text-secondary",
    dateFormat: "month-year",
    dateSize: "sm",
    dateWeight: "normal",
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
    hoverShadow: true,
    cardHoverEffect: "lift",
    glowEffect: false,
    borderGlow: false,
    backgroundOpacity: 10,
    borderWidth: 1,

    // Animations
    animationStyle: "scale",
    animationSpeed: 400,
    staggerDelay: 100,
    staggerAnimation: true,
    entranceAnimation: "slideIn",
    alternatingLayout: false,

    // Tech Stack Display
    techStackVisible: true,
    techStackStyle: "badges",
    techStackSize: "sm",
    techStackLimit: 8,
    techStackColor: "gray",
    techStackShowIcons: false,

    // Timeline Elements
    timelineStyle: "line",
    timelinePosition: "left",
    timelineWidth: 2,
    timelineColor: "primary",
    dotSize: "sm",
    dotStyle: "square",

    // Badges & Tags
    locationBadge: true,
    dateBadge: true,
    badgeStyle: "outlined",

    // Side Accent
    sideAccent: true,
    sideAccentColor: "primary",
    sideAccentWidth: 3,
};
