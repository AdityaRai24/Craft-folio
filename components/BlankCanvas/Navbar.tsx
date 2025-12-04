"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Dribbble,
    Mail, Globe, Moon, Sun
} from "lucide-react";
import { SocialLink, SocialPlatform } from "@/types/canvas";
import { useBlankCanvasTheme } from "./ThemeContext";

interface NavbarProps {
    socialLinks?: SocialLink[] | Record<string, string>;
    logoText?: string;
    onPreviewToggle?: () => void;
    isPreview?: boolean;
    canEdit?: boolean;
}

const PLATFORM_ICONS: Record<SocialPlatform | string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
    dribbble: Dribbble,
    email: Mail,
    website: Globe,
    other: Globe
};

const Navbar: React.FC<NavbarProps> = ({
    socialLinks,
    logoText = "Portfolio",
    onPreviewToggle,
    isPreview,
    canEdit
}) => {
    const { theme, toggleTheme } = useBlankCanvasTheme();

    // Normalize social links to array format
    const normalizedLinks: SocialLink[] = React.useMemo(() => {
        if (!socialLinks) return [];

        if (Array.isArray(socialLinks)) {
            return socialLinks;
        }

        // Convert old object format to array
        return Object.entries(socialLinks).map(([key, value]) => {
            if (!value) return null;
            return {
                id: crypto.randomUUID(),
                platform: key as SocialPlatform,
                url: value
            };
        }).filter(Boolean) as SocialLink[];
    }, [socialLinks]);

    return (
        <nav className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold tracking-tight"
            >
                {logoText}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
            >
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--port-text-secondary)' }}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="w-px h-6 mx-2" style={{ backgroundColor: 'var(--port-border)' }} />

                {normalizedLinks.map((link, index) => {
                    const Icon = PLATFORM_ICONS[link.platform] || Globe;
                    const href = link.platform === 'email' && !link.url.startsWith('mailto:')
                        ? `mailto:${link.url}`
                        : link.url;

                    return (
                        <a
                            key={`${link.platform}-${index}`}
                            href={href}
                            target={link.platform === 'email' ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className="transition-colors hover:opacity-80"
                            style={{ color: 'var(--port-text-secondary)' }}
                            title={link.platform}
                        >
                            <Icon size={20} />
                        </a>
                    );
                })}
            </motion.div>
        </nav>
    );
};

export default Navbar;
