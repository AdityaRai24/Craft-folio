import { TechnologiesCustomizationState } from "./portfolio";

export type LumenFlowTechnologiesCustomizationState = TechnologiesCustomizationState;

export const defaultLumenFlowTechnologiesStyles: LumenFlowTechnologiesCustomizationState = {
    layout: "grid",
    gridColumns: 4,
    gap: 24,
    containerWidth: "xl",
    cardStyle: "minimal",
    cardBorderRadius: 16,
    cardPadding: 24,
    cardShadow: "none",
    borderWidth: 1,
    backgroundOpacity: 10,
    showIcons: true,
    iconSize: 48,
    showLabels: true,
    labelPosition: "bottom",
    labelSize: "md",
    labelWeight: "medium",
    textAlignment: "center",
    animationStyle: "scale",
    animationSpeed: 400,
    staggerAnimation: true,
    hoverEffects: true,
    cardHoverEffect: "lift",
    marqueeDirection: "left",
    marqueeSpeed: 50,
    pauseOnHover: true,
};
