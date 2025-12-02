"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AnimatePresence } from "framer-motion";
import { WindowsThemeProvider, useWindowsTheme } from "./ThemeContext";
import Window from "./Window";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";

import DesktopWidget from "./DesktopWidget";
import DesktopWidgetVisualEditor from "./DesktopWidgetVisualEditor";

// Use Windows-specific components
import ProjectsGrid from "./Projects";
import ExperienceWindow from "./Experience";
import Technologies from "./Technologies";
import TerminalWindow from "./Terminal";
import ResumeViewer from "./Resume";
import Contact from "./Contact";
import ChromeBrowser from "./ChromeBrowser";
import Notes from "./Notes";
import WallpaperVisualEditor from "./WallpaperVisualEditor";

import { useDesktopEnvironment, WindowState } from "@/hooks/useDesktopEnvironment";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultWindowsHeroStyles } from "@/types/windows/hero";
import { defaultWindowsWidgetStyles } from "@/types/windows/widget";

// Import Icons from MacOS folder (or use URLs if preferred, but importing ensures consistency)
import Preview from "@/components/MacOS/icons/preview.svg";
import Terminal from "@/components/MacOS/icons/terminal.svg";
import ContactIcon from "@/components/MacOS/icons/contact.svg";
import CodeIcon from "@/components/MacOS/icons/code.svg";
import WallpaperIcon from "@/components/MacOS/icons/wallpaper.svg";
import WidgetIcon from "@/components/MacOS/icons/widget.svg";
import SkillsIcon from "@/components/MacOS/icons/skills.svg";
import ChromeIcon from "@/components/Windows/icons/chrome.png";
import NotesIcon from "@/components/Windows/icons/notes.svg";

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
    return (
        <WindowsThemeProvider currentPortTheme={currentPortTheme}>
            <DesktopContent
                currentPortTheme={currentPortTheme}
                customCSS={customCSS}
                portfolioId={portfolioId}
                font={font}
            />
        </WindowsThemeProvider>
    );
};

function DesktopContent({
    currentPortTheme,
    customCSS,
    portfolioId,
    font,
}: any) {
    const { theme } = useWindowsTheme();
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const userInfoData = portfolioData?.find((item: any) => item.type === "userInfo")?.data || {};

    const { effectiveCustomization: heroCustomization } = useCustomization(
        "hero",
        defaultWindowsHeroStyles,
        portfolioId || ""
    );

    const [isStartOpen, setIsStartOpen] = useState(false);
    const [brightness, setBrightness] = useState(100);

    const {
        effectiveCustomization: widgetCustomization,
        draftCustomization: widgetDraft,
        updateDraftCustomization: updateWidgetDraft,
        saveDraftCustomization: saveWidgetDraft,
        resetCustomization: resetWidget,
        setDraftCustomization: setWidgetDraft
    } = useCustomization(
        "windowsWidget",
        defaultWindowsWidgetStyles,
        portfolioId || ""
    );



    const currentWidgetStyles = widgetDraft || widgetCustomization;

    // Initial Windows State
    const initialWindows: Record<string, WindowState> = {
        projects: {
            id: "projects",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 100, y: 50 },
            size: { width: 900, height: 600 },
        },
        experience: {
            id: "experience",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 150, y: 80 },
            size: { width: 900, height: 650 },
        },
        skills: {
            id: "skills",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 200, y: 110 },
            size: { width: 800, height: 600 },
        },
        contact: {
            id: "contact",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 250, y: 140 },
            size: { width: 700, height: 500 },
        },
        chrome: {
            id: "chrome",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 300, y: 170 },
            size: { width: 1000, height: 700 },
        },
        notes: {
            id: "notes",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 350, y: 200 },
            size: { width: 800, height: 600 },
        },
        terminal: {
            id: "terminal",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 350, y: 200 },
            size: { width: 700, height: 500 },
        },
        resume: {
            id: "resume",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 400, y: 230 },
            size: { width: 800, height: 800 },
        },
        wallpaper: {
            id: "wallpaper",
            isOpen: false,
            isMinimized: false,
            isFullscreen: false,
            zIndex: 0,
            position: { x: 450, y: 260 },
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

    // Dock/Taskbar Configuration with Image Icons
    const dockConfig: Record<string, any> = {
        projects: { id: "projects", icon: CodeIcon, label: "Projects", component: ProjectsGrid },
        experience: { id: "experience", icon: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png", label: "Experience", component: ExperienceWindow },
        skills: { id: "skills", icon: SkillsIcon, label: "Skills", component: Technologies },
        contact: { id: "contact", icon: ContactIcon, label: "Contact", component: Contact },
        chrome: { id: "chrome", icon: ChromeIcon, label: "Chrome", component: ChromeBrowser },
        notes: { id: "notes", icon: NotesIcon, label: "Notes", component: Notes },
        terminal: { id: "terminal", icon: Terminal, label: "Terminal", component: TerminalWindow },
        resume: { id: "resume", icon: Preview, label: "Resume", component: ResumeViewer },
        wallpaper: { id: "wallpaper", icon: WallpaperIcon, label: "Wallpaper", component: WallpaperVisualEditor },
        widgets: { id: "widgets", icon: WidgetIcon, label: "Widgets", component: DesktopWidgetVisualEditor },
    };

    const {
        windows,
        setWindows,
        draggingWindow,
        setDraggingWindow,
        dragOffset,
        setDragOffset,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        toggleFullscreen,
        bringToFront,
        handleMouseDown,
    } = useDesktopEnvironment(initialWindows);

    // Sync draft state with window open/close
    useEffect(() => {
        if (windows["widgets"]?.isOpen) {
            setWidgetDraft(widgetCustomization);
        } else {
            setWidgetDraft(null);
        }
    }, [windows["widgets"]?.isOpen]);

    // Filter dock items based on portfolio data + system apps
    const getOrderedDockItems = () => {
        const items: any[] = [];
        // Always include system apps
        ["projects", "experience", "skills", "chrome", "notes", "contact", "terminal", "resume", "wallpaper", "widgets"].forEach(id => {
            if (dockConfig[id]) items.push(dockConfig[id]);
        });
        return items;
    };

    const dockItems = getOrderedDockItems();

    // Window Dragging Logic (reused from MacOS)
    const handleMouseMove = (e: MouseEvent) => {
        if (draggingWindow) {
            const win = windows[draggingWindow];
            if (!win) return;
            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;
            setWindows((prev: any) => ({
                ...prev,
                [draggingWindow]: {
                    ...prev[draggingWindow],
                    position: { x: newX, y: newY },
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

    const backgroundImage = heroCustomization.image || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80";

    const handleAppClick = (id: string) => {


        if (windows[id]?.isOpen) {
            if (windows[id]?.isMinimized) restoreWindow(id);
            else bringToFront(id);
        } else {
            openWindow(id);
        }
    };

    return (
        <div className={`fixed inset-0 overflow-hidden ${font || ""}`}>
            {/* Brightness Overlay */}
            <div
                className="fixed inset-0 z-[9999] pointer-events-none bg-black transition-opacity duration-300"
                style={{ opacity: (100 - brightness) / 100 * 0.8 }}
            />

            {/* Wallpaper */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    filter: `blur(${heroCustomization.blur}px) grayscale(${heroCustomization.grayscale}%) brightness(${heroCustomization.brightness}%)`,
                }}
            />

            {/* Desktop Widget */}
            <DesktopWidget
                isVisible={currentWidgetStyles.isVisible}
                showTime={currentWidgetStyles.showTime}
                showDate={currentWidgetStyles.showDate}
                showGreeting={currentWidgetStyles.showGreeting}
                position={currentWidgetStyles.position}
                style={currentWidgetStyles.style}
                customGreeting={currentWidgetStyles.customGreeting}
                isDark={theme === "dark"}
            />



            {/* Windows Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <AnimatePresence>
                    {Object.entries(windows).map(([id, winState]) => {
                        const win = winState as WindowState;
                        const config = dockConfig[id];
                        const Component = config?.component;

                        if (!win.isOpen) return null;

                        return (
                            <div key={id} className="pointer-events-auto">
                                <Window
                                    id={id}
                                    title={config?.label || id}
                                    isOpen={win.isOpen}
                                    isMinimized={win.isMinimized}
                                    isFullscreen={win.isFullscreen}
                                    zIndex={win.zIndex}
                                    position={win.position}
                                    size={win.size}
                                    onClose={() => closeWindow(id)}
                                    onMinimize={() => minimizeWindow(id)}
                                    onMaximize={() => toggleFullscreen(id)}
                                    onFocus={() => bringToFront(id)}
                                    onMove={(e) => handleMouseDown(e, id)}
                                >
                                    {Component && (
                                        id === "widgets" ? (
                                            <DesktopWidgetVisualEditor
                                                onClose={() => closeWindow(id)}
                                                portfolioId={portfolioId}
                                                theme={theme}
                                                // Pass draft controls
                                                currentStyles={currentWidgetStyles}
                                                onUpdate={updateWidgetDraft}
                                                onSave={saveWidgetDraft}
                                                onReset={resetWidget}
                                            />
                                        ) : (
                                            <Component
                                                portfolioId={portfolioId}
                                                currentPortTheme={currentPortTheme}
                                                customCSS={customCSS}
                                                theme={theme}
                                            />
                                        )
                                    )}
                                </Window>
                            </div>
                        );
                    })}
                </AnimatePresence>
            </div>



            {/* Start Menu */}
            <StartMenu
                isOpen={isStartOpen}
                onClose={() => setIsStartOpen(false)}
                dockItems={dockItems}
                onAppClick={handleAppClick}
            />

            {/* Taskbar */}
            <Taskbar
                dockItems={dockItems}
                windows={windows}
                onAppClick={handleAppClick}
                onStartClick={() => setIsStartOpen(!isStartOpen)}
                isStartOpen={isStartOpen}
                brightness={brightness}
                setBrightness={setBrightness}
            />
        </div>
    );
}

export default Desktop;
