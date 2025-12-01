import { EducationCustomizationState } from "@/types/interfaces/EducationCustomizationState";

export const useLumenEducationStyles = (
    effectiveCustomization: EducationCustomizationState,
    theme: string,
    themeClasses: any,
    hoveredEducation: number | null
) => {
    const getCardClasses = () => {
        return `relative transition-all duration-${effectiveCustomization.animationSpeed / 100
            } transform group-hover:translate-y-[-4px] h-full flex flex-col ${effectiveCustomization.cardStyle === "default"
                ? theme === "light"
                    ? "bg-white border border-gray-200 shadow-sm"
                    : "bg-zinc-800 border border-zinc-700"
                : effectiveCustomization.cardStyle === "minimal"
                    ? "bg-transparent border-0"
                    : effectiveCustomization.cardStyle === "glass"
                        ? theme === "light"
                            ? "bg-white/50 backdrop-blur-sm border border-white/20"
                            : "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50"
                        : effectiveCustomization.cardStyle === "neon"
                            ? theme === "light"
                                ? "bg-emerald-50/30 border border-emerald-300/50 shadow-lg shadow-emerald-500/20"
                                : "bg-zinc-900 border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
                            : effectiveCustomization.cardStyle === "gradient"
                                ? theme === "light"
                                    ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200"
                                    : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700"
                                : theme === "light"
                                    ? "bg-white border border-gray-200 shadow-sm"
                                    : "bg-zinc-800 border border-zinc-700"
            }`;
    };

    const getCardStyle = (index: number) => {
        return {
            borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
            padding: `${effectiveCustomization.cardPadding}px`,
            borderWidth:
                effectiveCustomization.cardStyle === "minimal"
                    ? 0
                    : `${effectiveCustomization.borderWidth}px`,
            transform:
                effectiveCustomization.hoverEffects && hoveredEducation === index
                    ? "translateY(-4px) scale(1.02)"
                    : "none",
            ...(effectiveCustomization.glowEffect && {
                filter: theme === "light"
                    ? "drop-shadow(0 0 20px rgba(249,115,22,0.2))"
                    : "drop-shadow(0 0 20px rgba(16, 185, 129, 0.2))"
            }),
            ...(effectiveCustomization.cardShadow && {
                boxShadow: theme === "light"
                    ? `0 ${effectiveCustomization.shadowIntensity * 4}px ${effectiveCustomization.shadowIntensity * 8}px rgba(0,0,0,0.1), 0 0 ${effectiveCustomization.shadowIntensity * 20}px rgba(249,115,22,0.15)`
                    : `0 ${effectiveCustomization.shadowIntensity * 4}px ${effectiveCustomization.shadowIntensity * 8}px rgba(0,0,0,0.1), 0 0 ${effectiveCustomization.shadowIntensity * 20}px rgba(16, 185, 129, 0.15)`,
            }),
        };
    };

    const getTitleClasses = () => {
        return `transition-colors duration-300 ${theme === "light" ? "text-gray-900" : themeClasses.textPrimary
            } ${effectiveCustomization.textAlignment === "center"
                ? "text-center"
                : effectiveCustomization.textAlignment === "right"
                    ? "text-right"
                    : "text-left"
            } ${effectiveCustomization.titleSize === "sm"
                ? "text-lg"
                : effectiveCustomization.titleSize === "md"
                    ? "text-xl"
                    : effectiveCustomization.titleSize === "lg"
                        ? "text-2xl"
                        : "text-3xl"
            } ${effectiveCustomization.titleWeight === "normal"
                ? "font-normal"
                : effectiveCustomization.titleWeight === "medium"
                    ? "font-medium"
                    : effectiveCustomization.titleWeight === "semibold"
                        ? "font-semibold"
                        : "font-bold"
            }`;
    };

    const getGlowStyle = () => {
        return {
            background:
                theme === "light"
                    ? "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1))"
                    : themeClasses.gradientHover,
        };
    };

    const getDotStyle = () => {
        return {
            background:
                theme === "light"
                    ? "linear-gradient(to right, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                    : themeClasses.gradientPrimary,
        };
    };

    const getAccentLineStyle = () => {
        return {
            width: `${effectiveCustomization.accentLineWidth}px`,
            background:
                theme === "light"
                    ? "linear-gradient(to bottom, rgba(249,115,22,0.8), rgba(234,88,12,0.8))"
                    : themeClasses.gradientPrimary,
        };
    };

    return {
        getCardClasses,
        getCardStyle,
        getTitleClasses,
        getGlowStyle,
        getDotStyle,
        getAccentLineStyle,
    };
};
