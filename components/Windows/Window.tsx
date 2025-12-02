"use client";

import React from "react";
import { motion } from "framer-motion";
import { Minus, Square, X, Maximize2 } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";

interface WindowProps {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isFullscreen: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onFocus: () => void;
    onMove: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
    id,
    title,
    isOpen,
    isMinimized,
    isFullscreen,
    zIndex,
    position,
    size,
    onClose,
    onMinimize,
    onMaximize,
    onFocus,
    onMove,
    children,
}) => {
    const { theme } = useWindowsTheme();
    const isDark = theme === "dark";

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{
                opacity: isMinimized ? 0 : 1,
                scale: isMinimized ? 0.8 : 1,
                y: isMinimized ? 100 : 0,
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={isFullscreen ? "fixed inset-0" : "absolute"}
            style={{
                left: isFullscreen ? 0 : position.x,
                top: isFullscreen ? 0 : position.y,
                width: isFullscreen ? "100vw" : size.width,
                height: isFullscreen ? "calc(100vh - 48px)" : size.height, // Subtract taskbar height if fullscreen
                zIndex: zIndex,
            }}
            onMouseDown={onFocus}
        >
            <div
                className={`
          flex flex-col h-full
          ${isDark ? "bg-[#202020] border-[#333]" : "bg-[#f3f3f3] border-[#e5e5e5]"}
          ${isFullscreen ? "" : "rounded-lg border shadow-xl"}
          overflow-hidden
        `}
            >
                {/* Title Bar */}
                <div
                    className={`
            h-10 flex items-center justify-between px-3 select-none
            ${isDark ? "bg-[#202020]" : "bg-[#f3f3f3]"}
          `}
                    onMouseDown={onMove}
                >
                    <div className="flex items-center gap-3">
                        {/* Icon placeholder - could be passed as prop */}
                        <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-black"}`}>{title}</span>
                    </div>

                    <div className="flex items-center h-full">
                        <button
                            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                            className={`h-full w-12 flex items-center justify-center hover:bg-opacity-10 hover:bg-black transition-colors ${isDark ? "text-white" : "text-black"}`}
                        >
                            <Minus size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                            className={`h-full w-12 flex items-center justify-center hover:bg-opacity-10 hover:bg-black transition-colors ${isDark ? "text-white" : "text-black"}`}
                        >
                            {isFullscreen ? <Maximize2 size={12} /> : <Square size={12} />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className={`h-full w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors ${isDark ? "text-white" : "text-black"}`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-auto ${isDark ? "bg-[#191919]" : "bg-white"}`}>
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

export default Window;
