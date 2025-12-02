"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Home, ArrowLeft, ArrowRight, Lock, Globe } from "lucide-react";
import { useWindowsTheme } from "./ThemeContext";

const EdgeBrowser = ({ theme = "light", portfolioId, font }: { theme?: "light" | "dark"; portfolioId?: string; font?: string }) => {
    const { currentTheme } = useWindowsTheme();
    const isDark = theme === "dark";

    // Default homepage is Bing (simulated) or a custom start page
    const [url, setUrl] = useState("https://www.bing.com");
    const [currentSrc, setCurrentSrc] = useState("https://www.bing.com"); // Actual iframe src
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<string[]>(["https://www.bing.com"]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let targetUrl = url;

        // Basic URL validation/formatting
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
            // If it looks like a domain, add https://
            if (targetUrl.includes(".") && !targetUrl.includes(" ")) {
                targetUrl = `https://${targetUrl}`;
            } else {
                // Otherwise treat as search query
                targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(targetUrl)}`;
            }
        }

        navigate(targetUrl);
    };

    const navigate = (targetUrl: string) => {
        setIsLoading(true);
        setCurrentSrc(targetUrl);
        setUrl(targetUrl);

        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(targetUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        // Simulate loading delay
        setTimeout(() => setIsLoading(false), 1000);
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const prevUrl = history[newIndex];
            setCurrentSrc(prevUrl);
            setUrl(prevUrl);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const nextUrl = history[newIndex];
            setCurrentSrc(nextUrl);
            setUrl(nextUrl);
        }
    };

    const reload = () => {
        setIsLoading(true);
        const current = iframeRef.current;
        if (current) {
            // Force reload by resetting src
            const src = current.src;
            current.src = src;
        }
        setTimeout(() => setIsLoading(false), 800);
    };

    return (
        <div className={`w-full h-full flex flex-col ${font || ""} ${isDark ? "bg-[#202020] text-white" : "bg-white text-gray-900"}`}>
            {/* Edge Toolbar */}
            <div className={`border-b px-2 py-2 flex items-center gap-2 ${isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-[#f3f3f3] border-gray-200"}`}>
                <div className="flex items-center gap-1">
                    <button
                        onClick={goBack}
                        disabled={historyIndex === 0}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button
                        onClick={goForward}
                        disabled={historyIndex === history.length - 1}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30"
                    >
                        <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={reload}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                <form onSubmit={handleNavigate} className="flex-1 flex items-center">
                    <div className={`
                        flex items-center gap-2 border rounded-full px-4 py-1.5 flex-1 shadow-sm transition-all
                        ${isDark ? "bg-[#1a1a1a] border-gray-600 focus-within:border-blue-500" : "bg-white border-gray-300 focus-within:border-blue-500"}
                    `}>
                        {url.startsWith("https") ? (
                            <Lock size={12} className="text-green-500" />
                        ) : (
                            <Globe size={12} className="text-gray-500" />
                        )}
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className={`flex-1 bg-transparent border-none outline-none text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                            placeholder="Search or enter web address"
                        />
                    </div>
                </form>

                <div className="flex items-center gap-1 px-2">
                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <Home size={16} onClick={() => navigate("https://www.bing.com")} />
                    </button>
                </div>
            </div>

            {/* Browser Content */}
            <div className="flex-1 relative bg-white">
                {/* Loading Bar */}
                {isLoading && (
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "80%" }}
                        className="h-0.5 bg-blue-500 absolute top-0 left-0 z-10"
                    />
                )}

                {/* Iframe */}
                <iframe
                    ref={iframeRef}
                    src={currentSrc}
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    title="Edge Browser"
                    onLoad={() => setIsLoading(false)}
                />

                {/* Overlay for sites that refuse to connect (Optional fallback UI) */}
                {/* Note: We can't easily detect X-Frame-Options errors from JS due to security policies. 
                    So we provide a generic "Open in New Tab" button always visible or just rely on the user. */}
                <div className={`absolute bottom-4 right-4 z-20`}>
                    <a
                        href={currentSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        Open in New Tab <Globe size={12} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EdgeBrowser;
