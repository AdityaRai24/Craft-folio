import { SimpleWhiteProjectsCustomizationState } from "./types";

export const defaultSimpleWhiteProjectsStyles: SimpleWhiteProjectsCustomizationState = {
  // Layout & Structure
  layout: "list",
  columnsDesktop: 2,
  columnsMobile: 1,
  spacing: "normal",
  containerPadding: 16,
  maxWidth: "xl",
  
  // Background & Theme
  backgroundColor: "white",
  cardBackground: "solid",
  cardBorderStyle: "subtle",
  cardShadow: "light",
  cardBorderRadius: 8,
  
  // Header Section
  headerVisible: true,
  titleSize: "xl",
  titleWeight: "bold",
  titleColor: "gray-900",
  titleAlignment: "center",
  descriptionSize: "lg",
  descriptionColor: "gray-600",
  descriptionVisible: true,
  
  // Project Cards
  showImages: true,
  imagePosition: "left",
  imageOverlay: true,
  imageBorderRadius: 8,
  cardPadding: 4,
  projectTitleSize: "lg",
  projectTitleWeight: "bold",
  projectTitleColor: "primary",
  projectDescriptionSize: "md",
  projectDescriptionColor: "gray-700",
  
  // Tech Stack
  techStackVisible: true,
  techStackStyle: "badges",
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
  animationSpeed: "normal",
  staggerAnimation: true,
  entranceAnimation: "fadeUp",
};