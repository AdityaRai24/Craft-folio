import {
    Github, Linkedin, Twitter, Instagram, Youtube, Facebook, Dribbble,
    Mail, Globe, MapPin, ArrowUpRight
} from "lucide-react";
import { SocialPlatform } from "@/types/canvas";

export interface SocialPlatformConfig {
    value: SocialPlatform;
    label: string;
    icon: any;
    formatDescription?: (url: string) => string;
    formatHref?: (url: string) => string;
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
    {
        value: "github",
        label: "GitHub",
        icon: Github,
        formatDescription: (url) => url.includes("github.com") ? (url.split("github.com/")[1] || url) : url
    },
    {
        value: "linkedin",
        label: "LinkedIn",
        icon: Linkedin,
        formatDescription: (url) => url.includes("linkedin.com") ? (url.split("/in/")[1] || url) : url
    },
    {
        value: "twitter",
        label: "Twitter / X",
        icon: Twitter,
        formatDescription: (url) => url.includes("twitter.com") ? (url.split("twitter.com/")[1] || url) : (url.includes("x.com") ? (url.split("x.com/")[1] || url) : url)
    },
    {
        value: "instagram",
        label: "Instagram",
        icon: Instagram,
        formatDescription: (url) => url.includes("instagram.com") ? (url.split("instagram.com/")[1] || url) : url
    },
    {
        value: "youtube",
        label: "YouTube",
        icon: Youtube,
        formatDescription: (url) => url.includes("youtube.com") ? (url.split("youtube.com/")[1] || url) : url
    },
    {
        value: "facebook",
        label: "Facebook",
        icon: Facebook,
        formatDescription: (url) => url.includes("facebook.com") ? (url.split("facebook.com/")[1] || url) : url
    },
    {
        value: "dribbble",
        label: "Dribbble",
        icon: Dribbble,
        formatDescription: (url) => url.includes("dribbble.com") ? (url.split("dribbble.com/")[1] || url) : url
    },
    {
        value: "email",
        label: "Email",
        icon: Mail,
        formatHref: (url) => `mailto:${url}`
    },
    {
        value: "website",
        label: "Website",
        icon: Globe
    },
    {
        value: "location",
        label: "Location",
        icon: MapPin,
        formatHref: (url) => `https://maps.google.com/?q=${encodeURIComponent(url)}`
    },
    {
        value: "other",
        label: "Other",
        icon: ArrowUpRight
    }
];

export const getPlatformConfig = (platform: SocialPlatform): SocialPlatformConfig => {
    return SOCIAL_PLATFORMS.find(p => p.value === platform) || {
        value: "other",
        label: "Website",
        icon: Globe
    };
};
