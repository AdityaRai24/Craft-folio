export interface EducationCustomizationState {
    cardStyle: "default" | "minimal" | "glass" | "neon" | "gradient";
    cardBorderRadius: number;
    cardPadding: number;
    cardSpacing: number;
    titleSize: "sm" | "md" | "lg" | "xl";
    titleWeight: "normal" | "medium" | "semibold" | "bold";
    textAlignment: "left" | "center" | "right";
    hoverEffects: boolean;
    glowEffect: boolean;
    borderGlow: boolean;
    backgroundOpacity: number;
    borderWidth: number;
    animationStyle: "fade" | "slide" | "scale" | "none";
    animationSpeed: number;
    staggerDelay: number;
    showInstitution: boolean;
    showDates: boolean;
    showLocation: boolean;
    showDescription: boolean;
    descriptionStyle: "expand" | "tooltip" | "plain";
    accentLine: boolean;
    accentLineStyle: "solid" | "dashed" | "gradient";
    accentLineWidth: number;
    accentLineColor: string;
    cardShadow: boolean;
    shadowIntensity: number;
    backgroundBlur: boolean;
    blurIntensity: number;
    showArrow: boolean;
    arrowStyle: "simple" | "animated" | "none";
    dateFormat: "short" | "long" | "year";
    institutionStyle: "bold" | "italic" | "minimal";
    institutionSize: "sm" | "md" | "lg";
    backgroundColor?: string;
    borderColor?: string;
    headingColor?: string;
}


