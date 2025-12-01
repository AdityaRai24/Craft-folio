export interface Technology {
  name: string;
  logo: string;
  icon?: string;
}

export interface TechnologiesCustomizationState {
  // Layout
  layout: "grid" | "marquee" | "carousel";
  gridColumns: number;
  gap: number;
  containerWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  // Card Styling
  cardStyle: "default" | "minimal" | "glass" | "neon" | "gradient" | "elevated" | "outlined" | "filled";
  cardBorderRadius: number;
  cardPadding: number;
  cardShadow: "none" | "light" | "medium" | "heavy";
  borderWidth: number;
  backgroundOpacity: number;

  // Icon & Typography
  showIcons: boolean;
  iconSize: number;
  showLabels: boolean;
  labelPosition: "bottom" | "overlay" | "right";
  labelSize: "xs" | "sm" | "md" | "lg";
  labelWeight: "normal" | "medium" | "semibold" | "bold";
  textAlignment: "left" | "center" | "right";

  // Animation & Behavior
  animationStyle: "fade" | "slide" | "scale" | "bounce" | "none";
  animationSpeed: number;
  staggerAnimation: boolean;
  hoverEffects: boolean;
  cardHoverEffect: "lift" | "glow" | "scale" | "rotate" | "none";

  // Marquee specific
  marqueeDirection: "left" | "right";
  marqueeSpeed: number;
  pauseOnHover: boolean;
}


