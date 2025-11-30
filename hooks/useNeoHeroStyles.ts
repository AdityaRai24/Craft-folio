import { HeroCustomizationState } from "@/types/hero/portfolio";

export const useNeoHeroStyles = (customization: HeroCustomizationState, theme: any, ColorTheme: any) => {

    const getContainerClasses = () => {
        const alignmentMap = {
            center: "items-center justify-center text-center",
            left: "items-start justify-start text-left",
            right: "items-end justify-end text-right",
        };

        const verticalMap = {
            center: "justify-center min-h-screen",
            top: "justify-start pt-12",
            bottom: "justify-end pb-12 min-h-screen",
        };

        const maxWidthMap = {
            sm: "max-w-sm",
            md: "max-w-2xl",
            lg: "max-w-4xl",
            xl: "max-w-6xl",
            "2xl": "max-w-7xl",
            full: "w-full",
        };

        let classes = `relative flex-1 flex pt-8 flex-col px-4 sm:px-6 md:px-8 ${alignmentMap[customization.contentAlignment]
            } ${verticalMap[customization.verticalAlignment]} ${maxWidthMap[customization.maxWidth]
            } mx-auto space-y-4 sm:space-y-6`;

        return classes;
    };

    const getTitleClasses = () => {
        const sizeMap = {
            xs: "text-2xl sm:text-2xl md:text-4xl lg:text-5xl",
            sm: "text-3xl sm:text-2xl md:text-4xl lg:text-5xl",
            md: "text-3xl sm:text-3xl md:text-5xl lg:text-6xl",
            lg: "text-4xl sm:text-4xl md:text-6xl lg:text-7xl",
            xl: "text-5xl sm:text-5xl md:text-7xl lg:text-8xl",
            "2xl": "text-6xl sm:text-6xl md:text-8xl lg:text-9xl",
            "3xl": "text-7xl sm:text-7xl md:text-9xl lg:text-10xl",
        };

        const weightMap = {
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
            extrabold: "font-extrabold",
        };

        const lineHeightMap = {
            tight: "leading-tight",
            snug: "leading-snug",
            normal: "leading-normal",
            relaxed: "leading-relaxed",
            loose: "leading-loose",
        };

        const letterSpacingMap = {
            tighter: "tracking-tighter",
            tight: "tracking-tight",
            normal: "tracking-normal",
            wide: "tracking-wide",
            wider: "tracking-wider",
            widest: "tracking-widest",
        };

        return `section-title ${sizeMap[customization.titleSize]} ${weightMap[customization.titleWeight]
            } ${lineHeightMap[customization.titleLineHeight]} ${letterSpacingMap[customization.titleLetterSpacing]
            }`;
    };

    const getDescriptionClasses = () => {
        const sizeMap = {
            xs: "text-base sm:text-sm",
            sm: "text-base sm:text-md",
            md: "text-lg sm:text-xl",
            lg: "text-xl sm:text-2xl",
            xl: "text-2xl sm:text-3xl",
            "2xl": "text-3xl sm:text-4xl",
            "3xl": "text-4xl sm:text-5xl",
        };

        const weightMap = {
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
            extrabold: "font-extrabold",
        };

        const maxWidthMap = {
            sm: "max-w-sm",
            md: "max-w-xl",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            full: "max-w-full",
            "2xl": "max-w-5xl",
            "3xl": "max-w-6xl",
        };

        return `section-description ${sizeMap[customization.descriptionSize]
            } ${weightMap[customization.descriptionWeight]} ${maxWidthMap[customization.descriptionMaxWidth]} ${customization.contentAlignment === "center" ? "mx-auto" : ""
            }`;
    };

    const getBadgeClasses = () => {
        return `inline-flex items-center text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full`;
    };

    const getButtonClasses = () => {
        const sizeMap = {
            sm: "px-3 sm:px-4 py-2 text-xs sm:text-sm",
            md: "px-4 sm:px-7 py-3 sm:py-5 text-sm",
            lg: "px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base",
        };

        const styleMap = {
            default: "rounded",
            rounded: "rounded-lg",
            square: "rounded-none",
            pill: "rounded-full",
        };

        const layoutMap = {
            horizontal: "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6",
            vertical: "flex flex-col items-center gap-3 sm:gap-4",
            stacked: "flex flex-col sm:flex-row items-center gap-3 sm:gap-4",
        };

        return {
            container: `${layoutMap[customization.buttonLayout]} mt-8`,
            button: `flex btn-primary items-center gap-2 ${sizeMap[customization.buttonSize]
                } ${styleMap[customization.buttonStyle]
                } cursor-pointer transition-all duration-300`,
        };
    };

    const getAnimationVariants = () => {
        return {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        };
    };

    const getTitleStyle = () => {
        let style: any = {};

        if (customization.glowEffect) {
            style.textShadow = `0 0 20px ${theme.colors.primary}50`;
        }

        if (customization.textShadow) {
            style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
        }

        return style;
    };

    const getBackgroundStyle = () => {
        switch (customization.backgroundTheme) {
            case "pearl-mist":
                return {
                    backgroundColor: "#000000",
                    backgroundImage:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 90%)",
                };
            case "aurora-midnight":
                return {
                    backgroundColor: "#000000",
                    backgroundImage:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 90%)",
                };
            case "crimson-shadow":
                return {
                    backgroundColor: "#000000",
                    backgroundImage:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 80, 120, 0.25), transparent 90%)",
                };
            case "ocean-abyss":
                return {
                    backgroundColor: "#000000",
                    backgroundImage:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 90%)",
                };
            case "noise-pattern":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
          `,
                    backgroundSize: "20px 20px, 30px 30px, 25px 25px",
                    backgroundPosition: "0 0, 10px 10px, 15px 5px",
                };
            case "diagonal-lines":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
          `,
                    backgroundSize: "24px 24px, 24px 24px, 8px 8px",
                };
            case "magenta-orb-grid":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
                    backgroundSize: "20px 20px, 20px 20px, 100% 100%",
                };
            case "black-grid-dots":
                return {
                    backgroundColor: "#000000",
                    backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
                    backgroundSize: "20px 20px, 20px 20px, 20px 20px",
                    backgroundPosition: "0 0, 0 0, 0 0",
                };
            default:
                return {
                    backgroundColor: "#000000",
                    backgroundImage:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 90%)",
                };
        }
    };

    const customCssAnimations = () => {
        return `@keyframes blink {
            0%,
            50% {
              opacity: 1;
            }
            51%,
            100% {
              opacity: 0.3;
            }
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
          }

          @keyframes bounce {
            0%,
            20%,
            53%,
            80%,
            100% {
              transform: translate3d(0, 0, 0);
            }
            40%,
            43% {
              transform: translate3d(0, -8px, 0);
            }
            70% {
              transform: translate3d(0, -4px, 0);
            }
            90% {
              transform: translate3d(0, -2px, 0);
            }
          }

          @keyframes slide {
            0% {
              transform: translateX(-10px);
              opacity: 0.5;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: ${ColorTheme.primary};
            cursor: pointer;
          }

          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: ${ColorTheme.primary};
            cursor: pointer;
            border: none;
          }
        `
    }

    const getThemeButtonStyle = (isActive: boolean) => {
        if (isActive) {
            return {
                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                color: "white",
            };
        }
        return {};
    };

    return {
        getContainerClasses,
        getTitleClasses,
        getDescriptionClasses,
        getBadgeClasses,
        getButtonClasses,
        getAnimationVariants,
        getTitleStyle,
        getBackgroundStyle,
        customCssAnimations,
        getThemeButtonStyle
    }
}