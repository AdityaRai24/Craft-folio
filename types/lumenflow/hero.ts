export interface LumenFlowHeroCustomizationState {
    gradientOverlay: boolean;
    profileImageSize: number;
    profileImageBorder: boolean;
    profileImageBorderWidth: number;
    showProfileImage: boolean;
    nameSize: "sm" | "md" | "lg" | "xl";
    titleSize: "sm" | "md" | "lg";
    socialLinksVisible: boolean;
    sidebarWidth: number;
    backgroundBlur: boolean;
    blurIntensity: number;
    hoverEffects: boolean;
    cardBorderRadius: number;
    cardPadding: number;
    cardShadow: boolean;
    shadowIntensity: number;
    animationSpeed: number;
}

export const defaultLumenFlowHeroStyles: LumenFlowHeroCustomizationState = {
    gradientOverlay: true,
    profileImageSize: 120,
    profileImageBorder: true,
    profileImageBorderWidth: 4,
    showProfileImage: true,
    nameSize: "xl",
    titleSize: "md",
    socialLinksVisible: true,
    sidebarWidth: 350,
    backgroundBlur: true,
    blurIntensity: 10,
    hoverEffects: true,
    cardBorderRadius: 24,
    cardPadding: 32,
    cardShadow: true,
    shadowIntensity: 4,
    animationSpeed: 500,
};
