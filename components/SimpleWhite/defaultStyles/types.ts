export interface SimpleWhiteHeroCustomizationState {
  // Layout & Structure
  contentAlignment: "left" | "center" | "right";
  layoutStyle: "split" | "stacked" | "centered";
  containerPadding: number;
  maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  
  // Background & Theme
  backgroundColor: "white" | "gray-50" | "gray-100";
  backgroundTheme: "diagonal-grid" | "crosshatch" | "circuit-board" | "zigzag-lightning";
  cardBackground: "solid" | "gradient" | "transparent";
  cardBorderStyle: "none" | "subtle" | "bold";
  cardShadow: "none" | "light" | "medium" | "heavy";
  
  // Typography
  titleSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  titleColor: "gray-900" | "gray-800" | "black";
  subtitleSize: "sm" | "md" | "lg" | "xl";
  subtitleWeight: "normal" | "medium" | "semibold" | "bold";
  subtitleColor: "gray-600" | "gray-700" | "gray-800";
  descriptionSize: "sm" | "md" | "lg";
  descriptionColor: "gray-600" | "gray-700" | "gray-800";
  
  // Social Links
  socialLinksVisible: boolean;
  socialLinksStyle: "circular" | "square" | "minimal";
  socialLinksSize: "sm" | "md" | "lg";
  socialLinksHoverEffect: "border" | "scale" | "glow" | "none";
  
  // About Card
  aboutCardVisible: boolean;
  aboutCardStyle: "solid" | "gradient" | "outline";
  aboutCardBorder: "none" | "subtle" | "bold";
  aboutCardShadow: "none" | "light" | "medium" | "heavy";
  
  // Resume Button
  resumeButtonVisible: boolean;
  resumeButtonStyle: "default" | "animated" | "minimal" | "outline";
  resumeButtonSize: "sm" | "md" | "lg";
  
  // Scroll Indicator
  scrollIndicatorVisible: boolean;
  scrollIndicatorStyle: "chevron" | "dots" | "line" | "arrow";
  scrollIndicatorColor: "gray-400" | "gray-500" | "gray-600";
  
  // Animations
  animationSpeed: "slow" | "normal" | "fast";
  staggerAnimation: boolean;
  hoverEffects: boolean;
}

export interface SimpleWhiteProjectsCustomizationState {
  // Layout & Structure
  layout: "single" | "grid";
  gridColumns: number;
  cardSpacing: number;
  cardBorderRadius: number;
  imageBorderRadius: number;
  cardBackground: string;
  cardBorder: string;
  imageAspectRatio: "auto" | "square" | "wide" | "tall";
  imageHeight: number;
  githubButtonStyle: "default" | "filled" | "ghost" | "minimal";
  liveButtonStyle: "default" | "filled" | "ghost" | "minimal";
  buttonBorderRadius: number;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  animationSpeed: number;
  titleAlignment: "left" | "center" | "right";
  cardPadding: number;
  imageOverlay: boolean;
  imagePosition: "left" | "right";
  
  // Typography
  titleSize: "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  descriptionSize: "sm" | "md" | "lg";
  descriptionWeight: "normal" | "medium" | "semibold" | "bold";
  
  // Header Section
  headerVisible: boolean;
  titleColor: "gray-900" | "gray-800" | "black";
  descriptionColor: "gray-600" | "gray-700" | "gray-800";
  descriptionVisible: boolean;
  
  // Project Cards
  showImages: boolean;
  projectTitleColor: "gray-900" | "gray-800" | "primary";
  projectDescriptionColor: "gray-600" | "gray-700" | "gray-800";
  
  // Tech Stack
  techStackVisible: boolean;
  techStackSize: "sm" | "md" | "lg";
  
  // Project Links
  linksVisible: boolean;
  linksStyle: "buttons" | "icons" | "text";
  linksPosition: "bottom" | "top" | "overlay";
  githubLinkVisible: boolean;
  liveLinkVisible: boolean;
  buttonSize: "sm" | "md" | "lg";
  
  // Hover Effects
  hoverEffects: boolean;
  hoverScale: boolean;
  hoverShadow: boolean;
  imageHoverEffect: "zoom" | "fade" | "overlay" | "none";
  
  // Animations
  staggerAnimation: boolean;
  entranceAnimation: "fadeUp" | "fadeIn" | "slideUp" | "none";
}

export interface SimpleWhiteExperienceCustomizationState {
  // Layout & Structure
  layout: "cards";
  containerPadding: number;
  maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  
  // Background & Theme
  backgroundColor: "white" | "gray-50" | "gray-100";
  cardBackground: "solid" | "gradient" | "glass";
  cardBorderStyle: "none" | "subtle" | "bold";
  cardShadow: "none" | "light" | "medium" | "heavy";
  cardBorderRadius: "none" | "sm" | "md" | "lg" | "xl";
  
  // Header Section
  headerVisible: boolean;
  titleSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  titleColor: "gray-900" | "gray-800" | "black";
  titleAlignment: "left" | "center" | "right";
  descriptionSize: "sm" | "md" | "lg";
  descriptionColor: "gray-600" | "gray-700" | "gray-800";
  descriptionVisible: boolean;
  

  
  // Experience Cards
  companyNameSize: "sm" | "md" | "lg" | "xl";
  companyNameWeight: "normal" | "medium" | "semibold" | "bold";
  companyNameColor: "gray-600" | "gray-700" | "gray-900";
  roleSize: "sm" | "md" | "lg" | "xl";
  roleWeight: "normal" | "medium" | "semibold" | "bold";
  roleColor: "gray-900" | "gray-800" | "primary";
  dateFormat: "month-year" | "full-date" | "year-only";
  dateColor: "gray-500" | "gray-600" | "gray-700";
  locationVisible: boolean;
  locationColor: "gray-500" | "gray-600" | "gray-700";
  descriptionTextSize: "sm" | "md" | "lg";
  descriptionTextColor: "gray-600" | "gray-700" | "gray-800";
  
  // Tech Stack
  techStackVisible: boolean;
  techStackStyle: "badges" | "pills" | "minimal";
  techStackLimit: 3 | 4 | 5 | 6 | 7;
  techStackColor: "gray" | "blue" | "green" | "purple";
  techStackShowIcons: boolean;
  
  // Hover Effects
  hoverEffects: boolean;
  hoverScale: boolean;
  hoverShadow: boolean;
  cardHoverEffect: "lift" | "glow" | "border" | "none";
  
  // Animations
  animationSpeed: "slow" | "normal" | "fast";
  staggerAnimation: boolean;
  entranceAnimation: "fadeUp" | "slideIn" | "scaleUp" | "none";
  alternatingLayout: boolean;
}

export interface SimpleWhiteSkillsCustomizationState {
  // Layout & Structure
  layout: "grid" | "masonry" | "list" | "carousel";
  gridColumns: 2 | 3 | 4 | 5 | 6;
  mobileColumns: 1 | 2 | 3;
  spacing: "compact" | "normal" | "spacious";
  containerPadding: number;
  maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  
  // Background & Theme
  backgroundColor: "white" | "gray-50" | "gray-100" | "gray-900";
  cardBackground: "solid" | "gradient" | "glass" | "transparent";
  cardBorderStyle: "none" | "subtle" | "bold" | "rounded";
  cardShadow: "none" | "light" | "medium" | "heavy";
  cardBorderRadius: "none" | "sm" | "md" | "lg" | "xl";
  
  // Header Section
  headerVisible: boolean;
  titleSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  titleColor: "gray-800" | "gray-900" | "black" | "white";
  titleAlignment: "left" | "center" | "right";
  descriptionSize: "sm" | "md" | "lg";
  descriptionColor: "gray-600" | "gray-700" | "gray-400";
  descriptionVisible: boolean;
  
  // Skill Cards
  cardStyle: "minimal" | "elevated" | "outlined" | "filled";
  showIcons: boolean;
  iconSize: "sm" | "md" | "lg" | "xl";
  showLabels: boolean;
  labelSize: "xs" | "sm" | "md" | "lg";
  labelWeight: "normal" | "medium" | "semibold" | "bold";
  labelColor: "gray-600" | "gray-700" | "gray-800" | "gray-200";
  labelPosition: "bottom" | "overlay" | "side";
  
  // Grouping & Categories
  groupByCategory: boolean;
  categoryStyle: "headers" | "pills" | "sections";
  categoryColor: "gray" | "blue" | "green" | "purple" | "primary";
  showCategoryLabels: boolean;
  
  // Hover Effects
  hoverEffects: boolean;
  hoverScale: boolean;
  hoverShadow: boolean;
  hoverRotation: boolean;
  cardHoverEffect: "lift" | "glow" | "scale" | "rotate" | "none";
  
  // Progress & Skills Level
  showProgress: boolean;
  progressStyle: "bars" | "circles" | "dots" | "stars";
  progressColor: "gray" | "blue" | "green" | "purple" | "primary";
  progressPosition: "bottom" | "overlay" | "side";
  
  // Animations
  animationSpeed: "slow" | "normal" | "fast";
  staggerAnimation: boolean;
  
  // Filter & Search
  enableFiltering: boolean;
  filterStyle: "buttons" | "dropdown" | "tags";
  enableSearch: boolean;
} 