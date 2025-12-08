import { ProjectsCustomizationState } from "../interfaces/ProjectsCustomizationState";
import { ExperienceCustomizationState } from "../interfaces/ExperienceCustomizationState";

export interface BentoHeroBlock {
    id: string;
    type: 'intro' | 'image' | 'socials' | 'stats' | 'services' | 'quote';
    colSpan: number; // 1 to 4
    rowSpan: number; // 1 to 4
    visible: boolean;
    order: number;
}

import { SocialLink } from "@/types/canvas";

export interface BentoHeroCustomization {
    layout: 'standard' | 'compact' | 'split';
    cardStyle: 'solid' | 'glass' | 'neon' | 'gradient' | 'minimal';
    cardBorderRadius: number;
    cardPadding: number;
    gap: number;
    cardBackground: string;
    borderColor: string;
    glowColor: 'purple' | 'blue' | 'green' | 'orange' | 'none';
    nameSize: number;
    titleSize: number;
    slots: BentoHeroBlock[];
    stats: { label: string; value: string }[];
    services: string[];
    quote: string;
    heroImage?: string;
    socials?: SocialLink[];
}

export const defaultBentoHeroStyles: BentoHeroCustomization = {
    layout: 'standard',
    cardStyle: 'glass',
    cardBorderRadius: 24,
    cardPadding: 24,
    gap: 16,
    cardBackground: 'bg-zinc-900',
    borderColor: 'border-zinc-800',
    glowColor: 'purple',
    nameSize: 48,
    titleSize: 20,
    slots: [
        { id: 'intro', type: 'intro', colSpan: 2, rowSpan: 2, visible: true, order: 0 },
        { id: 'image', type: 'image', colSpan: 1, rowSpan: 2, visible: true, order: 1 },
        { id: 'socials', type: 'socials', colSpan: 1, rowSpan: 1, visible: true, order: 2 },
        { id: 'stats', type: 'stats', colSpan: 2, rowSpan: 1, visible: true, order: 4 },
        { id: 'services', type: 'services', colSpan: 1, rowSpan: 1, visible: true, order: 5 },
        { id: 'quote', type: 'quote', colSpan: 1, rowSpan: 1, visible: true, order: 6 },
    ],
    stats: [
        { label: "Years Exp.", value: "3+" },
        { label: "Projects", value: "15+" },
        { label: "Clients", value: "10+" }
    ],
    services: ["Frontend", "UI/UX", "Mobile", "Backend"],
    quote: "Turning coffee into code and ideas into reality."
};

export const defaultBentoProjectsStyles: ProjectsCustomizationState = {
    layout: "grid",
    gridColumns: 2,
    cardSpacing: 24,
    cardBorderRadius: 24,
    imageBorderRadius: 16,
    cardBackground: "bg-zinc-900",
    cardBorder: "border-zinc-800",
    cardStyle: "default",
    imageAspectRatio: "wide",
    imageHeight: 200,
    githubButtonStyle: "default",
    liveButtonStyle: "default",
    buttonBorderRadius: 8,
    techStackStyle: "badges",
    animationSpeed: 0.3,
    titleAlignment: "left",
    cardPadding: 24,
    imageOverlay: false,
    imagePosition: "left",
    hoverEffects: true,
    glowEffect: false,
    borderWidth: 1,
    titleSize: "xl",
    titleWeight: "bold",
    descriptionSize: "md",
    descriptionWeight: "normal",
    headerVisible: true,
};

export interface BentoTechnologiesCustomization {
    cardStyle: 'solid' | 'glass' | 'neon' | 'gradient' | 'minimal';
    iconSize: number;
    cardBorderRadius: number;
    cardBackground: string;
    borderColor: string;
    showIcons: boolean;
    cardPadding: number;
    gap: number;
}

export const defaultBentoTechnologiesStyles: BentoTechnologiesCustomization = {
    cardStyle: 'glass',
    iconSize: 40,
    cardBorderRadius: 16,
    cardBackground: 'bg-zinc-900',
    borderColor: 'border-zinc-800',
    showIcons: true,
    cardPadding: 16,
    gap: 16,
};

export const defaultBentoExperienceStyles: ExperienceCustomizationState = {
    cardLayout: "default",
    cardBorderRadius: 24,
    cardPadding: 24,
    cardSpacing: 24,
    containerWidth: "wide",
    maxWidth: "2xl",
    containerPadding: 24,
    backgroundColor: "transparent",
    cardBackground: "solid",
    cardBorderColor: "border-zinc-800",
    cardBorderStyle: "subtle",
    cardShadow: "none",
    titleSize: "xl",
    titleWeight: "bold",
    titleColor: "white",
    titleAlignment: "left",
    descriptionSize: "md",
    descriptionColor: "gray-400",
    descriptionVisible: true,
    textAlignment: "left",
    headerVisible: true,
    companyNameSize: "lg",
    companyNameWeight: "medium",
    companyNameColor: "gray-400",
    roleSize: "xl",
    roleWeight: "bold",
    roleColor: "white",
    dateFormat: "month-year",
    dateSize: "sm",
    dateWeight: "medium",
    dateColor: "gray-500",
    locationVisible: false,
    locationSize: "sm",
    locationWeight: "normal",
    locationColor: "gray-500",
    descriptionTextSize: "md",
    descriptionTextWeight: "normal",
    descriptionTextColor: "gray-300",
    hoverEffects: true,
    hoverScale: false,
    hoverShadow: true,
    cardHoverEffect: "border",
    glowEffect: false,
    borderGlow: false,
    backgroundOpacity: 1,
    borderWidth: 1,
    animationStyle: "none",
    animationSpeed: 0.5,
    staggerDelay: 0.1,
    staggerAnimation: true,
    entranceAnimation: "fadeUp",
    alternatingLayout: false,
    techStackVisible: true,
    techStackStyle: "badges",
    techStackSize: "sm",
    techStackLimit: 10,
    techStackColor: "gray",
    techStackShowIcons: false,
    timelineStyle: "minimal",
    timelinePosition: "left",
    timelineWidth: 2,
    timelineColor: "gray-800",
    dotSize: "md",
    dotStyle: "circle",
    locationBadge: false,
    dateBadge: true,
    badgeStyle: "minimal",
    sideAccent: false,
    sideAccentColor: "blue-500",
    sideAccentWidth: 4,
};

export interface BentoContactButton {
    id: string;
    label: string;
    url: string;
    style: 'solid' | 'outline' | 'ghost';
}

export interface BentoContactCustomization {
    cardStyle: 'solid' | 'glass' | 'neon' | 'gradient' | 'minimal';
    cardBorderRadius: number;
    cardPadding: number;
    gap: number;
    cardBackground: string;
    borderColor: string;

    title: string;
    description: string;
    buttons: BentoContactButton[];

    showFooter: boolean;
    gradientFrom: string;
    gradientTo: string;
    cardRadius: string; // Legacy support
}

export const defaultBentoContactStyles: BentoContactCustomization = {
    cardStyle: 'glass',
    cardBorderRadius: 24,
    cardPadding: 32,
    gap: 16,
    cardBackground: 'bg-zinc-900',
    borderColor: 'border-zinc-800',

    title: "Ready to work together?",
    description: "I'm currently available for freelance projects and open to full-time opportunities. If you have a project that needs some creative touch, let's chat.",
    buttons: [
        { id: 'email', label: 'Get in touch', url: 'mailto:', style: 'solid' },
        { id: 'linkedin', label: 'Connect on LinkedIn', url: 'https://linkedin.com', style: 'outline' }
    ],

    showFooter: true,
    gradientFrom: 'blue-600',
    gradientTo: 'purple-600',
    cardRadius: 'rounded-3xl',
};
