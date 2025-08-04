export interface ProjectsCustomizationState {
  layout: "single" | "grid";
  gridColumns: number;
  cardSpacing: number;
  cardBorderRadius: number;
  imageBorderRadius: number;
  cardBackground: string;
  cardBorder: string;
  imageAspectRatio: "auto" | "square" | "wide" | "tall";
  imageHeight: number;
  githubButtonStyle: "default" | "filled" | "ghost" | "minimal";
  liveButtonStyle: "default" | "filled" | "ghost" | "minimal";
  buttonBorderRadius: number;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  animationSpeed: number;
  titleAlignment: "left" | "center" | "right";
  cardPadding: number;
  imageOverlay: boolean;
  imagePosition: "left" | "right";
  
  // Typography
  titleSize: "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  descriptionSize: "sm" | "md" | "lg";
  descriptionWeight: "normal" | "medium" | "semibold" | "bold";
}

export interface CustomizationState {
  // Layout & Structure
  contentAlignment: "center" | "left" | "right";
  verticalAlignment: "center" | "top" | "bottom";
  maxWidth: "sm" | "md" | "lg" | "xl" | "full";
  containerPadding: number;

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
  titleSize: "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  titleLineHeight: "tight" | "snug" | "normal" | "relaxed";
  titleLetterSpacing: "tighter" | "tight" | "normal" | "wide";
  subtitleSize: "sm" | "md" | "lg" | "xl";
  subtitleWeight: "normal" | "medium" | "semibold";
  descriptionSize: "sm" | "md" | "lg";
  descriptionWeight: "normal" | "medium" | "semibold" | "bold";
  descriptionMaxWidth: "sm" | "md" | "lg" | "xl" | "full";

  // Button Customization
  buttonLayout: "horizontal" | "vertical";
  buttonSize: "sm" | "md" | "lg";
  buttonStyle: "default" | "rounded" | "square" | "pill";

  // Effects
  scrollIndicator: boolean;
  scrollIndicatorStyle: "line" | "arrow" | "dot" | "animated";
  glowEffect: boolean;
  textShadow: boolean;
} 