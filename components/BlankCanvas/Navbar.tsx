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
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-400"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-2" />

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
                            className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
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
