import { SimpleWhiteHeroCustomizationState } from "./types";

export const defaultSimpleWhiteHeroStyles: SimpleWhiteHeroCustomizationState = {
  // Layout & Structure
  contentAlignment: "center",
  layoutStyle: "split",
  containerPadding: 16,
  maxWidth: "xl",
  
  // Background & Theme
  backgroundColor: "white",
  cardBackground: "gradient",
  cardBorderStyle: "subtle",
  cardShadow: "medium",
  
  // Typography
  titleSize: "xl",
  titleWeight: "extrabold",
  titleColor: "gray-900",
  subtitleSize: "lg",
  subtitleWeight: "bold",
  subtitleColor: "gray-600",
  descriptionSize: "md",
  descriptionColor: "gray-700",
  
  // Social Links
  socialLinksVisible: true,
  socialLinksStyle: "circular",
  socialLinksSize: "md",
  socialLinksHoverEffect: "border",
  
  // About Card
  aboutCardVisible: true,
  aboutCardStyle: "gradient",
  aboutCardBorder: "subtle",
  aboutCardShadow: "medium",
  
  // Resume Button
  resumeButtonVisible: true,
  resumeButtonStyle: "animated",
  resumeButtonSize: "md",
  
  // Scroll Indicator
  scrollIndicatorVisible: true,
  scrollIndicatorStyle: "chevron",
  scrollIndicatorColor: "gray-400",
  
  // Animations
  animationSpeed: "normal",
  staggerAnimation: true,
  hoverEffects: true,
}; 