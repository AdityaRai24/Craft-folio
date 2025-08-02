import { SimpleWhiteSkillsCustomizationState } from "./types";

export const defaultSimpleWhiteSkillsStyles: SimpleWhiteSkillsCustomizationState = {
  // Layout & Structure
  layout: "grid",
  gridColumns: 6,
  mobileColumns: 2,
  spacing: "normal",
  containerPadding: 16,
  maxWidth: "xl",
  
  // Background & Theme
  backgroundColor: "gray-50",
  cardBackground: "solid",
  cardBorderStyle: "rounded",
  cardShadow: "medium",
  cardBorderRadius: "lg",
  
  // Header Section
  headerVisible: true,
  titleSize: "xl",
  titleWeight: "bold",
  titleColor: "gray-800",
  titleAlignment: "center",
  descriptionSize: "lg",
  descriptionColor: "gray-600",
  descriptionVisible: true,
  
  // Skill Cards
  cardStyle: "elevated",
  showIcons: true,
  iconSize: "lg",
  showLabels: true,
  labelSize: "md",
  labelWeight: "medium",
  labelColor: "gray-800",
  labelPosition: "bottom",
  
  // Grouping & Categories
  groupByCategory: false,
  categoryStyle: "headers",
  categoryColor: "gray",
  showCategoryLabels: true,
  
  // Hover Effects
  hoverEffects: true,
  hoverScale: false,
  hoverShadow: true,
  hoverRotation: false,
  cardHoverEffect: "lift",
  
  // Progress & Skills Level
  showProgress: false,
  progressStyle: "bars",
  progressColor: "blue",
  progressPosition: "bottom",
  
  // Animations
  animationSpeed: "normal",
  staggerAnimation: true,
  
  // Filter & Search
  enableFiltering: false,
  filterStyle: "buttons",
  enableSearch: false,
};