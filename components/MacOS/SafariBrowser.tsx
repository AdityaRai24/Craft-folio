"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, ArrowLeft, ArrowRight, Lock, Globe, Search } from "lucide-react";
import { useMacOSTheme } from "./ThemeContext";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultMacOSSafariStyles } from "@/types/safari/macos";

const SafariBrowser = ({ theme = "light", portfolioId, font }: { theme?: "light" | "dark"; portfolioId?: string; font?: string }) => {
  const { currentTheme } = useMacOSTheme();
  const isDark = theme === "dark";

  const {
    effectiveCustomization,
  } = useCustomization("safari", defaultMacOSSafariStyles, portfolioId || "");

  // Helper to get embeddable URL
  const getEmbeddableUrl = (url: string) => {
    if (!url) return "";
    // Handle Google specially to avoid X-Frame-Options issues
    if (url === "https://www.google.com" || url === "https://google.com" || url === "www.google.com" || url === "google.com") {
      return "https://www.google.com/webhp?igu=1";
    }
    return url;
  };

  // Default homepage
  const [url, setUrl] = useState(effectiveCustomization.startUrl || "https://www.google.com");
  const [currentSrc, setCurrentSrc] = useState(getEmbeddableUrl(effectiveCustomization.startUrl || "https://www.google.com"));
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([effectiveCustomization.startUrl || "https://www.google.com"]);
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
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}&igu=1`;
      }
    }

    navigate(targetUrl);
  };

  const navigate = (targetUrl: string) => {
    setIsLoading(true);
    // Use embeddable URL for iframe, but keep clean URL for address bar
    setCurrentSrc(getEmbeddableUrl(targetUrl));
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
    <div className={`w-full h-full flex flex-col ${font || ""} ${isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-900"}`}>
      {/* Safari Toolbar */}
      <div className={`border-b px-4 py-3 flex items-center gap-4 ${isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-[#f5f5f5] border-gray-200"}`}>
        {effectiveCustomization.showNavigationButtons && (
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="p-1.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30"
            >
              <ArrowLeft size={18} className={isDark ? "text-gray-400" : "text-gray-600"} />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30"
            >
              <ArrowRight size={18} className={isDark ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
        )}

        {effectiveCustomization.showUrlBar && (
          <form onSubmit={handleNavigate} className="flex-1 flex items-center justify-center">
            <div className={`
                flex items-center gap-2 border rounded-lg px-3 py-1.5 w-full max-w-2xl shadow-sm transition-all
                ${isDark ? "bg-[#1e1e1e] border-gray-600 focus-within:border-blue-500" : "bg-white border-gray-300 focus-within:border-blue-500"}
            `}>
              {effectiveCustomization.showReloadButton && (
                <button
                  type="button"
                  onClick={reload}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <RefreshCw size={12} className={`${isLoading ? "animate-spin" : ""} ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              )}

              <div className="flex-1 flex items-center justify-center gap-2">
                {url.startsWith("https") && <Lock size={10} className="text-green-500" />}
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={`bg-transparent border-none outline-none text-sm text-center w-full ${isDark ? "text-white" : "text-gray-900"}`}
                  placeholder="Search or enter website name"
                />
              </div>
            </div>
          </form>
        )}

        {effectiveCustomization.showHomeButton && (
          <button
            onClick={() => navigate(effectiveCustomization.startUrl || "https://www.google.com")}
            className="p-1.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <Home size={18} className={isDark ? "text-gray-400" : "text-gray-600"} />
          </button>
        )}
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
          title="Safari Browser"
          onLoad={() => setIsLoading(false)}
        />

        {/* Overlay for sites that refuse to connect (Optional fallback UI) */}
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

export default SafariBrowser;
