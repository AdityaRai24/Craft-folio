/**
 * Shared Framer Motion animation variants for consistent animations across components
 */

export type AnimationVariant = {
    hidden: any;
    visible: any;
};

/**
 * Fade in animation
 */
export const fadeIn = (delay = 0, duration = 0.5): AnimationVariant => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration,
            delay,
        },
    },
});

/**
 * Slide in from left animation
 */
export const slideIn = (delay = 0, duration = 0.5, distance = 50): AnimationVariant => ({
    hidden: { opacity: 0, x: -distance },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration,
            delay,
        },
    },
});

/**
 * Scale up animation
 */
export const scaleIn = (delay = 0, duration = 0.5): AnimationVariant => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration,
            delay,
        },
    },
});

/**
 * Bounce in animation with spring physics
 */
export const bounceIn = (delay = 0): AnimationVariant => ({
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            bounce: 0.4,
            delay,
        },
    },
});

/**
 * Rotate in animation
 */
export const rotateIn = (delay = 0, duration = 0.5): AnimationVariant => ({
    hidden: { opacity: 0, rotate: -5 },
    visible: {
        opacity: 1,
        rotate: 0,
        transition: {
            duration,
            delay,
        },
    },
});

/**
 * No animation - static
 */
export const none: AnimationVariant = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
};

/**
 * Stagger container for animating children sequentially
 */
export const staggerContainer = (staggerDelay = 0.15, delayChildren = 0.2) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren,
        },
    },
});

/**
 * Stagger item - works with staggerContainer
 */
export const staggerItem = (isSmallScreen = false) => ({
    hidden: {
        opacity: 0,
        ...(isSmallScreen ? { y: -20 } : { x: -20 }),
    },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
});

/**
 * Get animation variant by name
 */
export const getVariantByName = (
    name: "scale" | "slide" | "rotate" | "bounce" | "fade" | "none",
    delay = 0,
    duration = 0.5
): AnimationVariant => {
    switch (name) {
        case "scale":
            return scaleIn(delay, duration);
        case "slide":
            return slideIn(delay, duration);
        case "rotate":
            return rotateIn(delay, duration);
        case "bounce":
            return bounceIn(delay);
        case "fade":
            return fadeIn(delay, duration);
        case "none":
            return none;
        default:
            return fadeIn(delay, duration);
    }
};
