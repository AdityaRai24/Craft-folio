"use client";

import React from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";
import ChromeIcon from "@/components/Windows/icons/chrome.png";

interface DesktopIconsProps {
    userInfoData: any;
    openWindow: (id: string) => void;
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({ userInfoData, openWindow }) => {
    const { theme } = useWindowsTheme();
    const isDark = theme === "dark";

    const iconClass = `
    flex flex-col items-center gap-1 p-2 rounded 
    hover:bg-white/10 hover:backdrop-blur-sm border border-transparent hover:border-white/10
    cursor-pointer transition-all w-24 text-center group
  `;

    const textClass = `
    text-xs text-white drop-shadow-md px-1 rounded group-hover:bg-none
    ${isDark ? "" : "text-shadow-black"} 
  `;

    return (
        <div className="flex flex-col flex-wrap h-[calc(100vh-48px)] content-start gap-2 p-2">
            {/* This PC / Projects */}
            <div className={iconClass} onClick={() => openWindow("projects")}>
                <img
                    src="https://img.icons8.com/color/96/000000/monitor--v1.png"
                    alt="This PC"
                    className="w-12 h-12 drop-shadow-lg"
                />
                <span className={textClass}>This PC</span>
            </div>

            {/* Recycle Bin / Contact */}
            <div className={iconClass} onClick={() => openWindow("contact")}>
                <img
                    src="https://img.icons8.com/color/96/000000/full-trash.png"
                    alt="Recycle Bin"
                    className="w-12 h-12 drop-shadow-lg"
                />
                <span className={textClass}>Recycle Bin</span>
            </div>

            {/* Folder / Experience */}
            <div className={iconClass} onClick={() => openWindow("experience")}>
                <img
                    src="https://img.icons8.com/color/96/000000/folder-invoices--v1.png"
                    alt="Experience"
                    className="w-12 h-12 drop-shadow-lg"
                />
                <span className={textClass}>Experience</span>
            </div>

            {/* Chrome */}
            <div className={iconClass} onClick={() => openWindow("chrome")}>
                <img
                    src={ChromeIcon.src}
                    alt="Chrome"
                    className="w-12 h-12 drop-shadow-lg"
                />
                <span className={textClass}>Chrome</span>
            </div>

            {/* Social Links */}
            {userInfoData.socialLinks?.github && (
                <a
                    href={userInfoData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={iconClass}
                >
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                        <Github className="text-white w-8 h-8" />
                    </div>
                    <span className={textClass}>GitHub</span>
                </a>
            )}

            {userInfoData.socialLinks?.linkedin && (
                <a
                    href={userInfoData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={iconClass}
                >
                    <div className="w-12 h-12 bg-[#0077b5] rounded-lg flex items-center justify-center shadow-lg">
                        <Linkedin className="text-white w-8 h-8" />
                    </div>
                    <span className={textClass}>LinkedIn</span>
                </a>
            )}
        </div>
    );
};

export default DesktopIcons;
