import { ExperienceCustomizationState } from "@/types/interfaces/ExperienceCustomizationState";
import { getVariantByName } from "@/lib/animationVariants";

export const useExperienceStyles = (customization: ExperienceCustomizationState, theme: "light" | "dark", primaryColor: string) => {
  const isDark = theme === "dark";

  const getCardClasses = () => {
    let classes = `relative transition-all  transform h-full flex flex-col `;

    // Layout based classes
    if (customization.cardLayout === "default") {
      classes += isDark ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200 shadow-md";
    } else if (customization.cardLayout === "minimal") {
      classes += "bg-transparent border-0";
    } else if (customization.cardLayout === "glass") {
      classes += isDark ? "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50" : "bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg";
    } else if (customization.cardLayout === "neon") {
      classes += isDark ? "bg-zinc-900 border shadow-lg" : "bg-white border shadow-lg";
    } else if (customization.cardLayout === "gradient") {
      classes += isDark ? "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md";
    }

    return classes;
  };

  const getCardStyle = (isHovered: boolean) => ({
    borderRadius: `${customization.cardBorderRadius}px`,
    padding: `${customization.cardPadding}px`,
    borderWidth: customization.cardLayout === "minimal" ? 0 : `${customization.borderWidth}px`,
    transform: customization.hoverEffects && isHovered ? "translateY(-4px)" : "none",
    filter: customization.glowEffect ? `drop-shadow(0 0 20px ${primaryColor}30)` : "none",
    ...(customization.cardLayout === "neon" && {
      borderColor: `${primaryColor}50`,
      boxShadow: `0 0 20px ${primaryColor}20`,
    }),
  });

  const getTitleClasses = () => {
    const sizeMap = {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
      "2xl": "text-4xl",
      "3xl": "text-5xl",
    };
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    let alignClass = "text-left";
    if (customization.textAlignment === "center") alignClass = "text-center";
    if (customization.textAlignment === "right") alignClass = "text-right";

    return `${sizeMap[customization.titleSize]} ${weightMap[customization.titleWeight]} ${alignClass} ${isDark ? "text-white" : "text-gray-900"}`;
  };

  const getDescriptionClasses = () => {
    const sizeMap = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    return `${sizeMap[customization.descriptionSize]} leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`;
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
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}20`,
        color: isDark ? "white" : "black"
      };
    }
    return {};
  };

  const getContainerClasses = () => {
    const widthMap = {
      narrow: "max-w-4xl",
      wide: "max-w-6xl",
      full: "max-w-7xl",
    };
    // Default to 'full' if undefined
    const width = customization.containerWidth || "full";
    return `${widthMap[width as keyof typeof widthMap]} mx-auto flex flex-col`;
  };

  const getContainerStyle = () => ({
    gap: `${customization.cardSpacing}px`
  });

  const getTimelineStyles = () => {
    const dotSizeMap = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    const dotStyleMap = {
      circle: "rounded-full",
      square: "rounded-none",
      diamond: "rotate-45",
      hexagon: "rounded-none",
    };

    let lineClasses = "";
    let lineStyle: any = {
      backgroundColor: primaryColor,
      width: `${customization.timelineWidth}px`,
      opacity: 0.3,
    };

    if (customization.timelineStyle === "dots") {
      lineClasses = "";
      lineStyle = {
        borderLeft: `${customization.timelineWidth}px dotted ${primaryColor}`,
        width: "0px",
        opacity: 0.5,
      };
    } else if (customization.timelineStyle === "gradient") {
      lineStyle = {
        background: `linear-gradient(to bottom, ${primaryColor}00, ${primaryColor}, ${primaryColor}00)`,
        width: `${customization.timelineWidth}px`,
        opacity: 0.8,
      };
    } else if (customization.timelineStyle === "minimal") {
      lineStyle = {
        backgroundColor: primaryColor,
        width: `${Math.max(1, customization.timelineWidth / 2)}px`,
        opacity: 0.1,
      };
    }

    return {
      dot: `${dotSizeMap[customization.dotSize]} ${dotStyleMap[customization.dotStyle]}`,
      line: lineClasses,
      lineStyle,
      dotStyle: {
        backgroundColor: primaryColor,
        zIndex: 10,
        ...(customization.dotStyle === "hexagon" && {
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }),
      },
    };
  };

  const getAnimationVariants = () => {
    // Use shared animation variants from lib/animationVariants
    return getVariantByName(customization.animationStyle);
  };

  const getBadgeClasses = () => {
    return `px-2 sm:px-3 py-1  ${customization.badgeStyle === "outlined" ? "border" : ""}`;
  };

  const getBadgeStyle = () => {
    return {
      backgroundColor: customization.badgeStyle === "outlined" ? "transparent" : `${primaryColor}20`,
      color: primaryColor,
      borderRadius: "20px",
      border: customization.badgeStyle === "outlined" ? `1px solid ${primaryColor}` : "none",
      boxShadow: customization.badgeStyle === "glow" ? `0 0 10px ${primaryColor}30` : "none",
    };
  };

  const getRoleClasses = () => {
    const sizeMap = {
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
    return `${sizeMap[customization.roleSize]} ${weightMap[customization.roleWeight]} tracking-tight`;
  };

  const getCompanyClasses = () => {
    const sizeMap = {
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
    };
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return `${sizeMap[customization.companyNameSize]} ${weightMap[customization.companyNameWeight]}`;
  };

  const getDescriptionTextClasses = () => {
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
    return `${sizeMap[customization.descriptionTextSize]} ${weightMap[customization.descriptionTextWeight || "normal"]} leading-relaxed`;
  };

  const getDateClasses = () => {
    const sizeMap = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return `${sizeMap[customization.dateSize]} ${weightMap[customization.dateWeight || "medium"]}`;
  };

  const getLocationClasses = () => {
    const sizeMap = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return `${sizeMap[customization.locationSize || "sm"]} ${weightMap[customization.locationWeight || "normal"]}`;
  };

  return {
    getCardClasses,
    getCardStyle,
    getTitleClasses,
    getDescriptionClasses,
    getTechStackClasses,
    getTechStackStyle,
    getContainerClasses,
    getContainerStyle,
    getTimelineStyles,
    getAnimationVariants,
    getBadgeClasses,
    getBadgeStyle,
    getRoleClasses,
    getCompanyClasses,
    getDescriptionTextClasses,
    getDateClasses,
    getLocationClasses
  };
};
