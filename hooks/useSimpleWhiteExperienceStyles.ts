import { ExperienceCustomizationState } from "@/types/interfaces/ExperienceCustomizationState";

export const useSimpleWhiteExperienceStyles = (
    effectiveCustomization: ExperienceCustomizationState
) => {
    const alignmentMap: Record<string, string> = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    const titleSizeMap: Record<string, string> = {
        sm: "text-2xl md:text-3xl",
        md: "text-3xl md:text-4xl",
        lg: "text-4xl md:text-5xl",
        xl: "text-4xl md:text-5xl",
        "2xl": "text-5xl md:text-6xl",
        "3xl": "text-6xl md:text-7xl",
    };

    const weightMap: Record<string, string> = {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
    };

    const getHeaderClasses = () => {
        return {
            container: `${alignmentMap[effectiveCustomization.titleAlignment]
                } mb-12 sm:mb-16 md:mb-20`,
            title: `font-display section-title ${titleSizeMap[effectiveCustomization.titleSize]
                } ${weightMap[effectiveCustomization.titleWeight]
                } tracking-tight text-${effectiveCustomization.titleColor
                } mb-3 sm:mb-4 transition-all duration-700`,
            description: `font-sans text-base sm:text-lg section-description md:text-xl font-normal text-${effectiveCustomization.descriptionColor
                } tracking-normal leading-relaxed max-w-2xl ${effectiveCustomization.titleAlignment === "center" ? "mx-auto" : ""
                } transition-all duration-700`,
        };
    };

    return {
        getHeaderClasses,
    };
};
