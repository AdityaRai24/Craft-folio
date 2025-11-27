import { ProjectsCustomizationState } from "@/types/projects/portfolio";

export const useProjectStyles = (customization: ProjectsCustomizationState, titleColor: string, theme: "light" | "dark" = "light") => {
  const isDark = theme === "dark";

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
    let classes = `section-card border overflow-hidden transition-all duration-${Math.round(
      customization.animationSpeed * 1000
    )} cursor-pointer `;

    // Background and Border
    if (isDark) {
      classes += "bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#4a4a4a] shadow-xl hover:bg-zinc-900/80";
    } else {
      // Light mode: clean white cards with elegant shadows
      classes += "bg-white border-gray-200 hover:border-gray-300 shadow-md hover:shadow-xl";
    }

    return classes;
  };

  const getCardStyle = (isHovered: boolean = false) => ({
    borderRadius: `${customization.cardBorderRadius}px`,
    padding: `${customization.cardPadding * 4}px`,
    backdropFilter: isDark ? "blur(10px)" : "none",
    transform: customization.hoverEffects && isHovered ? "translateY(-4px)" : "none",
    filter: customization.glowEffect ? `drop-shadow(0 0 20px ${titleColor}30)` : "none",
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
      "flex items-center gap-2 px-3 py-1.5 transition-all duration-300 text-sm ";

    // Base styles based on theme
    if (style === "default") {
        if (buttonType === "live") {
             classes += isDark 
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-sm hover:shadow-md" 
                : "bg-blue-500 hover:bg-blue-600 text-white border-blue-400 shadow-sm hover:shadow-md";
        } else {
             classes += isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600 shadow-sm hover:shadow-md"
                : "bg-gray-800 hover:bg-gray-900 text-white border-gray-700 shadow-sm hover:shadow-md";
        }
    } else if (style === "filled") {
      classes += " text-white";
    } else if (style === "ghost") {
      classes += isDark ? " bg-transparent hover:bg-gray-800/50 text-white" : " bg-transparent hover:bg-gray-100 text-gray-900";
    } else if (style === "minimal") {
      classes += isDark ? " bg-transparent border-0 underline hover:underline text-white" : " bg-transparent border-0 underline hover:underline text-gray-900";
    }

    if (style !== "default" && style !== "minimal" && style !== "ghost" && style !== "filled") {
         classes += " bg-transparent border rounded-md hover:text-white";
    }

    return classes;
  };

  const getButtonStyle = (buttonType: "github" | "live") => {
    const style =
      buttonType === "github"
        ? customization.githubButtonStyle
        : customization.liveButtonStyle;
    
    // If default, we handle colors in classes
    if (style === "default") {
        return {
            borderRadius: `${customization.buttonBorderRadius}px`,
        };
    }

    return {
      borderRadius: `${customization.buttonBorderRadius}px`,
      borderColor: style !== "minimal" ? `${titleColor}30` : "transparent",
      color: style === "filled" ? "white" : titleColor,
      backgroundColor: style === "filled" ? titleColor : "transparent",
    };
  };

  const getTechStackClasses = () => {
    let classes =
      "px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 ";

    switch (customization.techStackStyle) {
      case "badges":
        classes += isDark ? "bg-gray-800 text-white rounded" : "bg-gray-800 text-white rounded";
        break;
      case "minimal":
        classes += isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900";
        break;
      case "colorful":
        classes += "text-white rounded-full border-2";
        break;
      case "pills":
      default:
         classes += isDark 
            ? "bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700 hover:border-gray-500 rounded-full"
            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-full";
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

    return `section-sub-title ${sizeMap[customization.titleSize]} ${weightMap[customization.titleWeight]} transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`;
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

    return `section-sub-description ${sizeMap[customization.descriptionSize]} ${weightMap[customization.descriptionWeight]} ${isDark ? "text-gray-400" : "text-gray-600"}`;
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
