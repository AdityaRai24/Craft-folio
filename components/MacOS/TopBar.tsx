"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Github,
  Linkedin,
  Mail,
  Image as ImageIcon,
} from "lucide-react";
import { useMacOSTheme } from "./ThemeContext";
import { FaApple } from "react-icons/fa6";

// --- Configuration Types ---
interface DropdownItem {
  label: string;
  icon?: React.ElementType;
  action: () => void;
}

interface MenuItem {
  label: string;
  items?: DropdownItem[];
  action?: () => void;
}

const TopBar = ({
  currentPortTheme,
  customCSS,
  portfolioId,
  onEditWallpaper,
  onOpenResume,
}: {
  currentPortTheme?: string;
  customCSS?: string;
  portfolioId?: string;
  onEditWallpaper?: () => void;
  onOpenResume?: () => void;
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme } = useMacOSTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // Click outside listener for dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handlers ---
  const handleResume = () => {
    onOpenResume?.();
    setActiveMenu(null);
  };

  const handleWallpaperEdit = () => {
    onEditWallpaper?.();
    setActiveMenu(null);
  };

  const openLink = (url: string) => {
    window.open(url, "_blank");
    setActiveMenu(null);
  };

  // --- Menu Configuration ---
  const menuConfig: MenuItem[] = [
    { label: "Portfolio", action: () => { } }, // Main app menu
    {
      label: "File",
      items: [
        { label: "Resume", icon: FileText, action: handleResume }
      ]
    },
    ...(onEditWallpaper ? [{
      label: "View",
      items: [
        { label: "Change Wallpaper", icon: ImageIcon, action: handleWallpaperEdit }
      ]
    }] : []),
    { label: "Window", action: () => { } },
    {
      label: "Contact",
      items: [
        { label: "GitHub", icon: Github, action: () => openLink("https://github.com") },
        { label: "LinkedIn", icon: Linkedin, action: () => openLink("https://linkedin.com") },
        { label: "Email", icon: Mail, action: () => window.location.href = "mailto:your@email.com" }
      ]
    },
  ];

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 h-7 w-full z-50 flex items-center justify-between px-4 border-b select-none backdrop-blur-md transition-colors duration-300
        ${isDark
          ? "bg-black/40 text-white border-white/10"
          : "bg-white/40 text-black border-black/5"
        }`}
      style={customCSS ? { style: customCSS } as React.CSSProperties : undefined}
    >
      {/* Left side - Apple logo and menu items */}
      <div className="flex items-center space-x-1 h-full">
        <div className={`p-1 rounded cursor-pointer transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"}`}>
          <FaApple size={14} fill="currentColor" />
        </div>

        {/* Menu Loop */}
        {menuConfig.map((menu, index) => (
          <div key={index} className="relative h-full flex items-center">
            <button
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              className={`
                px-2.5 h-[22px] cursor-pointer rounded text-sm transition-colors  flex items-center
                ${index === 0 ? "font-semibold" : "font-normal opacity-90 hover:opacity-100"}
                ${activeMenu === menu.label
                  ? (isDark ? "bg-white/20" : "bg-black/10")
                  : (isDark ? "hover:bg-white/10" : "hover:bg-black/5")}
              `}
            >
              {menu.label}
            </button>

            {/* Dropdown (Shadcn-style) */}
            {activeMenu === menu.label && menu.items && menu.items.length > 0 && (
              <div className={`absolute top-full left-0 mt-1 w-48 p-1 backdrop-blur-xl border rounded-md shadow-lg flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100
                ${isDark
                  ? "bg-gray-800/90 border-gray-700 text-white"
                  : "bg-white/90 border-gray-200 text-black"}
              `}>
                {menu.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm text-left cursor-pointer rounded-sm transition-colors
                      ${isDark
                        ? "hover:bg-blue-600 hover:text-white text-gray-200"
                        : "hover:bg-blue-500 hover:text-white text-gray-800"}
                    `}
                  >
                    {item.icon && <item.icon size={14} />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
