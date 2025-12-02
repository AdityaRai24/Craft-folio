"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sun, Calendar, Clock, TrendingUp, Music, Image as ImageIcon } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";

interface WindowsWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const WindowsWidget: React.FC<WindowsWidgetProps> = ({ isOpen, onClose }) => {
    const { theme, currentTheme } = useWindowsTheme();
    const isDark = theme === "dark";
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Mock Data
    const weather = { temp: 72, condition: "Partly Cloudy", high: 75, low: 65 };
    const stocks = [
        { symbol: "MSFT", price: "332.45", change: "+1.2%" },
        { symbol: "AAPL", price: "178.32", change: "-0.5%" },
        { symbol: "GOOGL", price: "138.21", change: "+0.8%" },
    ];
    const news = [
        { title: "New Surface devices announced", source: "Tech News" },
        { title: "Windows 11 update brings AI features", source: "OS Daily" },
        { title: "Top 10 coding practices for 2025", source: "Dev Weekly" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-30 bg-transparent" onClick={onClose} />

                    {/* Widget Panel */}
                    <motion.div
                        initial={{ x: -400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -400, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`
              fixed top-0 left-0 bottom-0 z-40 w-[400px]
              backdrop-blur-2xl shadow-2xl border-r
              overflow-y-auto p-6 flex flex-col gap-6
              ${isDark ? "bg-[#202020]/90 border-white/10" : "bg-[#f3f3f3]/90 border-black/5"}
            `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold" style={{ color: currentTheme.text.primary }}>
                                {formatTime(time)}
                            </div>
                            <div className="text-sm font-medium opacity-70" style={{ color: currentTheme.text.secondary }}>
                                {formatDate(time)}
                            </div>
                        </div>

                        {/* Weather Card */}
                        <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-white/60"} shadow-sm border ${isDark ? "border-white/5" : "border-black/5"}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Cloud size={20} className="text-blue-400" />
                                    <span className="font-medium" style={{ color: currentTheme.text.primary }}>Weather</span>
                                </div>
                                <span className="text-xs opacity-60" style={{ color: currentTheme.text.secondary }}>Seattle, WA</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-4xl font-bold" style={{ color: currentTheme.text.primary }}>{weather.temp}°</div>
                                    <div className="text-sm opacity-70" style={{ color: currentTheme.text.secondary }}>{weather.condition}</div>
                                </div>
                                <div className="text-right text-sm opacity-70" style={{ color: currentTheme.text.secondary }}>
                                    <div>H: {weather.high}°</div>
                                    <div>L: {weather.low}°</div>
                                </div>
                            </div>
                        </div>

                        {/* Stocks Card */}
                        <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-white/60"} shadow-sm border ${isDark ? "border-white/5" : "border-black/5"}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp size={20} className="text-green-500" />
                                <span className="font-medium" style={{ color: currentTheme.text.primary }}>Market Watch</span>
                            </div>
                            <div className="space-y-2">
                                {stocks.map((stock, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="font-medium" style={{ color: currentTheme.text.primary }}>{stock.symbol}</span>
                                        <div className="flex items-center gap-4">
                                            <span style={{ color: currentTheme.text.secondary }}>{stock.price}</span>
                                            <span className={stock.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                                                {stock.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Photos / Memories */}
                        <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-white/60"} shadow-sm border ${isDark ? "border-white/5" : "border-black/5"}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <ImageIcon size={20} className="text-purple-500" />
                                <span className="font-medium" style={{ color: currentTheme.text.primary }}>On this day</span>
                            </div>
                            <div className="aspect-video rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden relative group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"
                                    alt="Memory"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                    <span className="text-white text-sm font-medium">2 years ago</span>
                                </div>
                            </div>
                        </div>

                        {/* News Feed */}
                        <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-white/60"} shadow-sm border ${isDark ? "border-white/5" : "border-black/5"}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar size={20} className="text-orange-500" />
                                <span className="font-medium" style={{ color: currentTheme.text.primary }}>Top Stories</span>
                            </div>
                            <div className="space-y-3">
                                {news.map((item, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <div className="text-sm font-medium mb-1 group-hover:text-blue-500 transition-colors" style={{ color: currentTheme.text.primary }}>
                                            {item.title}
                                        </div>
                                        <div className="text-xs opacity-60" style={{ color: currentTheme.text.secondary }}>
                                            {item.source} • 2h ago
                                        </div>
                                        {idx < news.length - 1 && <div className={`h-px w-full my-2 ${isDark ? "bg-white/10" : "bg-black/5"}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WindowsWidget;
