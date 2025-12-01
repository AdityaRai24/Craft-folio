import { ProjectsCustomizationState } from "@/types/interfaces/ProjectsCustomizationState";
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
      classes += isDark ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200 shadow-lg hover:shadow-xl";
    } else if (customization.cardStyle === "minimal") {
      classes += isDark ? "bg-transparent border-0" : "bg-transparent border-0 shadow-none";
    } else if (customization.cardStyle === "glass") {
      classes += isDark ? "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50" : "bg-white/80 backdrop-blur-md border border-white/20 shadow-xl ring-1 ring-black/5";
    } else if (customization.cardStyle === "neon") {
      classes += isDark ? "bg-zinc-900 border shadow-lg" : "bg-white border-2 border-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]";
    } else if (customization.cardStyle === "gradient") {
      classes += isDark ? "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700" : "bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-md";
    }

    return classes;
  };

  const getCardStyle = (isHovered: boolean = false) => ({
    borderRadius: `${customization.cardBorderRadius}px`,
    padding: `${customization.cardPadding * 4}px`,
    backdropFilter: isDark ? "blur(10px)" : "none",
    transform: customization.hoverEffects && isHovered ? "translateY(-4px)" : "none",
    filter: customization.glowEffect ? `drop-shadow(0 0 20px ${titleColor}30)` : "none",
    ...(customization.cardStyle === "neon" && {
      borderColor: `${titleColor}50`,
      boxShadow: `0 0 20px ${titleColor}20`,
    }),
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
          : " text-gray-900 shadow-sm hover:shadow-md";
      } else {
        classes += isDark
          ? " text-white  shadow-sm hover:shadow-md"
          : " text-gray-900 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50";
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
    let classes = "inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium transition-all duration-300 ";

    if (customization.techStackStyle === "pills") {
      classes += "rounded-full border ";
      classes += isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600";
    } else if (customization.techStackStyle === "badges") {
      classes += isDark ? "rounded bg-gray-700 text-white" : "rounded bg-gray-200 text-gray-800";
    } else if (customization.techStackStyle === "minimal") {
      classes += isDark ? "text-gray-400" : "text-gray-600";
    } else if (customization.techStackStyle === "colorful") {
      classes += "rounded-full border-2";
    }

    return classes;
  };

  const getTechStackStyle = () => {
    if (customization.techStackStyle === "colorful") {
      return {
        borderColor: titleColor,
        backgroundColor: `${titleColor}20`,
        color: isDark ? "white" : "black"
      };
    }
    return {};
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
    getTechStackStyle,
    getTitleAlignment,
    getTitleClasses,
    getDescriptionClasses,
    getAnimationVariants
  };
};
