import { ProjectsCustomizationState } from "@/types/projects/portfolio";

export const defaultProjectsStyles: ProjectsCustomizationState = {
  layout: "grid",
  gridColumns: 2,
  cardSpacing: 24,
  cardBorderRadius: 12,
  imageBorderRadius: 8,
  cardBackground: "bg-stone-800/30",
  cardBorder: "border-gray-700",
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