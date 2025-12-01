import { SimpleWhiteHeroCustomizationState } from "@/types/simplewhite/hero-types";

export const useSimpleWhiteHeroStyles = (
    customization: SimpleWhiteHeroCustomizationState,
    theme: any,
    ColorTheme: any
) => {
    // Theme colors
    const primaryColor = theme?.colors?.primary || ColorTheme.primary;
    const primaryHoverColor = theme?.colors?.primaryHover || ColorTheme.primaryHover;
    const textPrimaryColor = theme?.colors?.text?.primary || ColorTheme.textPrimary;
    const textSecondaryColor = theme?.colors?.text?.secondary || ColorTheme.textSecondary;
    const backgroundPrimaryColor = theme?.colors?.background?.primary || ColorTheme.bgMain;
    const backgroundSecondaryColor = theme?.colors?.background?.secondary || ColorTheme.bgCard;

    const getContainerClasses = () => {
        const alignmentMap = {
            center: "text-center",
            left: "text-left",
            right: "text-right",
        };

        const maxWidthMap = {
            sm: "max-w-sm",
            md: "max-w-2xl",
            lg: "max-w-4xl",
            xl: "max-w-6xl",
            "2xl": "max-w-7xl",
            full: "w-full",
        };

        return `max-w-[95%] !mt-12 md:mt-0 sm:max-w-[90%] lg:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto px-4 pb-4 sm:pb-8 lg:pb-0 sm:px-6 lg:px-8 ${alignmentMap[customization.contentAlignment]
            } ${maxWidthMap[customization.maxWidth]}`;
    };

    const getTitleClasses = () => {
        const sizeMap = {
            sm: "text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl",
            md: "text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl",
            lg: "text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl",
            xl: "text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl",
            "2xl": "text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl",
            "3xl": "text-7xl sm:text-8xl md:text-9xl lg:text-9xl xl:text-10xl",
        };

        const weightMap = {
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
            extrabold: "font-extrabold",
        };

        return `section-title text-left ${sizeMap[customization.titleSize]} ${weightMap[customization.titleWeight]
            } text-${customization.titleColor} mb-2 sm:mb-3 leading-tight`;
    };

    const getSubtitleClasses = () => {
        const sizeMap = {
            sm: "text-sm sm:text-base md:text-lg lg:text-lg",
            md: "text-base sm:text-lg md:text-xl lg:text-xl",
            lg: "text-lg sm:text-xl md:text-2xl lg:text-2xl",
            xl: "text-xl sm:text-2xl md:text-3xl lg:text-3xl",
        };

        const weightMap = {
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
        };

        return `section-sub-title text-left ${sizeMap[customization.subtitleSize]} ${weightMap[customization.subtitleWeight]
            } text-${customization.subtitleColor} mb-3 sm:mb-4`;
    };

    const getDescriptionClasses = () => {
        const sizeMap = {
            sm: "text-sm sm:text-base lg:text-base",
            md: "text-base sm:text-lg lg:text-lg",
            lg: "text-lg sm:text-xl lg:text-xl",
        };

        return `section-description text-left ${sizeMap[customization.descriptionSize]} font-medium text-${customization.descriptionColor} mb-6 sm:mb-8 lg:mb-10`;
    };

    const getBackgroundStyle = () => {
        const bgMap = {
            white: "bg-white",
            "gray-50": "bg-gray-50",
            "gray-100": "bg-gray-100",
        };
        return bgMap[customization.backgroundColor] || "bg-white";
    };

    const getBackgroundThemeStyle = () => {
        switch (customization.backgroundTheme) {
            case "diagonal-grid":
                return {
                    backgroundColor: "#fafafa",
                    backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
          `,
                    backgroundSize: "40px 40px",
                };
            case "crosshatch":
                return {
                    backgroundColor: "#ffffff",
                    backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
          `,
                };
            case "circuit-board":
                return {
                    backgroundColor: "#ffffff",
                    backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
            radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
            radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
          `,
                    backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
                };
            case "zigzag-lightning":
                return {
                    backgroundColor: "#ffffff",
                    backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(75, 85, 99, 0.08) 20px, rgba(75, 85, 99, 0.08) 21px),
            repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107, 114, 128, 0.06) 30px, rgba(107, 114, 128, 0.06) 31px),
            repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(55, 65, 81, 0.05) 40px, rgba(55, 65, 81, 0.05) 41px),
            repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(31, 41, 55, 0.04) 35px, rgba(31, 41, 55, 0.04) 36px)
          `,
                };
            default:
                return {
                    backgroundColor: "#fafafa",
                    backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
          `,
                    backgroundSize: "40px 40px",
                };
        }
    };

    const getCardStyle = () => {
        const styleMap = {
            solid: `bg-[${backgroundPrimaryColor}]`,
            gradient: `bg-gradient-to-br from-[${backgroundPrimaryColor}] to-[${backgroundSecondaryColor}]`,
            transparent: "bg-transparent",
        };

        const borderMap = {
            none: "border-transparent",
            subtle: `border-2 border-[${primaryColor}]/20 hover:border-[${primaryColor}]/40`,
            bold: `border-4 border-[${primaryColor}]/40 hover:border-[${primaryColor}]/60`,
        };

        const shadowMap = {
            none: "",
            light: "shadow-sm",
            medium: "shadow-lg",
            heavy: "shadow-2xl",
        };

        return `relative ${styleMap[customization.cardBackground]} p-4 sm:p-5 lg:p-6 rounded-lg ${shadowMap[customization.cardShadow]} ${borderMap[customization.cardBorderStyle]} transition-all duration-300`;
    };

    const getSocialLinksClasses = () => {
        if (!customization.socialLinksVisible) return "hidden";

        const sizeMap = {
            sm: "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14",
            md: "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16",
            lg: "w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18",
        };

        const styleMap = {
            circular: "rounded-full",
            square: "rounded-lg",
            minimal: "rounded-none",
        };

        const hoverMap = {
            border: `hover:border-8 hover:border-[${primaryColor}]/30`,
            scale: "hover:scale-110",
            glow: `hover:shadow-lg hover:shadow-[${primaryColor}]/20`,
            none: "",
        };

        return `duration-200 ease-in border-4 border-transparent ${hoverMap[customization.socialLinksHoverEffect]} ${styleMap[customization.socialLinksStyle]} bg-[${backgroundPrimaryColor}] flex items-center justify-center transition-all ${sizeMap[customization.socialLinksSize]}`;
    };

    const getResumeButtonStyle = () => {
        if (!customization.resumeButtonVisible) return "hidden";

        const sizeMap = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return `${sizeMap[customization.resumeButtonSize]} rounded transition-all duration-300`;
    };

    const getResumeButtonInlineStyle = () => {
        const styleMap = {
            default: {
                backgroundColor: primaryColor,
                color: 'white',
                border: 'none',
            },
            animated: {
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryHoverColor})`,
                color: 'white',
                border: 'none',
            },
            minimal: {
                backgroundColor: 'transparent',
                color: textPrimaryColor,
                border: `1px solid ${textSecondaryColor}`,
            },
            outline: {
                backgroundColor: 'transparent',
                color: primaryColor,
                border: `2px solid ${primaryColor}`,
            },
        };

        return styleMap[customization.resumeButtonStyle];
    };

    return {
        getContainerClasses,
        getTitleClasses,
        getSubtitleClasses,
        getDescriptionClasses,
        getBackgroundStyle,
        getBackgroundThemeStyle,
        getCardStyle,
        getSocialLinksClasses,
        getResumeButtonStyle,
        getResumeButtonInlineStyle,
    };
};
