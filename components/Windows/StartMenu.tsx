"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Power, Settings, User } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
    dockItems: any[];
    onAppClick: (id: string) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({
    isOpen,
    onClose,
    dockItems,
    onAppClick,
}) => {
    const { theme } = useWindowsTheme();
    const isDark = theme === "dark";
    const [searchQuery, setSearchQuery] = useState("");

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return dockItems;
        return dockItems.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [dockItems, searchQuery]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`
              fixed bottom-16 left-1/2 -translate-x-1/2 z-50
              w-[640px] h-[650px] rounded-lg shadow-2xl border
              flex flex-col
              ${isDark
                                ? "bg-[#202020]/95 border-[#333] text-white"
                                : "bg-[#f3f3f3]/95 border-[#e5e5e5] text-black"
                            }
              backdrop-blur-xl
            `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Bar - Shortened and adjusted */}
                        <div className="p-6 pb-2">
                            <div className={`
                flex items-center gap-3 px-4 py-2 rounded-full border
                ${isDark ? "bg-[#191919] border-[#333]" : "bg-white border-[#e5e5e5]"}
                shadow-sm
              `}>
                                <Search size={16} className="opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Search for apps, settings, and documents"
                                    className="bg-transparent border-none outline-none w-full text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Pinned Apps / Search Results */}
                        <div className="flex-1 px-8 py-4 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold opacity-80">
                                    {searchQuery ? "Search Results" : "Pinned"}
                                </h3>
                                {!searchQuery && (
                                    <button className="text-xs px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
                                        All apps &gt;
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-6 gap-4">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                onAppClick(item.id);
                                                onClose();
                                                setSearchQuery(""); // Clear search on open
                                            }}
                                            className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                {typeof item.icon === "string" || (typeof item.icon === "object" && item.icon.src) ? (
                                                    <img src={item.icon.src || item.icon} alt={item.label} className="w-full h-full object-contain drop-shadow-md" />
                                                ) : (
                                                    // Fallback if icon is a component (though we aim to use images now)
                                                    <item.icon className="w-8 h-8" />
                                                )}
                                            </div>
                                            <span className="text-xs text-center truncate w-full opacity-90 group-hover:opacity-100">
                                                {item.label}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-6 text-center py-8 opacity-60 text-sm">
                                        No apps found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recommended Section (Only show if not searching) */}
                        {!searchQuery && (
                            <div className="px-8 py-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold opacity-80">Recommended</h3>
                                    <button className="text-xs px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
                                        More &gt;
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Mock items */}
                                    <div className="flex items-center gap-3 p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">W</div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">Resume.docx</span>
                                            <span className="text-[10px] opacity-60">Recently opened</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">X</div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">Project Budget.xlsx</span>
                                            <span className="text-[10px] opacity-60">10 min ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className={`
              h-16 px-8 flex items-center justify-between border-t
              ${isDark ? "bg-[#191919] border-[#333]" : "bg-[#e9e9e9] border-[#dcdcdc]"}
              rounded-b-lg
            `}>
                            <button className="flex items-center gap-3 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
                                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
                                    <User size={20} className="text-white" />
                                </div>
                                <span className="text-xs font-medium">User</span>
                            </button>

                            <button className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10">
                                <Power size={18} />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default StartMenu;
