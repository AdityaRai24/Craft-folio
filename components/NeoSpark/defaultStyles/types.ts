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

export interface ExperienceCustomizationState {
  // Layout & Structure
  cardLayout: "default" | "minimal" | "glassmorphism" | "neon" | "gradient";
  cardBorderRadius: number;
  cardPadding: number;
  cardSpacing: number;
  containerWidth: "full" | "narrow" | "wide";
  
  // Typography
  titleSize: "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  descriptionSize: "xs" | "sm" | "md" | "lg";
  textAlignment: "left" | "center" | "right";
  
  // Visual Effects
  hoverEffects: boolean;
  glowEffect: boolean;
  borderGlow: boolean;
  backgroundOpacity: number;
  borderWidth: number;
  
  // Animations
  animationStyle: "scale" | "slide" | "rotate" | "bounce" | "none";
  animationSpeed: number;
  staggerDelay: number;
  
  // Tech Stack Display
  techStackVisible: boolean;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  techStackSize: "sm" | "md" | "lg";
  
  // Timeline Elements
  timelineStyle: "line" | "dots" | "gradient" | "minimal";
  timelinePosition: "left" | "center" | "alternating";
  timelineWidth: number;
  timelineColor: string;
  dotSize: "sm" | "md" | "lg";
  dotStyle: "circle" | "square" | "diamond" | "hexagon";
  
  // Badges & Tags
  locationBadge: boolean;
  dateBadge: boolean;
  badgeStyle: "default" | "minimal" | "outlined" | "glow";
  
  // Side Accent
  sideAccent: boolean;
  sideAccentWidth: number;
  sideAccentColor: string;
}