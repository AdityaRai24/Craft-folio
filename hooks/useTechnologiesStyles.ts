import { TechnologiesCustomizationState } from "@/types/technologies/portfolio";
import { getVariantByName } from "@/lib/animationVariants";

export const useTechnologiesStyles = (
    customization: TechnologiesCustomizationState,
    primaryColor: string,
    theme: "light" | "dark" = "light"
) => {
    const isDark = theme === "dark";

    const getSectionClasses = () => {
        return `py-20 ${isDark ? "bg-zinc-900" : "bg-white"}`;
    };

    const getGridClasses = () => {
        const columnsMap: Record<number, string> = {
            2: "grid-cols-2",
            3: "grid-cols-2 sm:grid-cols-3",
            4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
            5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
            6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
            8: "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
        };

        const maxWidthMap: Record<string, string> = {
            sm: "max-w-3xl",
            md: "max-w-4xl",
            lg: "max-w-5xl",
            xl: "max-w-6xl",
            "2xl": "max-w-7xl",
            full: "w-full",
        };

        return `grid ${columnsMap[customization.gridColumns] || "grid-cols-4"} ${maxWidthMap[customization.containerWidth]} mx-auto`;
    };

    const getCardClasses = () => {
        const styleMap: Record<string, string> = isDark
            ? {
                minimal: "bg-transparent border-0",
                elevated: "bg-zinc-800 shadow-xl",
                outlined: "border border-zinc-700 bg-transparent",
                filled: "bg-zinc-800",
                glass: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50",
                neon: "bg-zinc-900 border border-purple-500/30 shadow-lg shadow-purple-500/20",
                gradient: "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700",
                default: "bg-zinc-800 border border-zinc-700",
            }
            : {
                minimal: "bg-transparent border-0",
                elevated: "bg-white shadow-md",
                outlined: "border border-gray-300 bg-transparent",
                filled: "bg-gray-100",
                glass: "bg-white/50 backdrop-blur-sm border border-white/20",
                neon: "bg-orange-50/30 border border-orange-300/50 shadow-lg shadow-orange-500/20",
                gradient: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200",
                default: "bg-white border border-gray-200 shadow-sm",
            };

        const hoverMap: Record<string, string> = {
            lift: "hover:shadow-lg hover:-translate-y-1",
            glow: `hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] ${isDark ? "hover:shadow-purple-500/50" : `hover:shadow-[${primaryColor}]/40`}`,
            scale: "hover:scale-105",
            rotate: "hover:rotate-3",
            none: "",
        };

        return `group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${styleMap[customization.cardStyle]
            } ${customization.hoverEffects ? hoverMap[customization.cardHoverEffect] : ""}`;
    };

    const getIconClasses = () => {
        return `flex items-center justify-center rounded-lg mb-3`;
    };

    const getLabelClasses = () => {
        const sizeMap: Record<string, string> = {
            xs: "text-xs",
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
        };

        const weightMap: Record<string, string> = {
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
        };

        return `${weightMap[customization.labelWeight]} ${sizeMap[customization.labelSize]} ${isDark ? "text-gray-300" : "text-gray-700"
            } mt-3 text-center`;
    };

    const getCardStyle = () => {
        if (customization.cardStyle === "neon") {
            return {
                borderColor: `${primaryColor}50`,
                boxShadow: `0 0 15px ${primaryColor}30`,
            };
        }
        return {};
    };

    const getAnimationVariants = () => {
        // Use shared animation variants from lib/animationVariants
        return getVariantByName(customization.animationStyle || "fade");
    };

    return {
        getSectionClasses,
        getGridClasses,
        getCardClasses,
        getCardStyle,
        getIconClasses,
        getLabelClasses,
        getAnimationVariants,
    };
};
