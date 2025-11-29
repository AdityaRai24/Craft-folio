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
  cardStyle: "default" | "minimal" | "glassmorphism" | "neon" | "gradient" | "elevated" | "outlined" | "filled";
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

export const defaultTechnologiesStyles: TechnologiesCustomizationState = {
  layout: "grid",
  gridColumns: 4,
  gap: 24,
  containerWidth: "xl",
  cardStyle: "default",
  cardBorderRadius: 12,
  cardPadding: 20,
  cardShadow: "medium",
  borderWidth: 1,
  backgroundOpacity: 10,
  showIcons: true,
  iconSize: 40,
  showLabels: true,
  labelPosition: "bottom",
  labelSize: "sm",
  labelWeight: "medium",
  textAlignment: "center",
  animationStyle: "fade",
  animationSpeed: 300,
  staggerAnimation: true,
  hoverEffects: true,
  cardHoverEffect: "lift",
  marqueeDirection: "left",
  marqueeSpeed: 50,
  pauseOnHover: true,
};
