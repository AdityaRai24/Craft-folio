import { SimpleWhiteProjectsCustomizationState } from "./types";

export const defaultSimpleWhiteProjectsStyles: SimpleWhiteProjectsCustomizationState = {
  layout: "single",
  gridColumns: 3,
  cardSpacing: 8,
  cardBorderRadius: 12,
  imageBorderRadius: 8,
  cardBackground: "bg-white",
  cardBorder: "border-gray-200",
  imageAspectRatio: "auto",
  imageHeight: 240,
  githubButtonStyle: "default",
  liveButtonStyle: "default",
  buttonBorderRadius: 6,
  techStackStyle: "pills",
  animationSpeed: 0.3,
  titleAlignment: "left",
  cardPadding: 4,
  imageOverlay: true,
  imagePosition: "left",
  
  // Typography
  titleSize: "md",
  titleWeight: "semibold",
  descriptionSize: "md",
  descriptionWeight: "normal",
  
  // Header Section
  headerVisible: true,
  titleColor: "gray-900",
  descriptionColor: "gray-600",
  descriptionVisible: true,
  
  // Project Cards
  showImages: true,
  projectTitleColor: "gray-900",
  projectDescriptionColor: "gray-600",
  
  // Tech Stack
  techStackVisible: true,
  techStackSize: "md",
  
  // Project Links
  linksVisible: true,
  linksStyle: "buttons",
  linksPosition: "bottom",
  githubLinkVisible: true,
  liveLinkVisible: true,
  buttonSize: "md",
  
  // Hover Effects
  hoverEffects: true,
  hoverScale: true,
  hoverShadow: true,
  imageHoverEffect: "zoom",
  
  // Animations
  staggerAnimation: true,
  entranceAnimation: "fadeUp",
};