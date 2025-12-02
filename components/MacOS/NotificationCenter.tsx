"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight, X, Bell } from "lucide-react";
import { useMacOSTheme } from "./ThemeContext";
import 'react-calendar/dist/Calendar.css';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const { theme } = useMacOSTheme();
    const isDark = theme === "dark";
    const [date, setDate] = useState(new Date());

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`
                            fixed top-0 right-0 z-50 h-screen w-[360px] pt-10 px-4 pb-4
                            backdrop-blur-2xl shadow-2xl border-l
                            ${isDark
                                ? "bg-gray-800/80 border-gray-700/30 text-white"
                                : "bg-white/80 border-gray-200/30 text-black"
                            }
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full gap-6 overflow-y-auto custom-scrollbar">

                            {/* Date Header */}
                            <div className="mt-2">
                                <h2 className="text-3xl font-light">
                                    {date.toLocaleDateString(undefined, { weekday: 'long' })}
                                </h2>
                                <h3 className="text-xl font-medium opacity-80">
                                    {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                </h3>
                            </div>

                            {/* Notifications */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold opacity-50 uppercase tracking-wide">Notifications</span>
                                    {/* <button className="p-1 rounded-full hover:bg-gray-500/20"><X size={14} /></button> */}
                                </div>

                                <div className={`
                                    p-3 rounded-2xl backdrop-blur-md shadow-sm border
                                    ${isDark ? "bg-gray-700/40 border-white/10" : "bg-white/60 border-black/5"}
                                `}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                                            <Bell size={16} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold">Welcome to MacOS</h4>
                                            <p className="text-xs opacity-70 mt-1">Explore the new features including Control Center and Spotlight Search.</p>
                                        </div>
                                        <span className="text-[10px] opacity-40 ml-auto">Now</span>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="mt-auto mb-6">
                                <div className={`
                                    rounded-2xl p-4 backdrop-blur-md shadow-sm border
                                    ${isDark ? "bg-gray-700/20 border-white/5" : "bg-white/40 border-black/5"}
                                `}>
                                    <style jsx global>{`
                                        .react-calendar {
                                            background: transparent !important;
                                            border: none !important;
                                            width: 100% !important;
                                            font-family: inherit !important;
                                        }
                                        .react-calendar__navigation {
                                            margin-bottom: 1rem !important;
                                        }
                                        .react-calendar__navigation button {
                                            color: ${isDark ? '#fff' : '#000'} !important;
                                            min-width: 30px !important;
                                            background: none !important;
                                            font-size: 1.1rem !important;
                                        }
                                        .react-calendar__navigation button:enabled:hover,
                                        .react-calendar__navigation button:enabled:focus {
                                            background-color: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} !important;
                                            border-radius: 8px !important;
                                        }
                                        .react-calendar__month-view__weekdays {
                                            text-transform: uppercase !important;
                                            font-weight: 600 !important;
                                            font-size: 0.75rem !important;
                                            opacity: 0.6 !important;
                                            text-decoration: none !important;
                                        }
                                        .react-calendar__month-view__weekdays__weekday abbr {
                                            text-decoration: none !important;
                                        }
                                        .react-calendar__tile {
                                            padding: 10px 6px !important;
                                            background: none !important;
                                            color: ${isDark ? '#fff' : '#000'} !important;
                                            font-size: 0.9rem !important;
                                            border-radius: 8px !important;
                                        }
                                        .react-calendar__tile:enabled:hover,
                                        .react-calendar__tile:enabled:focus {
                                            background-color: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} !important;
                                        }
                                        .react-calendar__tile--now {
                                            background: ${isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)'} !important;
                                            color: ${isDark ? '#fff' : '#000'} !important;
                                            font-weight: bold !important;
                                        }
                                        .react-calendar__tile--active {
                                            background: #3b82f6 !important;
                                            color: white !important;
                                        }
                                        .react-calendar__tile--active:enabled:hover,
                                        .react-calendar__tile--active:enabled:focus {
                                            background: #2563eb !important;
                                        }
                                    `}</style>
                                    <Calendar
                                        onChange={(value) => setDate(value as Date)}
                                        value={date}
                                        className="w-full"
                                        prevLabel={<ChevronLeft size={16} />}
                                        nextLabel={<ChevronRight size={16} />}
                                        prev2Label={null}
                                        next2Label={null}
                                        formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'narrow' }).charAt(0)}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationCenter;
