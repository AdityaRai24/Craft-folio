"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

interface CalendarFlyoutProps {
    isOpen: boolean;
    onClose: () => void;
}

const CalendarFlyout: React.FC<CalendarFlyoutProps> = ({ isOpen, onClose }) => {
    const { theme, currentTheme } = useWindowsTheme();
    const isDark = theme === "dark";
    const [date, setDate] = useState(new Date());
    const [notificationsExpanded, setNotificationsExpanded] = useState(true);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={onClose}
                    />
                    <motion.div
                        key="flyout"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            fixed bottom-16 right-4 z-50 w-[360px] h-[calc(100vh-80px)] max-h-[700px]
                            rounded-xl shadow-2xl border backdrop-blur-xl flex flex-col overflow-hidden
                            ${isDark
                                ? "bg-[#202020]/95 border-[#333] text-white"
                                : "bg-[#f3f3f3]/95 border-[#e5e5e5] text-black"
                            }
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Date Header */}
                        <div className="p-6 pb-2">
                            <h2 className="text-3xl font-light">
                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </h2>
                            <p className="text-blue-500 font-medium mt-1">
                                {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Notifications Section */}
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold opacity-80">Notifications</h3>
                                <button
                                    onClick={() => setNotificationsExpanded(!notificationsExpanded)}
                                    className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
                                >
                                    {notificationsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            </div>

                            {notificationsExpanded ? (
                                <div className="space-y-2">
                                    <div className={`p-3 rounded-lg border ${isDark ? "bg-[#2a2a2a] border-[#333]" : "bg-white border-[#e5e5e5]"}`}>
                                        <div className="text-xs font-bold mb-1">System</div>
                                        <div className="text-sm">Welcome to your new Windows experience!</div>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${isDark ? "bg-[#2a2a2a] border-[#333]" : "bg-white border-[#e5e5e5]"}`}>
                                        <div className="text-xs font-bold mb-1">Outlook</div>
                                        <div className="text-sm">Meeting with team at 2:00 PM</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs opacity-50 text-center py-4">
                                    No new notifications
                                </div>
                            )}
                        </div>

                        {/* Calendar Section */}
                        <div className={`p-4 border-t ${isDark ? "border-[#333]" : "border-[#e5e5e5]"}`}>
                            <div className={`
                                windows-calendar-wrapper rounded-lg p-2
                                ${isDark ? "dark-calendar" : "light-calendar"}
                            `}>
                                <Calendar
                                    onChange={(value) => setDate(value as Date)}
                                    value={date}
                                    className={`bg-transparent border-none w-full font-sans`}
                                    tileClassName={({ date: tileDate, view }) => {
                                        if (view === 'month' && tileDate.toDateString() === new Date().toDateString()) {
                                            return 'bg-blue-500 text-white rounded-full';
                                        }
                                        return 'hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full';
                                    }}
                                    prevLabel={<ChevronLeft size={16} />}
                                    nextLabel={<ChevronRight size={16} />}
                                    prev2Label={null}
                                    next2Label={null}
                                    formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'narrow' })}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
            <style jsx global>{`
                .react-calendar {
                    background: transparent !important;
                    border: none !important;
                    width: 100% !important;
                    font-family: inherit !important;
                }
                .react-calendar__navigation button {
                    color: inherit !important;
                    min-width: 44px;
                    background: none;
                    font-size: 14px;
                    font-weight: 600;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: rgba(128, 128, 128, 0.1);
                    border-radius: 8px;
                }
                .react-calendar__month-view__weekdays {
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: 0.75em;
                    opacity: 0.7;
                }
                .react-calendar__tile {
                    padding: 10px 6px;
                    background: none;
                    text-align: center;
                    line-height: 16px;
                    font-size: 13px;
                }
                .react-calendar__tile--now {
                    background: #0078d4;
                    color: white;
                    border-radius: 50%;
                }
                .react-calendar__tile--now:enabled:hover,
                .react-calendar__tile--now:enabled:focus {
                    background: #0063b1;
                }
                .dark-calendar .react-calendar__tile:enabled:hover,
                .dark-calendar .react-calendar__tile:enabled:focus {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                }
                .light-calendar .react-calendar__tile:enabled:hover,
                .light-calendar .react-calendar__tile:enabled:focus {
                    background-color: rgba(0, 0, 0, 0.05);
                    border-radius: 50%;
                }
                .react-calendar__tile--active {
                    background: #0078d4 !important;
                    color: white !important;
                    border-radius: 50%;
                }
            `}</style>
        </AnimatePresence>
    );
};

export default CalendarFlyout;
