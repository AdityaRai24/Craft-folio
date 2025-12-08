import { CSSProperties } from 'react';

/**
 * Generates CSS variables for a portfolio theme.
 * Scopes all variables with '--port-' to avoid conflicts with the platform UI.
 * 
 * @param theme The theme object from the JSON config (e.g., "SparklyGreen" object)
 * @param mode 'light' or 'dark' (optional, for future expansion if themes support modes internally)
 * @returns A CSSProperties object containing the scoped variables.
 */
export const generatePortfolioTheme = (theme: any, mode: 'light' | 'dark' = 'dark'): CSSProperties => {
    if (!theme || !theme.colors) {
        return {} as CSSProperties;
    }

    const { colors } = theme;

    const variables: Record<string, string> = {
        // Backgrounds
        '--port-bg': colors.background?.primary || '#000000',
        '--port-bg-secondary': colors.background?.secondary || 'rgba(255, 255, 255, 0.1)',

        // Text
        '--port-text': colors.text?.primary || '#ffffff',
        '--port-text-secondary': colors.text?.secondary || '#a1a1aa',
        '--port-text-muted': colors.states?.muted || 'rgba(255, 255, 255, 0.5)',

        // Accents / Primary
        '--port-primary': colors.primary || '#10b981',
        '--port-primary-hover': colors.primaryHover || colors.primary || '#059669',
        '--port-accent': colors.accent || colors.primary || '#10b981',

        // Borders (derived or explicit)
        '--port-border': colors.background?.secondary || 'rgba(255, 255, 255, 0.1)',
    };

    return variables as CSSProperties;
};

/**
 * Generates variables for Blank Canvas (Simple Light/Dark mode)
 */
export const generateBlankCanvasTheme = (mode: 'light' | 'dark'): CSSProperties => {
    const isDark = mode === 'dark';

    return {
        '--port-bg': isDark ? '#09090b' : '#ffffff', // zinc-950 : white
        '--port-bg-secondary': isDark ? '#18181b' : '#f4f4f5', // zinc-900 : zinc-100
        '--port-text': isDark ? '#f4f4f5' : '#18181b', // zinc-100 : zinc-900
        '--port-text-secondary': isDark ? '#a1a1aa' : '#71717a', // zinc-400 : zinc-500
        '--port-text-muted': isDark ? '#52525b' : '#a1a1aa', // zinc-600 : zinc-400
        '--port-primary': isDark ? '#f4f4f5' : '#18181b', // Foreground as primary for monochrome
        '--port-primary-hover': isDark ? '#ffffff' : '#000000',
        '--port-accent': isDark ? '#f4f4f5' : '#18181b',
        '--port-border': isDark ? '#27272a' : '#e4e4e7', // zinc-800 : zinc-200
    } as CSSProperties;
};
