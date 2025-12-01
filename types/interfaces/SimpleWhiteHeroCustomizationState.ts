// SimpleWhite Hero-specific customization interface
export interface SimpleWhiteHeroCustomizationState {
    // Profile Image Settings
    showProfileImage: boolean;
    profileImageSize: number;
    profileImageBorder: boolean;
    profileImageBorderWidth: number;
    profileImageShadow: boolean;
    profileImagePosition: "left" | "right" | "center";

    // Layout & Structure
    contentAlignment: "left" | "center" | "right";
    layoutStyle: "split" | "stacked" | "centered";
    containerPadding: number;
    maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

    // Background & Theme
    backgroundColor: "white" | "gray-50" | "gray-100";
    backgroundTheme: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning";
    cardBackground: "solid" | "gradient" | "transparent";
    cardBorderStyle: "none" | "subtle" | "bold";
    cardShadow: "none" | "light" | "medium" | "heavy";

    // Typography
    titleSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
    titleColor: "gray-900" | "gray-800" | "black";
    subtitleSize: "sm" | "md" | "lg" | "xl";
    subtitleWeight: "normal" | "medium" | "semibold" | "bold";
    subtitleColor: "gray-600" | "gray-700" | "gray-800";
    descriptionSize: "sm" | "md" | "lg";
    descriptionColor: "gray-600" | "gray-700" | "gray-800";

    // Social Links
    socialLinksVisible: boolean;
    socialLinksStyle: "circular" | "square" | "minimal";
    socialLinksSize: "sm" | "md" | "lg";
    socialLinksHoverEffect: "border" | "scale" | "glow" | "none";

    // About Card
    aboutCardVisible: boolean;
    aboutCardStyle: "solid" | "gradient" | "outline";
    aboutCardBorder: "none" | "subtle" | "bold";
    aboutCardShadow: "none" | "light" | "medium" | "heavy";

    // Resume Button
    resumeButtonVisible: boolean;
    resumeButtonStyle: "default" | "animated" | "minimal" | "outline";
    resumeButtonSize: "sm" | "md" | "lg";

    // Scroll Indicator
    scrollIndicatorVisible: boolean;
    scrollIndicatorStyle: "chevron" | "dots" | "line" | "arrow";
    scrollIndicatorColor: "gray-400" | "gray-500" | "gray-600";

    // Animations
    animationSpeed: "slow" | "normal" | "fast";
    staggerAnimation: boolean;
    hoverEffects: boolean;
}
