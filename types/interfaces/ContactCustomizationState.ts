export interface ContactCustomizationState {
  // Layout
  layout: "grid";
  gridColumns: number;
  cardLayout: "flex" | "stacked";
  cardSize: "compact" | "default" | "large";
  containerWidth: "full" | "narrow" | "wide";
  cardSpacing: number;

  // Styling
  cardStyle: "default" | "minimal" | "glass" | "neon" | "gradient";
  cardBorderRadius: number;
  cardPadding: number;
  iconSize: number;
  iconStyle: "outline" | "filled";
  backgroundOpacity: number;
  borderWidth: number;

  // Content
  showLabels: boolean;
  showDescriptions: boolean;
  showEmail?: boolean;
  showLinkedin?: boolean;
  showGithub?: boolean;
  showLocation?: boolean;
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


