// Hero Customization State Interface
export interface HeroCustomizationState {
    // Layout & Structure
    contentAlignment: "center" | "left" | "right";
    verticalAlignment: "top" | "center" | "bottom";
    maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    containerPadding: number;
    containerWidth: "narrow" | "wide" | "full";

    // Background Theme
    backgroundTheme:
    | "pearl-mist"
    | "aurora-midnight"
    | "crimson-shadow"
    | "ocean-abyss"
    | "noise-pattern"
    | "diagonal-lines"
    | "magenta-orb-grid"
    | "black-grid-dots";

    // Badge Customization
    badgeVisible: boolean;

    // Typography
    titleSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
    titleLineHeight: "tight" | "snug" | "normal" | "relaxed" | "loose";
    titleLetterSpacing: "tighter" | "tight" | "normal" | "wide" | "wider";
    subtitleSize: "xs" | "sm" | "md" | "lg" | "xl";
    subtitleWeight: "normal" | "medium" | "semibold" | "bold";
    descriptionSize: "xs" | "sm" | "md" | "lg";
    descriptionWeight: "normal" | "medium" | "semibold";
    descriptionMaxWidth: "sm" | "md" | "lg" | "xl" | "2xl";

    // Button Customization
    buttonLayout: "horizontal" | "vertical";
    buttonSize: "sm" | "md" | "lg";
    buttonStyle: "default" | "rounded" | "pill" | "square";

    // Effects
    scrollIndicator: boolean;
    scrollIndicatorStyle: "line" | "dot" | "arrow" | "animated";
    glowEffect: boolean;
    textShadow: boolean;
}

// Default Hero Styles
export const defaultHeroStyles: HeroCustomizationState = {
    // Layout & Structure
    contentAlignment: "center",
    verticalAlignment: "center",
    maxWidth: "full",
    containerPadding: 16,
    containerWidth: "full",

    // Background Theme
    backgroundTheme: "pearl-mist",

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
    scrollIndicatorStyle: "line",
    glowEffect: false,
    textShadow: false,
};
