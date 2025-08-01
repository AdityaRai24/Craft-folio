import { SimpleWhiteExperienceCustomizationState } from "./types";

export const defaultSimpleWhiteExperienceStyles: SimpleWhiteExperienceCustomizationState = {
  // Layout & Structure
  layout: "timeline",
  timelinePosition: "center",
  cardSpacing: "normal",
  containerPadding: 16,
  maxWidth: "xl",
  
  // Background & Theme
  backgroundColor: "white",
  cardBackground: "glass",
  cardBorderStyle: "subtle",
  cardShadow: "light",
  cardBorderRadius: "lg",
  
  // Header Section
  headerVisible: true,
  titleSize: "xl",
  titleWeight: "medium",
  titleColor: "gray-900",
  titleAlignment: "center",
  descriptionSize: "lg",
  descriptionColor: "gray-600",
  descriptionVisible: true,
  
  // Timeline Settings
  timelineVisible: true,
  timelineColor: "gray-300",
  timelineWidth: "thin",
  timelineDots: true,
  timelineDotColor: "gray-500",
  timelineDotSize: "md",
  
  // Experience Cards
  companyNameSize: "lg",
  companyNameWeight: "medium",
  companyNameColor: "gray-600",
  roleSize: "xl",
  roleWeight: "semibold",
  roleColor: "gray-900",
  dateFormat: "month-year",
  dateColor: "gray-500",
  locationVisible: true,
  locationColor: "gray-500",
  descriptionTextSize: "md",
  descriptionTextColor: "gray-700",
  
  // Tech Stack
  techStackVisible: true,
  techStackStyle: "badges",
  techStackLimit: 5,
  techStackColor: "gray",
  techStackShowIcons: true,
  
  // Hover Effects
  hoverEffects: true,
  hoverScale: false,
  hoverShadow: true,
  cardHoverEffect: "lift",
  
  // Animations
  animationSpeed: "normal",
  staggerAnimation: true,
  entranceAnimation: "fadeUp",
  alternatingLayout: true,
};