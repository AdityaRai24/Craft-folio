export interface Technology {
  name: string;
  logo: string;
}

export interface Project {
  projectTitle?: string;
  projectName?: string;
  projectDescription?: string;
  projectImage?: string;
  techStack?: Technology[];
  githubLink?: string;
  liveLink?: string;
  year?: string;
}

export interface ProjectsCustomizationState {
  // Layout & Structure
  layout: "single" | "grid";
  gridColumns: number;
  backgroundColor?: string;
  cardSpacing: number;
  cardBorderRadius: number;
  imageBorderRadius: number;
  cardBackground?: string;
  cardBorder?: string;
  cardStyle: "default" | "minimal" | "glass" | "neon" | "gradient";
  imageAspectRatio: "auto" | "square" | "wide" | "tall";
  imageHeight: number;
  githubButtonStyle: "default" | "filled" | "ghost" | "minimal";
  liveButtonStyle: "default" | "filled" | "ghost" | "minimal";
  buttonBorderRadius: number;
  techStackStyle: "pills" | "badges" | "minimal" | "colorful";
  animationSpeed?: number;
  titleAlignment: "left" | "center" | "right";
  cardPadding: number;
  imageOverlay?: boolean;
  imagePosition: "left" | "right";
  hoverEffects?: boolean;
  glowEffect?: boolean;
  borderWidth: number;

  // Typography
  titleSize: "xs" | "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  descriptionSize: "xs" | "sm" | "md" | "lg";
  descriptionWeight: "normal" | "medium" | "semibold" | "bold";

  // Header Section (SimpleWhite-specific, optional for others)
  headerVisible?: boolean;
  titleColor?: "gray-900" | "gray-800" | "black";
  descriptionColor?: "gray-600" | "gray-700" | "gray-800";
  descriptionVisible?: boolean;

  // Project Cards (SimpleWhite-specific, optional for others)

  projectTitleColor?: "gray-900" | "gray-800" | "primary";
  projectDescriptionColor?: "gray-600" | "gray-700" | "gray-800";

  // Tech Stack (SimpleWhite-specific, optional for others)

  techStackSize?: "sm" | "md" | "lg";

  // Project Links (SimpleWhite-specific, optional for others)

  linksStyle?: "buttons" | "icons" | "text";
  linksPosition?: "bottom" | "top" | "overlay";
  githubLinkVisible?: boolean;
  liveLinkVisible?: boolean;
  buttonSize?: "sm" | "md" | "lg";

  // Hover Effects (SimpleWhite-specific, optional for others)
  hoverScale?: boolean;
  hoverShadow?: boolean;
  imageHoverEffect?: "zoom" | "fade" | "overlay" | "none";

  // Animations (SimpleWhite-specific, optional for others)
  staggerAnimation?: boolean;
  entranceAnimation?: "fadeUp" | "fadeIn" | "slideUp" | "none";
  animationStyle?: "scale" | "slide" | "rotate" | "bounce" | "none";
}


