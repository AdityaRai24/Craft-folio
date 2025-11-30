import { ProjectsCustomizationState } from "@/types/projects/portfolio";
import { getVariantByName } from "@/lib/animationVariants";

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
    let classes = `relative transition-all  transform h-full flex flex-col `;

    // Layout based classes
    if (customization.cardStyle === "default") {
      classes += isDark ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200 shadow-md";
    } else if (customization.cardStyle === "minimal") {
      classes += "bg-transparent border-0";
    } else if (customization.cardStyle === "glass") {
      classes += isDark ? "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50" : "bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg";
    } else if (customization.cardStyle === "neon") {
      classes += isDark ? "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20" : "bg-white border border-emerald-300/50 shadow-lg shadow-emerald-500/10";
    } else if (customization.cardStyle === "gradient") {
      classes += isDark ? "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md";
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
          ? " text-white shadow-sm hover:shadow-md"
          : " text-white shadow-sm hover:shadow-md";
      } else {
        classes += isDark
          ? " text-white  shadow-sm hover:shadow-md"
          : " text-white  shadow-sm hover:shadow-md";
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
      xs: "text-md",
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
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
      xs: "text-xs",
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

  const getAnimationVariants = () => {
    // Use shared animation variants from lib/animationVariants
    return getVariantByName(customization.animationStyle || "scale");
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
    getDescriptionClasses,
    getAnimationVariants
  };
};
