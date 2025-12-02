"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Bluetooth, Moon, Battery, Volume2, Sun, Settings, Shield, Cast, Accessibility } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";

interface QuickSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    brightness: number;
    setBrightness: (val: number) => void;
}

const QuickSettings: React.FC<QuickSettingsProps> = ({ isOpen, onClose, brightness, setBrightness }) => {
    const { theme, toggleTheme, currentTheme } = useWindowsTheme();
    const isDark = theme === "dark";

    const [volume, setVolume] = useState(75);
    const [wifi, setWifi] = useState(true);
    const [bluetooth, setBluetooth] = useState(true);
    const [nightLight, setNightLight] = useState(false);

    const GridButton = ({
        icon: Icon,
        label,
        active,
        onClick
    }: {
        icon: any,
        label: string,
        active: boolean,
        onClick: () => void
    }) => (
        <button
            onClick={onClick}
            className={`
                h-20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border
                ${active
                    ? "bg-blue-500 border-blue-400 text-white"
                    : isDark
                        ? "bg-[#333] border-[#444] hover:bg-[#3a3a3a] text-white"
                        : "bg-white border-gray-200 hover:bg-gray-50 text-black"
                }
            `}
        >
            <Icon size={20} fill={active ? "currentColor" : "none"} />
            <span className="text-xs font-medium">{label}</span>
        </button>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            fixed bottom-16 right-4 z-50 w-80 p-4 rounded-xl shadow-2xl border backdrop-blur-xl
                            ${isDark
                                ? "bg-[#202020]/95 border-[#333] text-white"
                                : "bg-[#f3f3f3]/95 border-[#e5e5e5] text-black"
                            }
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Toggles Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <GridButton
                                icon={Wifi}
                                label="Wi-Fi"
                                active={wifi}
                                onClick={() => setWifi(!wifi)}
                            />
                            <GridButton
                                icon={Bluetooth}
                                label="Bluetooth"
                                active={bluetooth}
                                onClick={() => setBluetooth(!bluetooth)}
                            />
                            <GridButton
                                icon={Cast}
                                label="Cast"
                                active={false}
                                onClick={() => { }}
                            />
                            <GridButton
                                icon={isDark ? Sun : Moon}
                                label={isDark ? "Light Mode" : "Dark Mode"}
                                active={false}
                                onClick={toggleTheme}
                            />
                            <GridButton
                                icon={Accessibility}
                                label="Accessibility"
                                active={false}
                                onClick={() => { }}
                            />
                            <GridButton
                                icon={Shield}
                                label="Security"
                                active={true}
                                onClick={() => { }}
                            />
                        </div>

                        {/* Sliders */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3">
                                <Sun size={18} className="opacity-70" />
                                <input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={brightness}
                                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Volume2 size={18} className="opacity-70" />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => setVolume(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-blue-500"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`
                            flex items-center justify-between pt-4 border-t
                            ${isDark ? "border-[#333]" : "border-[#e5e5e5]"}
                        `}>
                            <div className="flex items-center gap-2 text-xs opacity-70">
                                <Battery size={14} />
                                <span>77%</span>
                            </div>
                            <div className="flex items-center gap-2">

                                <button
                                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                    title="All Settings"
                                >
                                    <Settings size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickSettings;
