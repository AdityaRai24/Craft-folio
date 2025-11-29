export interface ExperienceCustomizationState {
  // Layout & Structure
  cardLayout: "default" | "minimal" | "glassmorphism" | "neon" | "gradient" | "cards";
  cardBorderRadius: number | "none" | "sm" | "md" | "lg" | "xl";
  cardPadding: number;
  cardSpacing: number;
  containerWidth: "full" | "narrow" | "wide";
  maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  containerPadding: number;

  // Background & Theme
  backgroundColor: "white" | "gray-50" | "gray-100" | "gray-900" | "transparent";
  cardBackground: "solid" | "gradient" | "glass" | "transparent";
  cardBorderColor: string;
  cardBorderStyle: "none" | "subtle" | "bold";
  cardShadow: "none" | "light" | "medium" | "heavy";

  // Typography
  titleSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  titleColor: "gray-900" | "gray-800" | "black" | string;
  titleAlignment: "left" | "center" | "right";
  descriptionSize: "xs" | "sm" | "md" | "lg";
  descriptionColor: "gray-600" | "gray-700" | "gray-800" | string;
  descriptionVisible: boolean;
  textAlignment: "left" | "center" | "right";

  // Header Section
  headerVisible: boolean;

  // Experience Cards (Specifics)
  companyNameSize: "sm" | "md" | "lg" | "xl";
  companyNameWeight: "normal" | "medium" | "semibold" | "bold";
  companyNameColor: "gray-600" | "gray-700" | "gray-900" | string;
  roleSize: "sm" | "md" | "lg" | "xl";
  roleWeight: "normal" | "medium" | "semibold" | "bold";
  roleColor: "gray-900" | "gray-800" | "primary" | string;
  dateFormat: "month-year" | "full-date" | "year-only";
  dateColor: "gray-500" | "gray-600" | "gray-700" | string;
  locationVisible: boolean;
  locationColor: "gray-500" | "gray-600" | "gray-700" | string;
  descriptionTextSize: "sm" | "md" | "lg";
  descriptionTextColor: "gray-600" | "gray-700" | "gray-800" | string;

  // Visual Effects
  hoverEffects: boolean;
  hoverScale: boolean;
  hoverShadow: boolean;
  cardHoverEffect: "lift" | "glow" | "border" | "none";
  glowEffect: boolean;
  borderGlow: boolean;
  backgroundOpacity: number;
  borderWidth: number;

  // Animations
  animationStyle: "scale" | "slide" | "rotate" | "bounce" | "none";
  animationSpeed: number | "slow" | "normal" | "fast";
  staggerDelay: number;
  staggerAnimation: boolean;
  entranceAnimation: "fadeUp" | "slideIn" | "scaleUp" | "none";
  alternatingLayout: boolean;

  // Tech Stack Display
  techStackVisible: boolean;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  techStackSize: "sm" | "md" | "lg";
  techStackLimit: number;
  techStackColor: "gray" | "blue" | "green" | "purple";
  techStackShowIcons: boolean;

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
