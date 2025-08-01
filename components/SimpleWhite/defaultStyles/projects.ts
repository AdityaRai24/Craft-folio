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
  cardBorderRadius: "lg",
  
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
  imageAspectRatio: "video",
  imagePosition: "left",
  imageOverlay: true,
  projectTitleSize: "lg",
  projectTitleWeight: "bold",
  projectTitleColor: "primary",
  projectDescriptionSize: "md",
  projectDescriptionColor: "gray-700",
  
  // Tech Stack
  techStackVisible: true,
  techStackStyle: "badges",
  techStackLimit: 5,
  techStackColor: "blue",
  
  // Project Links
  linksVisible: true,
  linksStyle: "buttons",
  linksPosition: "bottom",
  githubLinkVisible: true,
  liveLinkVisible: true,
  
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