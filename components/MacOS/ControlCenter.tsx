"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Bluetooth, Moon, Volume2, Sun, Disc, Cast, Monitor } from "lucide-react";
import { useMacOSTheme } from "./ThemeContext";

interface ControlCenterProps {
    isOpen: boolean;
    onClose: () => void;
    brightness: number;
    setBrightness: (val: number) => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose, brightness, setBrightness }) => {
    const { theme, toggleTheme } = useMacOSTheme();
    const isDark = theme === "dark";

    const [volume, setVolume] = useState(75);
    const [wifi, setWifi] = useState(true);
    const [bluetooth, setBluetooth] = useState(true);
    const [airdrop, setAirdrop] = useState(true);
    const [focus, setFocus] = useState(false);

    const ToggleButton = ({
        icon: Icon,
        label,
        active,
        onClick,
        colorClass = "bg-blue-500"
    }: {
        icon: any,
        label: string,
        active: boolean,
        onClick: () => void,
        colorClass?: string
    }) => (
        <div className="flex items-center gap-3">
            <button
                onClick={onClick}
                className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all
                    ${active
                        ? `${colorClass} text-white shadow-md`
                        : isDark
                            ? "bg-gray-600/50 text-gray-300"
                            : "bg-gray-200/50 text-gray-600"
                    }
                `}
            >
                <Icon size={14} fill={active ? "currentColor" : "none"} />
            </button>
            <div className="flex flex-col">
                <span className={`text-xs font-medium ${isDark ? "text-white" : "text-black"}`}>{label}</span>
                <span className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {active ? "On" : "Off"}
                </span>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "circOut" }}
                        className={`
                            fixed top-9 right-2 z-50 w-80 p-3 rounded-2xl shadow-2xl border backdrop-blur-2xl
                            ${isDark
                                ? "bg-gray-800/80 border-gray-600/30 text-white"
                                : "bg-white/80 border-gray-200/30 text-black"
                            }
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Connectivity Module */}
                            <div className={`
                                row-span-2 rounded-xl p-3 flex flex-col justify-between gap-3
                                ${isDark ? "bg-black/20" : "bg-white/40 shadow-sm"}
                            `}>
                                <ToggleButton
                                    icon={Wifi}
                                    label="Wi-Fi"
                                    active={wifi}
                                    onClick={() => setWifi(!wifi)}
                                />
                                <ToggleButton
                                    icon={Bluetooth}
                                    label="Bluetooth"
                                    active={bluetooth}
                                    onClick={() => setBluetooth(!bluetooth)}
                                />
                                <ToggleButton
                                    icon={Cast}
                                    label="AirDrop"
                                    active={airdrop}
                                    onClick={() => setAirdrop(!airdrop)}
                                />
                            </div>

                            {/* Focus Module */}
                            <div className={`
                                rounded-xl p-3 flex items-center gap-3
                                ${isDark ? "bg-black/20" : "bg-white/40 shadow-sm"}
                            `}>
                                <button
                                    onClick={() => setFocus(!focus)}
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                        ${focus
                                            ? "bg-indigo-500 text-white shadow-md"
                                            : isDark ? "bg-gray-600/50 text-gray-300" : "bg-gray-200/50 text-gray-600"
                                        }
                                    `}
                                >
                                    <Moon size={14} fill={focus ? "currentColor" : "none"} />
                                </button>
                                <span className={`text-xs font-medium ${isDark ? "text-white" : "text-black"}`}>
                                    Focus
                                </span>
                            </div>

                            {/* Theme Module (Custom addition for functionality) */}
                            <div className={`
                                rounded-xl p-3 flex items-center gap-3 cursor-pointer
                                ${isDark ? "bg-black/20" : "bg-white/40 shadow-sm"}
                            `} onClick={toggleTheme}>
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center transition-all
                                    ${isDark ? "bg-gray-600/50 text-gray-300" : "bg-gray-200/50 text-gray-600"}
                                `}>
                                    {isDark ? <Sun size={14} /> : <Moon size={14} />}
                                </div>
                                <span className={`text-xs font-medium ${isDark ? "text-white" : "text-black"}`}>
                                    {isDark ? "Light Mode" : "Dark Mode"}
                                </span>
                            </div>
                        </div>

                        {/* Display Module */}
                        <div className={`
                            rounded-xl p-3 mb-3
                            ${isDark ? "bg-black/20" : "bg-white/40 shadow-sm"}
                        `}>
                            <div className="mb-2 text-xs font-medium opacity-70">Display</div>
                            <div className="flex items-center gap-3">
                                <Sun size={16} className="opacity-50" />
                                <input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={brightness}
                                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-400/30 rounded-lg appearance-none cursor-pointer accent-white"
                                />
                            </div>
                        </div>

                        {/* Sound Module */}
                        <div className={`
                            rounded-xl p-3 mb-3
                            ${isDark ? "bg-black/20" : "bg-white/40 shadow-sm"}
                        `}>
                            <div className="mb-2 text-xs font-medium opacity-70">Sound</div>
                            <div className="flex items-center gap-3">
                                <Volume2 size={16} className="opacity-50" />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => setVolume(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-400/30 rounded-lg appearance-none cursor-pointer accent-white"
                                />
                            </div>
                        </div>

                        {/* Music Player (Mock) */}
                        <div className={`
                            rounded-xl p-3 flex items-center gap-3
                            ${isDark ? "bg-black/20" : "bg-white/40 shadow-sm"}
                        `}>
                            <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${isDark ? "bg-gray-700" : "bg-gray-200"}
                            `}>
                                <Disc size={20} className="animate-spin-slow" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium">Not Playing</span>
                                <span className="text-[10px] opacity-50">Music</span>
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ControlCenter;
