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
  cardSpacing: number;
  cardBorderRadius: number;
  imageBorderRadius: number;
  cardBackground: string;
  cardBorder: string;
  cardStyle: "default" | "minimal" | "glassmorphism" | "neon" | "gradient" | "elevated" | "outlined" | "filled";
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
  hoverEffects: boolean;
  glowEffect: boolean;

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
  showImages?: boolean;
  projectTitleColor?: "gray-900" | "gray-800" | "primary";
  projectDescriptionColor?: "gray-600" | "gray-700" | "gray-800";

  // Tech Stack (SimpleWhite-specific, optional for others)
  techStackVisible?: boolean;
  techStackSize?: "sm" | "md" | "lg";

  // Project Links (SimpleWhite-specific, optional for others)
  linksVisible?: boolean;
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

export const defaultProjectsStyles: ProjectsCustomizationState = {
  layout: "grid",
  gridColumns: 2,
  cardSpacing: 24,
  cardBorderRadius: 12,
  imageBorderRadius: 8,
  cardBackground: "bg-stone-800/30",
  cardBorder: "border-gray-700",
  cardStyle: "default",
  imageAspectRatio: "auto",
  imageHeight: 208,
  githubButtonStyle: "default",
  liveButtonStyle: "default",
  buttonBorderRadius: 6,
  techStackStyle: "pills",
  animationSpeed: 0.3,
  titleAlignment: "left",
  cardPadding: 6,
  imageOverlay: true,
  imagePosition: "left",
  hoverEffects: true,
  glowEffect: true,

  // Typography
  titleSize: "md",
  titleWeight: "semibold",
  descriptionSize: "xs",
  descriptionWeight: "normal",
};
