export interface ContactCustomizationState {
  // Layout
  layout: "grid";
  gridColumns: number;
  cardLayout: "flex" | "stacked";
  cardSize: "compact" | "default" | "large";
  containerWidth: "full" | "narrow" | "wide";
  cardSpacing: number;

  // Styling
  cardStyle: "default" | "minimal" | "glassmorphism" | "neon";
  cardBorderRadius: number;
  cardPadding: number;
  iconSize: number;
  iconStyle: "outline" | "filled";
  backgroundOpacity: number;
  borderWidth: number;

  // Content
  showLabels: boolean;
  showDescriptions: boolean;
  textAlignment: "center" | "left" | "right";

  // Animation
  animationStyle: "scale" | "slide" | "rotate" | "bounce" | "fade" | "none";
  animationSpeed: number;
  staggerDelay: number;
  hoverEffects: boolean;

  // Behavior
  copyToClipboard: boolean;
  openInNewTab: boolean;
}

export const defaultContactStyles: ContactCustomizationState = {
  layout: "grid",
  gridColumns: 3,
  cardLayout: "stacked",
  cardSize: "default",
  containerWidth: "wide",
  cardSpacing: 24,
  cardStyle: "default",
  cardBorderRadius: 12,
  cardPadding: 8,
  iconSize: 32,
  iconStyle: "outline",
  backgroundOpacity: 100,
  borderWidth: 1,
  showLabels: true,
  showDescriptions: false,
  textAlignment: "center",
  animationStyle: "scale",
  animationSpeed: 300,
  staggerDelay: 100,
  hoverEffects: true,
  copyToClipboard: false,
  openInNewTab: true,
};
