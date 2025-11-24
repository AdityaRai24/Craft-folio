import { ProjectsCustomizationState } from "@/types/projects/portfolio";

export const defaultProjectsStyles: ProjectsCustomizationState = {
  layout: "single",
  gridColumns: 3,
  cardSpacing: 8,
  cardBorderRadius: 8,
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
  cardPadding: 4,
  imageOverlay: true,
  imagePosition: "left",
  
  // Typography
  titleSize: "md",
  titleWeight: "semibold",
  descriptionSize: "md",
  descriptionWeight: "normal",
};