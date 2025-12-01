"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { RootState } from "@/store/store";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Maximize2, Minimize2, FileText, Github, Linkedin, Mail, Image as ImageIcon, Cpu, X, Layout } from "lucide-react";
import TopBar from "./TopBar";
import ProjectsGrid from "./Projects";
import TerminalWindow from "./TerminalWindow";
import ResumeViewer from "./ResumeViewer";
import Contact from "./Contact";
import SafariBrowser from "./SafariBrowser";
import ExperienceWindow from "./ExperienceWindow";
import Technologies from "./Technologies";
import WallpaperVisualEditor from "@/components/VisualEditor/Wallpaper/WallpaperVisualEditor";
import DesktopWidgetVisualEditor from "@/components/VisualEditor/DesktopWidget/DesktopWidgetVisualEditor";
import DesktopWidget from "./DesktopWidget";
import { MacOSThemeProvider, useMacOSTheme } from "./ThemeContext";
import Preview from "./icons/preview.svg";
import Terminal from "./icons/terminal.svg";
import ContactIcon from "./icons/contact.svg";
import SafariIcon from "./icons/safari.svg";
import CodeIcon from "./icons/code.svg";
import { useDesktopEnvironment, WindowState } from "@/hooks/useDesktopEnvironment";

interface DesktopProps {
  currentPortTheme?: string;
  customCSS?: string;
  portfolioId?: string;
  font?: string;
}

const Desktop: React.FC<DesktopProps> = ({
  currentPortTheme,
  customCSS,
  portfolioId,
  font,
}) => {
  const portfolioData = useSelector(
    (state: RootState) => state.data.portfolioData
  );
  const heroData =
    portfolioData?.find((item: any) => item.type === "hero")?.data || {};

  const widgetData = portfolioData?.find((item: any) => item.type === "desktopWidget")?.data || {
    isVisible: true,
    showTime: true,
    showDate: true,
    showGreeting: true,
    position: "top-right",
    style: "modern",
    customGreeting: "",
  };

  const themeWallpapers: Record<string, string> = {
    Sonoma: "https://4kwallpapers.com/images/wallpapers/macos-sonoma-5120x2880-12164.jpg",
    Ventura: "https://4kwallpapers.com/images/wallpapers/macos-ventura-5120x2880-8998.jpg",
    Monterey: "https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-5120x2880-5898.jpg",
  };

  const backgroundImage =
    heroData.image ||
    (currentPortTheme && themeWallpapers[currentPortTheme]) ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80";

  const initialWindows: Record<string, WindowState> = {
    projects: {
      id: "projects",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
    },
    terminal: {
      id: "terminal",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 200, y: 150 },
      size: { width: 700, height: 500 },
    },
    resume: {
      id: "resume",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 300, y: 200 },
      size: { width: 800, height: 700 },
    },
    contact: {
      id: "contact",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 400, y: 250 },
      size: { width: 800, height: 600 },
    },
    safari: {
      id: "safari",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 500, y: 300 },
      size: { width: 900, height: 600 },
    },
    experience: {
      id: "experience",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 150, y: 150 },
      size: { width: 850, height: 650 },
    },
    skills: {
      id: "skills",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 250, y: 250 },
      size: { width: 900, height: 600 },
    },
    wallpaper: {
      id: "wallpaper",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 350, y: 150 },
      size: { width: 500, height: 600 },
    },
    widgets: {
      id: "widgets",
      isOpen: false,
      isMinimized: false,
      isFullscreen: false,
      zIndex: 0,
      position: { x: 450, y: 200 },
      size: { width: 500, height: 700 },
    },
  };

  const dockConfig: Record<string, any> = {
    projects: { id: "projects", icon: CodeIcon, label: "Projects", component: ProjectsGrid },
    experience: { id: "experience", icon: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png", label: "Experience", component: ExperienceWindow },
    skills: { id: "skills", icon: "/tie-svgrepo-com.svg", label: "Skills", component: Technologies },
    terminal: { id: "terminal", icon: Terminal, label: "Terminal", component: TerminalWindow },
    resume: { id: "resume", icon: Preview, label: "Resume", component: ResumeViewer },
    contact: { id: "contact", icon: ContactIcon, label: "Contact", component: Contact },
    safari: { id: "safari", icon: SafariIcon, label: "Safari", component: SafariBrowser },
    wallpaper: { id: "wallpaper", icon: "/wallpaper-svgrepo-com.svg", label: "Wallpaper", component: WallpaperVisualEditor },
    widgets: { id: "widgets", icon: "/widget-5-svgrepo-com.svg", label: "Widgets", component: DesktopWidgetVisualEditor },
  };

  // Dynamically order dock items based on portfolioData
  const getOrderedDockItems = () => {
    if (!portfolioData) return Object.values(dockConfig);

    const orderedItems: any[] = [];
    const processedIds = new Set<string>();

    // 1. Add items from portfolioData in order
    portfolioData.forEach((section: any) => {
      if (dockConfig[section.type]) {
        orderedItems.push(dockConfig[section.type]);
        processedIds.add(section.type);
      }
    });

    // 2. Add remaining fixed apps (Terminal, Safari, Resume if not in portfolioData)
    // Note: Resume might be a section, but Terminal and Safari are usually system apps
    const systemApps = ["terminal", "safari", "resume", "wallpaper", "widgets"];
    systemApps.forEach((appId) => {
      if (!processedIds.has(appId) && dockConfig[appId]) {
        orderedItems.push(dockConfig[appId]);
        processedIds.add(appId);
      }
    });

    // 3. Add any other remaining items from dockConfig that weren't added
    Object.keys(dockConfig).forEach((key) => {
      if (!processedIds.has(key)) {
        orderedItems.push(dockConfig[key]);
        processedIds.add(key);
      }
    });

    return orderedItems;
  };

  const dockItems = getOrderedDockItems();

  const {
    windows,
    setWindows,
    nextZIndex,
    setNextZIndex,
    draggingWindow,
    setDraggingWindow,
    dragOffset,
    setDragOffset,
    mouseX,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleFullscreen,
    bringToFront,
    closeAllWindows,
    handleMouseDown,
  } = useDesktopEnvironment(initialWindows);

  const getWindowTitle = (id: string) => {
    const item = dockItems.find((item) => item.id === id);
    return item?.label || id;
  };


  return (
    <MacOSThemeProvider currentPortTheme={currentPortTheme}>
      <DesktopContent
        windows={windows}
        setWindows={setWindows}
        nextZIndex={nextZIndex}
        setNextZIndex={setNextZIndex}
        draggingWindow={draggingWindow}
        setDraggingWindow={setDraggingWindow}
        dragOffset={dragOffset}
        setDragOffset={setDragOffset}
        mouseX={mouseX}
        dockItems={dockItems}
        backgroundImage={backgroundImage}
        currentPortTheme={currentPortTheme}
        customCSS={customCSS}
        portfolioId={portfolioId}
        openWindow={openWindow}
        closeWindow={closeWindow}
        minimizeWindow={minimizeWindow}
        restoreWindow={restoreWindow}
        toggleFullscreen={toggleFullscreen}
        bringToFront={bringToFront}
        handleMouseDown={handleMouseDown}
        getWindowTitle={getWindowTitle}
        font={font}
        widgetData={widgetData}
        closeAllWindows={closeAllWindows} // Pass closeAllWindows
      />
    </MacOSThemeProvider>
  );
};

function DesktopContent({
  windows,
  setWindows,
  nextZIndex,
  setNextZIndex,
  draggingWindow,
  setDraggingWindow,
  dragOffset,
  setDragOffset,
  mouseX,
  dockItems,
  backgroundImage,
  currentPortTheme,
  customCSS,
  portfolioId,
  openWindow,
  closeWindow,
  minimizeWindow,
  restoreWindow,
  toggleFullscreen,
  bringToFront,
  handleMouseDown,
  getWindowTitle,
  font,
  widgetData,
  closeAllWindows, // Receive closeAllWindows
}: any) {
  const { theme } = useMacOSTheme();
  const { user } = useUser();
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
  const userInfoData = portfolioData?.find((item: any) => item.type === "userInfo")?.data || {};

  const isOwner = (user && user.id === portfolioUserId) || portfolioUserId === "guest";

  // Filter dock items based on ownership
  const visibleDockItems = dockItems.filter((item: any) => {
    if (item.id === "wallpaper" || item.id === "widgets") {
      return isOwner;
    }
    return true;
  }).map((item: any) => {
    if (isOwner && (item.id === "wallpaper" || item.id === "widgets")) {
      return { ...item, label: `${item.label} (Creator Only)` };
    }
    return item;
  });

  const hasOpenWindows = Object.values(windows).some((win: any) => win.isOpen);

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingWindow) {
      const win = windows[draggingWindow];
      if (!win) return;

      // Calculate new position
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Get viewport dimensions
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
      const topBarHeight = 28; // TopBar height in pixels

      // Constrain window position to keep it within viewport
      // Ensure at least 40px (title bar height) is always visible
      const minVisibleHeight = 40;
      const maxX = viewportWidth - minVisibleHeight;
      const maxY = viewportHeight - minVisibleHeight;

      // Clamp X position
      newX = Math.max(-win.size.width + minVisibleHeight, Math.min(newX, maxX));

      // Clamp Y position (account for topbar)
      // Allow dragging up but keep at least 40px visible at the bottom
      newY = Math.max(topBarHeight - win.size.height + minVisibleHeight, Math.min(newY, maxY));

      setWindows((prev: any) => ({
        ...prev,
        [draggingWindow]: {
          ...prev[draggingWindow],
          position: {
            x: newX,
            y: newY,
          },
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingWindow(null);
  };

  useEffect(() => {
    if (draggingWindow) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingWindow, dragOffset]);

  const isDark = theme === "dark";

  return (
    <div className={`fixed inset-0 overflow-hidden ${isDark ? "bg-gray-900" : "bg-gray-100"} ${font || ""}`}>
      {/* Desktop Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Desktop Widget */}
      <DesktopWidget
        isVisible={widgetData.isVisible}
        showTime={widgetData.showTime}
        showDate={widgetData.showDate}
        showGreeting={widgetData.showGreeting}
        position={widgetData.position}
        style={widgetData.style}
        customGreeting={widgetData.customGreeting}
        isDark={isDark}
      />

      {/* TopBar */}
      <TopBar
        currentPortTheme={currentPortTheme}
        customCSS={customCSS}
        portfolioId={portfolioId}
        onEditWallpaper={isOwner ? () => openWindow("wallpaper") : undefined}
        onOpenResume={() => openWindow("resume")}
      />


      {/* Desktop Icons - positioned on left side like macOS */}
      <div className="absolute left-0 top-0 w-full h-full pt-7 pointer-events-none z-[1]">
        <DesktopIcons
          userInfoData={userInfoData}
          openWindow={openWindow}
          isDark={isDark}
        />
      </div>

      {/* Windows */}
      <div className="relative w-full h-full pt-7 z-[2]">
        <AnimatePresence>
          {Object.entries(windows).map(([id, winState]) => {
            const win = winState as WindowState;
            if (!win.isOpen) return null;

            const DockItem = dockItems.find((item: any) => item.id === id);
            const WindowComponent = DockItem?.component;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: win.isMinimized ? 0 : 1,
                  scale: win.isMinimized ? 0.8 : 1,
                  y: win.isMinimized ? 100 : 0,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={win.isFullscreen ? "fixed inset-0" : "absolute"}
                style={
                  win.isFullscreen
                    ? {
                      left: 0,
                      top: "28px", // Start below topbar
                      width: "100vw",
                      height: "calc(100vh - 28px)", // Full height minus topbar
                      zIndex: win.zIndex,
                    }
                    : {
                      left: `${win.position.x}px`,
                      top: `${win.position.y}px`,
                      width: `${win.size.width}px`,
                      height: win.size.height ? `${win.size.height}px` : "auto",
                      maxWidth: "90vw",
                      maxHeight: "85vh",
                      zIndex: win.zIndex,
                    }
                }
                onMouseDown={() => bringToFront(id)}
              >
                {/* macOS Window */}
                <div
                  className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} rounded-t-lg border shadow-2xl overflow-hidden flex flex-col pb-2 cursor-move`}
                  style={{
                    height: win.isFullscreen ? "calc(100vh - 28px)" : win.size.height ? `${win.size.height}px` : "auto",
                    width: win.isFullscreen ? "100vw" : "100%",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, id)}
                >
                  {/* Window Title Bar */}
                  <div
                    className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"} px-4 py-2 flex items-center justify-between border-b flex-shrink-0`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => closeWindow(id)}
                          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                        />
                        <button
                          onClick={() =>
                            win.isMinimized
                              ? restoreWindow(id)
                              : minimizeWindow(id)
                          }
                          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                        />
                        <button
                          onClick={() => toggleFullscreen(id)}
                          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                        />
                      </div>
                      <span className={`${isDark ? "text-gray-200" : "text-gray-800"} text-sm ml-3 font-medium`}>
                        {getWindowTitle(id)}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFullscreen(id)}
                      className={`${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"} p-1 rounded transition-colors`}
                      title={win.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {win.isFullscreen ? (
                        <Minimize2 size={14} />
                      ) : (
                        <Maximize2 size={14} />
                      )}
                    </button>
                  </div>

                  {/* Window Content */}
                  <div
                    className={`${isDark ? "bg-gray-800" : "bg-white"} flex-1 ${id === "terminal" || id === "resume" || id === "safari"
                      ? "overflow-hidden"
                      : "overflow-y-auto"
                      }`}
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: isDark ? "rgba(255,255,255,0.2) transparent" : "rgba(0,0,0,0.2) transparent",
                      height: win.isFullscreen ? "calc(100vh - 68px)" : "auto", // 28px topbar + 40px title bar
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {WindowComponent ? (
                      id === "terminal" || id === "resume" || id === "safari" || id === "experience" || id === "skills" || id === "widgets" ? (
                        <WindowComponent
                          theme={theme}
                          portfolioId={portfolioId}
                        />
                      ) : (
                        <WindowComponent
                          currentPortTheme={currentPortTheme}
                          customCSS={customCSS}
                          portfolioId={portfolioId}
                          theme={theme}
                          font={font}
                        />
                      )
                    ) : (
                      <div className={`p-8 text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        <p>Content not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Improved macOS Dock Container */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
        {/* Dock */}
        <div
          className={`flex items-center h-16 gap-3 px-4 border backdrop-blur-2xl rounded-2xl shadow-2xl ${isDark
            ? "bg-black/30 border-white/10"
            : "bg-white/40 border-gray-300/20"
            }`}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(null)}
        >
          {/* Dock Items */}
          {visibleDockItems.map((item: any) => (
            <DockIcon
              key={item.id}
              item={item}
              isActive={windows[item.id]?.isOpen && !windows[item.id]?.isMinimized}
              onClick={() => {
                if (windows[item.id]?.isOpen) {
                  if (windows[item.id]?.isMinimized) {
                    restoreWindow(item.id);
                  } else {
                    bringToFront(item.id);
                  }
                } else {
                  openWindow(item.id);
                }
              }}
              mouseX={mouseX}
            />
          ))}{/* Close All Button */}
          <AnimatePresence>
            {hasOpenWindows && (
              <motion.div
                initial={{ width: 0, opacity: 0, scale: 0 }}
                animate={{ width: "auto", opacity: 1, scale: 1 }}
                exit={{ width: 0, opacity: 0, scale: 0 }}
                className="flex items-center ml-2 pl-2 border-l border-white/10"
              >
                <motion.button
                  onClick={closeAllWindows}
                  className={`
                    group relative flex items-center justify-center
                    w-12 h-12 rounded-xl
                    transition-all duration-300
                    hover:scale-110 active:scale-95
                    ${isDark ? "bg-red-500/20 hover:bg-red-500/30" : "bg-red-500/10 hover:bg-red-500/20"}
                  `}
                  title="Close All Windows"
                  whileHover={{ y: -5 }}
                >
                  <X size={20} className={isDark ? "text-red-400" : "text-red-600"} />

                  {/* Tooltip */}
                  <span className={`
                    absolute -top-10 left-1/2 -translate-x-1/2
                    px-2 py-1 rounded text-xs font-medium
                    opacity-0 group-hover:opacity-100 transition-opacity
                    pointer-events-none whitespace-nowrap
                    ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow-lg"}
                  `}>
                    Close All
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div >
  );
};



function DesktopIcons({ userInfoData, openWindow, isDark }: any) {
  return (
    <div className="flex flex-col gap-6 p-6 items-start">
      {/* GitHub Link */}
      {userInfoData.socialLinks?.github && (
        <a
          href={userInfoData.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 w-20"
        >
          <div className={`
            w-16 h-16 rounded-xl flex items-center justify-center
            ${isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-gray-100 border-gray-200"}
            border backdrop-blur-sm transition-all duration-200
            group-hover:bg-gray-700/50 group-active:scale-95
          `}>
            <Github size={32} className={isDark ? "text-white" : "text-gray-900"} />
          </div>
          <span className={`
            text-xs font-medium px-2 py-1 rounded
            ${isDark ? "text-white drop-shadow-md" : "text-gray-800"}
            group-hover:bg-white/20
          `}>
            GitHub
          </span>
        </a>
      )}

      {/* LinkedIn Link */}
      {userInfoData.socialLinks?.linkedin && (
        <a
          href={userInfoData.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 w-20"
        >
          <div className={`
            w-16 h-16 rounded-xl flex items-center justify-center
            ${isDark ? "bg-blue-600/20 border-blue-500/30" : "bg-blue-50 border-blue-200"}
            border backdrop-blur-sm transition-all duration-200
            group-hover:bg-blue-600/30 group-active:scale-95
          `}>
            <Linkedin size={32} className={isDark ? "text-blue-400" : "text-blue-700"} />
          </div>
          <span className={`
            text-xs font-medium px-2 py-1 rounded
            ${isDark ? "text-white drop-shadow-md" : "text-gray-800"}
            group-hover:bg-white/20
          `}>
            LinkedIn
          </span>
        </a>
      )}
    </div>
  );
}

// Sub-component for individual Dock Icons to handle spring physics
function DockIcon({
  item,
  mouseX,
  isActive,
  onClick,
}: {
  item: any;
  mouseX: MotionValue<number | null>;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: any) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val !== null ? val - bounds.x - bounds.width / 2 : Infinity;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square relative flex items-center justify-center cursor-pointer group"
      onClick={onClick}
    >
      {/* Tooltip */}
      <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm border border-white/10">
        {item.label}
      </span>

      {/* Icon Container */}
      <div className="w-full h-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
        {typeof item.icon === "string" || (typeof item.icon === "object" && item.icon.src) ? (
          <img
            src={typeof item.icon === "string" ? item.icon : item.icon.src}
            alt={item.label}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        ) : (
          <item.icon className="w-3/4 h-3/4 text-white drop-shadow-lg" />
        )}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-white/80 shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
      )}
    </motion.div>
  );
}

export default Desktop;
