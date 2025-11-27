import { ExperienceCustomizationState } from "@/components/NeoSpark/defaultStyles/types";

export const useExperienceStyles = (customization: ExperienceCustomizationState, theme: "light" | "dark", primaryColor: string) => {
  const isDark = theme === "dark";

  const getCardClasses = () => {
    let classes = `relative transition-all duration-${Math.round(customization.animationSpeed / 100)} transform h-full flex flex-col `;
    
    // Layout based classes
    if (customization.cardLayout === "default") {
       classes += isDark ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200 shadow-md";
    } else if (customization.cardLayout === "minimal") {
       classes += "bg-transparent border-0";
    } else if (customization.cardLayout === "glassmorphism") {
       classes += isDark ? "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50" : "bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg";
    } else if (customization.cardLayout === "neon") {
       classes += isDark ? "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20" : "bg-white border border-emerald-300/50 shadow-lg shadow-emerald-500/10";
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
  });

  const getTitleClasses = () => {
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
    let classes = "px-2 py-1 text-xs font-medium transition-all duration-300 ";
    
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

  return {
    getCardClasses,
    getCardStyle,
    getTitleClasses,
    getDescriptionClasses,
    getTechStackClasses,
    getTechStackStyle
  };
};
