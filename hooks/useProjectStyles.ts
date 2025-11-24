import { ProjectsCustomizationState } from "@/types/projects/portfolio";

export const useProjectStyles = (customization: ProjectsCustomizationState, titleColor: string) => {
  
  const getLayoutClasses = () => {
    switch (customization.layout) {
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${customization.gridColumns}`;
      default:
        return `flex flex-col`;
    }
  };

  const getLayoutStyle = () => {
    return { gap: `${customization.cardSpacing}px` };
  };

  const getCardClasses = () => {
    let classes = `${customization.cardBackground}  section-card border ${
      customization.cardBorder
    } overflow-hidden transition-all duration-${Math.round(
      customization.animationSpeed * 1000
    )} cursor-pointer hover:bg-zinc-900/80`;

    return classes;
  };

  const getCardStyle = () => ({
    borderRadius: `${customization.cardBorderRadius}px`,
    padding: `${customization.cardPadding * 4}px`,
  });

  const getImageStyle = () => {
    let aspectRatio = "auto";

    switch (customization.imageAspectRatio) {
      case "square":
        aspectRatio = "1 / 1";
        break;
      case "wide":
        aspectRatio = "16 / 9";
        break;
      case "tall":
        aspectRatio = "3 / 4";
        break;
    }

    return {
      borderRadius: `${customization.imageBorderRadius}px`,
      height:
        customization.imageAspectRatio === "auto"
          ? `${customization.imageHeight}px`
          : "auto",
      aspectRatio:
        customization.imageAspectRatio !== "auto" ? aspectRatio : undefined,
    };
  };

  const getButtonClasses = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? customization.githubButtonStyle
        : customization.liveButtonStyle;
    let classes =
      "flex items-center gap-2 px-3 py-1.5 transition-all duration-300 text-sm";

    switch (style) {
      case "filled":
        classes += " text-white";
        break;
      case "ghost":
        classes += " bg-transparent hover:bg-gray-800/50";
        break;
      case "minimal":
        classes += " bg-transparent border-0 underline hover:underline";
        break;
      default:
        classes += " bg-transparent border rounded-md hover:text-white";
    }

    return classes;
  };

  const getButtonStyle = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? customization.githubButtonStyle
        : customization.liveButtonStyle;

    return {
      borderRadius: `${customization.buttonBorderRadius}px`,
      borderColor: style !== "minimal" ? `${titleColor}30` : "transparent",
      color: style === "filled" ? "white" : titleColor,
      backgroundColor: style === "filled" ? titleColor : "transparent",
    };
  };

  const getTechStackClasses = () => {
    let classes =
      "px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300";

    switch (customization.techStackStyle) {
      case "badges":
        classes += " bg-gray-800 text-white rounded";
        break;
      case "minimal":
        classes += " text-gray-300 hover:text-white";
        break;
      case "colorful":
        classes += " text-white rounded-full border-2";
        break;
      default:
        classes += " text-white rounded-full border border-gray-700";
    }

    return classes;
  };

  const getTitleAlignment = () => {
    switch (customization.titleAlignment) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const getTitleClasses = () => {
    const sizeMap = {
      sm: "text-lg md:text-xl",
      md: "text-xl md:text-2xl",
      lg: "text-2xl md:text-3xl",
      xl: "text-3xl md:text-4xl",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return `section-sub-title ${sizeMap[customization.titleSize]} ${weightMap[customization.titleWeight]} transition-colors duration-300`;
  };

  const getDescriptionClasses = () => {
    const sizeMap = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return `section-sub-description ${sizeMap[customization.descriptionSize]} ${weightMap[customization.descriptionWeight]}`;
  };

  return {
    getLayoutClasses,
    getLayoutStyle,
    getCardClasses,
    getCardStyle,
    getImageStyle,
    getButtonClasses,
    getButtonStyle,
    getTechStackClasses,
    getTitleAlignment,
    getTitleClasses,
    getDescriptionClasses
  };
};
