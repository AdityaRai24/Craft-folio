"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, File, AppWindow, ArrowRight } from "lucide-react";
import { useMacOSTheme } from "./ThemeContext";

interface SpotlightProps {
    isOpen: boolean;
    onClose: () => void;
    dockItems: any[];
    openWindow: (id: string) => void;
}

const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, dockItems, openWindow }) => {
    const { theme } = useMacOSTheme();
    const isDark = theme === "dark";
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
        }
    }, [isOpen]);

    const filteredItems = dockItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (id: string) => {
        openWindow(id);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && filteredItems.length > 0) {
            handleSelect(filteredItems[0].id);
        }
        if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60] bg-transparent" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            fixed top-[20%] left-1/2 -translate-x-1/2 z-[70] w-[600px] rounded-xl shadow-2xl border backdrop-blur-2xl overflow-hidden
                            ${isDark
                                ? "bg-gray-800/80 border-gray-700/50 text-white"
                                : "bg-white/80 border-gray-200/50 text-black"
                            }
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center px-4 py-4 gap-3">
                            <Search size={24} className="opacity-50" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Spotlight Search"
                                className="flex-1 bg-transparent border-none outline-none text-2xl font-light placeholder-opacity-30"
                            />
                        </div>

                        {/* Results */}
                        {query && (
                            <div className={`border-t ${isDark ? "border-white/10" : "border-black/5"}`}>
                                {filteredItems.length > 0 ? (
                                    <div className="py-2">
                                        <div className="px-4 py-1 text-xs font-semibold opacity-50 uppercase tracking-wider">Top Hit</div>
                                        {filteredItems.map((item, index) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(item.id)}
                                                className={`
                                                    w-full px-4 py-2 flex items-center gap-3 transition-colors
                                                    ${index === 0
                                                        ? (isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white")
                                                        : (isDark ? "hover:bg-white/10" : "hover:bg-black/5")
                                                    }
                                                `}
                                            >
                                                <div className="w-8 h-8 flex items-center justify-center">
                                                    {typeof item.icon === "string" || (typeof item.icon === "object" && item.icon.src) ? (
                                                        <img src={typeof item.icon === "string" ? item.icon : item.icon.src} alt="" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <item.icon size={20} />
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium">{item.label}</div>
                                                    <div className="text-xs opacity-70">Application</div>
                                                </div>
                                                {index === 0 && <ArrowRight size={16} className="opacity-70" />}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center opacity-50">
                                        No results found
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Spotlight;
