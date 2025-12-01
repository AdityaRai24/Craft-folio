import { Variants } from "framer-motion";

export const getContainerVariants = (): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
});

export const getProjectVariants = (animationSpeed: number): Variants => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: animationSpeed,
        },
    },
});

export const getImageVariants = (animationSpeed: number): Variants => ({
    rest: { scale: 1 },
    hover: {
        scale: 1.03,
        transition: {
            duration: animationSpeed,
            ease: "easeOut",
        },
    },
});

export const getOverlayVariants = (animationSpeed: number): Variants => ({
    rest: { opacity: 0 },
    hover: {
        opacity: 1,
        transition: {
            duration: animationSpeed,
        },
    },
});
