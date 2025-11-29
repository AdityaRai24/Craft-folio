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
  
  //Typography
  titleSize: "xs" | "sm" | "md" | "lg" | "xl";
  titleWeight: "normal" | "medium" | "semibold" | "bold";
  descriptionSize: "xs" | "sm" | "md" | "lg";
  descriptionWeight: "normal" | "medium" | "semibold" | "bold";
}
