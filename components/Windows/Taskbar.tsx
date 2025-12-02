"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wifi, Volume2, Battery } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";
import QuickSettings from "./QuickSettings";
import CalendarFlyout from "./CalendarFlyout";

interface TaskbarProps {
    dockItems: any[];
    windows: any;
    onAppClick: (id: string) => void;
    onStartClick: () => void;
    isStartOpen: boolean;
    brightness: number;
    setBrightness: (val: number) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
    dockItems,
    windows,
    onAppClick,
    onStartClick,
    isStartOpen,
    brightness,
    setBrightness,
}) => {
    const { theme } = useWindowsTheme();
    const isDark = theme === "dark";

    // Current time
    const [time, setTime] = React.useState(new Date());
    const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <div
                className={`
        fixed bottom-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-4 select-none
        ${isDark
                        ? "bg-[#202020]/85 border-t border-[#333]"
                        : "bg-[#f3f3f3]/85 border-t border-[#e5e5e5]"
                    }
        backdrop-blur-md
      `}
            >
                {/* Left side (Widgets placeholder) */}
                <div className="w-32 hidden md:flex">
                    {/* Weather or Widgets icon could go here */}
                </div>

                {/* Center (Apps) */}
                <div className="flex items-center gap-1 h-full">
                    {/* Start Button */}
                    <button
                        onClick={onStartClick}
                        className={`
            h-10 w-10 rounded flex items-center justify-center transition-all
            ${isStartOpen
                                ? "bg-white/10"
                                : "hover:bg-white/10 active:scale-95"
                            }
          `}
                    >
                        <svg width="24" height="24" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0H42V42H0V0Z" fill="#00A4EF" />
                            <path d="M46 0H88V42H46V0Z" fill="#7FBA00" />
                            <path d="M0 46H42V88H0V46Z" fill="#F25022" />
                            <path d="M46 46H88V88H46V46Z" fill="#FFB900" />
                        </svg>
                    </button>

                    {/* App Icons */}
                    {dockItems.map((item) => {
                        const isOpen = windows[item.id]?.isOpen;
                        const isActive = isOpen && !windows[item.id]?.isMinimized;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onAppClick(item.id)}
                                className={`
                relative h-10 w-10 rounded flex items-center justify-center transition-all group
                ${isActive ? "bg-white/10" : "hover:bg-white/5"}
              `}
                            >
                                <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:-translate-y-1 group-active:scale-90">
                                    {typeof item.icon === "string" || (typeof item.icon === "object" && item.icon.src) ? (
                                        <img src={item.icon.src || item.icon} alt={item.label} className="w-full h-full object-contain" />
                                    ) : (
                                        <item.icon className={`w-5 h-5 ${isDark ? "text-white" : "text-black"}`} />
                                    )}
                                </div>

                                {/* Open Indicator */}
                                {isOpen && (
                                    <div className={`
                  absolute bottom-0 w-1.5 h-1 rounded-full transition-all
                  ${isActive ? "w-4 bg-blue-400" : "bg-gray-400"}
                `} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right side (System Tray) */}
                <div className="flex items-center gap-2 h-full">
                    {/* Quick Settings Toggle */}
                    <div
                        onClick={() => {
                            setIsQuickSettingsOpen(!isQuickSettingsOpen);
                            setIsCalendarOpen(false);
                        }}
                        className={`
                            flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 cursor-pointer transition-colors
                            ${isQuickSettingsOpen ? "bg-white/10" : ""}
                        `}
                    >
                        <Wifi size={16} className={isDark ? "text-white" : "text-black"} />
                        <Volume2 size={16} className={isDark ? "text-white" : "text-black"} />
                        <Battery size={16} className={isDark ? "text-white" : "text-black"} />
                    </div>

                    {/* Calendar/Clock Toggle */}
                    <div
                        onClick={() => {
                            setIsCalendarOpen(!isCalendarOpen);
                            setIsQuickSettingsOpen(false);
                        }}
                        className={`
                            flex flex-col items-end justify-center px-2 py-1 rounded hover:bg-white/10 cursor-pointer transition-colors text-right
                            ${isCalendarOpen ? "bg-white/10" : ""}
                        `}
                    >
                        <span className={`text-xs font-medium ${isDark ? "text-white" : "text-black"}`}>
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-[10px] ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            {time.toLocaleDateString()}
                        </span>
                    </div>

                    {/* Show Desktop slice */}
                    <div className="w-1 h-full border-l border-gray-500/20 ml-1 hover:bg-white/20 cursor-pointer" title="Show Desktop"></div>
                </div>
            </div>

            {/* Flyouts */}
            <QuickSettings
                isOpen={isQuickSettingsOpen}
                onClose={() => setIsQuickSettingsOpen(false)}
                brightness={brightness}
                setBrightness={setBrightness}
            />
            <CalendarFlyout isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
        </>
    );
};

export default Taskbar;
