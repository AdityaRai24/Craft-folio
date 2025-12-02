"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DesktopWidgetProps {
    isVisible: boolean;
    showTime: boolean;
    showDate: boolean;
    showGreeting: boolean;
    position: "top-right" | "top-left" | "center" | "bottom-right" | "bottom-left";
    style: "modern" | "classic" | "minimal" | "glass" | "neumorphic";
    customGreeting: string;
    isDark: boolean;
}

const DesktopWidget: React.FC<DesktopWidgetProps> = ({
    isVisible,
    showTime,
    showDate,
    showGreeting,
    position,
    style,
    customGreeting,
    isDark,
}) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isVisible) return null;

    const getPositionClasses = () => {
        switch (position) {
            case "top-left":
                return "top-12 left-8 items-start text-left";
            case "top-right":
                return "top-12 right-8 items-end text-right";
            case "center":
                return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center";
            case "bottom-left":
                return "bottom-24 left-8 items-start text-left";
            case "bottom-right":
                return "bottom-24 right-8 items-end text-right";
            default:
                return "top-12 right-8 items-end text-right";
        }
    };

    const getStyleClasses = () => {
        const baseText = isDark ? "text-white" : "text-gray-800";

        switch (style) {
            case "modern":
                return `font-sans ${baseText} drop-shadow-lg`;
            case "classic":
                return `font-serif ${baseText} drop-shadow-md`;
            case "minimal":
                return `font-mono ${baseText} tracking-widest`;
            case "glass":
                return `backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl ${isDark ? "text-white" : "text-gray-900"}`;
            case "neumorphic":
                return `${isDark ? "bg-[#202020] shadow-[5px_5px_10px_#151515,-5px_-5px_10px_#2b2b2b] text-gray-200" : "bg-[#e0e0e0] shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] text-gray-700"} p-6 rounded-2xl`;
            default:
                return `font-sans ${baseText} drop-shadow-lg`;
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const getGreeting = () => {
        if (customGreeting) return customGreeting;
        const hour = time.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className={`absolute z-0 flex flex-col gap-1 pointer-events-none select-none ${getPositionClasses()}`}>
            <div className={`${getStyleClasses()} transition-all duration-300`}>
                {showGreeting && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl md:text-2xl font-medium opacity-90 mb-1"
                    >
                        {getGreeting()}
                    </motion.div>
                )}

                {showTime && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight leading-none"
                    >
                        {formatTime(time)}
                    </motion.div>
                )}

                {showDate && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg md:text-xl font-medium opacity-80 mt-2"
                    >
                        {formatDate(time)}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DesktopWidget;
