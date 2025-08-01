import { CustomizationState } from "./types";

export const defaultHeroStyles: CustomizationState = {
  // Layout & Structure
  contentAlignment: "center",
  verticalAlignment: "center",
  maxWidth: "full",
  containerPadding: 16,

  // Background Theme
  backgroundTheme: "pearl-mist",

  // Badge Customization
  badgeVisible: true,

  // Typography
  titleSize: "lg",
  titleWeight: "bold",
  titleLineHeight: "snug",
  titleLetterSpacing: "tight",
  subtitleSize: "lg",
  subtitleWeight: "medium",
  descriptionSize: "md",
  descriptionMaxWidth: "lg",

  // Button Customization
  buttonLayout: "horizontal",
  buttonSize: "md",
  buttonStyle: "default",

  // Effects
  scrollIndicator: true,
  scrollIndicatorStyle: "line",
  glowEffect: false,
  textShadow: false,
}; 