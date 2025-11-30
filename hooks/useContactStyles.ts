import { ContactCustomizationState } from "@/types/contact/portfolio";
import { ColorTheme } from "@/lib/colorThemes";

export const useContactStyles = (
    effectiveCustomization: ContactCustomizationState,
    visualEditorOpen: boolean,
    hoveredCard: string | null,
    titleColor: string
) => {
    const getLayoutClasses = () => {
        return `grid grid-cols-2 md:grid-cols-${effectiveCustomization.gridColumns}`;
    };

    const getLayoutStyle = () => {
        return { gap: `${effectiveCustomization.cardSpacing}px` };
    };

    const getContainerStyle = () => {
        switch (effectiveCustomization.containerWidth) {
            case "narrow":
                return {
                    maxWidth: "100%",
                    margin: "0 auto",
                    "@media (min-width: 768px)": { maxWidth: "60%" },
                };
            case "wide":
                return {
                    maxWidth: "100%",
                    margin: "0 auto",
                    "@media (min-width: 768px)": { maxWidth: "80%" },
                };
            case "full":
                return { maxWidth: "100%", margin: "0 auto" };
            default:
                return {
                    maxWidth: "100%",
                    margin: "0 auto",
                    "@media (min-width: 768px)": { maxWidth: "80%" },
                };
        }
    };

    const getCardClasses = (platform: string) => {
        const isHovered = visualEditorOpen && hoveredCard === platform;
        let classes = `cursor-pointer flex transition-all shadow-lg`;

        // Card layout-specific classes
        if (effectiveCustomization.cardLayout === "flex") {
            classes += " items-center";
        } else {
            classes += " flex-col items-center justify-center";
        }

        // Size variations
        const sizeClasses = {
            compact:
                effectiveCustomization.cardLayout === "flex"
                    ? "p-3 sm:p-4"
                    : "p-4 sm:p-5",
            default:
                effectiveCustomization.cardLayout === "flex"
                    ? "p-4 sm:p-5"
                    : "p-6 sm:p-8",
            large:
                effectiveCustomization.cardLayout === "flex"
                    ? "p-5 sm:p-6"
                    : "p-8 sm:p-10",
        };
        classes += ` ${sizeClasses[effectiveCustomization.cardSize]}`;

        // Style variations
        switch (effectiveCustomization.cardStyle) {
            case "minimal":
                classes += " bg-transparent border-gray-600 hover:border-gray-400";
                break;
            case "glass":
                classes +=
                    " bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20";
                break;
            case "neon":
                classes += " bg-black/70 border-2 hover:shadow-lg";
                break;
            case "gradient":
                classes += " bg-gradient-to-br from-zinc-800 to-zinc-900 border-gray-700";
                break;
            default:
                classes += " bg-stone-900/60 border-gray-700";
        }

        // Animation duration
        classes += ` duration-${effectiveCustomization.animationSpeed}`;

        // Hover effects
        if (
            effectiveCustomization.hoverEffects &&
            effectiveCustomization.animationStyle !== "none"
        ) {
            switch (effectiveCustomization.animationStyle) {
                case "rotate":
                    classes += " hover:rotate-1";
                    break;
                case "bounce":
                    classes += " hover:-translate-y-1";
                    break;
                case "slide":
                    classes += " hover:translate-x-1";
                    break;
                default:
                    classes += " hover:scale-105";
            }
        }

        // Visual editor highlight
        if (isHovered) {
            classes += " ring-2";
            classes += ` ring-[${ColorTheme.primary}]`;
        }

        return classes;
    };

    const getCardStyle = (platform: string) => {
        let style: any = {
            borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
        };

        // Border styling
        if (effectiveCustomization.cardStyle === "neon") {
            style.borderColor = titleColor;
            style.borderWidth = `${effectiveCustomization.borderWidth}px`;
        } else {
            style.borderColor = `${titleColor}30`;
            style.borderWidth = `${effectiveCustomization.borderWidth}px`;
        }

        // Background opacity for default style
        if (effectiveCustomization.cardStyle === "default") {
            style.backgroundColor = `rgba(28, 25, 23, ${effectiveCustomization.backgroundOpacity / 100
                })`;
        }

        return style;
    };

    const getIconSize = () => ({
        width: `${effectiveCustomization.iconSize}px`,
        height: `${effectiveCustomization.iconSize}px`,
    });

    const getTextAlignment = () => {
        switch (effectiveCustomization.textAlignment) {
            case "left":
                return "text-left items-start";
            case "right":
                return "text-right items-end";
            default:
                return "text-center items-center";
        }
    };

    const getAnimationVariants = () => {
        const baseVariants = {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        };

        switch (effectiveCustomization.animationStyle) {
            case "slide":
                return {
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 },
                };
            case "rotate":
                return {
                    hidden: { opacity: 0, rotate: -10 },
                    visible: { opacity: 1, rotate: 0 },
                };
            case "bounce":
                return {
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                };
            case "scale":
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                };
            default:
                return baseVariants;
        }
    };

    return {
        getLayoutClasses,
        getLayoutStyle,
        getContainerStyle,
        getCardClasses,
        getCardStyle,
        getIconSize,
        getTextAlignment,
        getAnimationVariants,
    };
};
