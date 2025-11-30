import { useState, useEffect } from "react";
import { useMotionValue } from "framer-motion";

export interface WindowState {
    id: string;
    isOpen: boolean;
    isMinimized: boolean;
    isFullscreen: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
}

export const useDesktopEnvironment = (initialWindows: Record<string, WindowState>) => {
    const [windows, setWindows] = useState<Record<string, WindowState>>(initialWindows);
    const [nextZIndex, setNextZIndex] = useState(2);
    const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Physics Dock Mouse Value
    const mouseX = useMotionValue<number | null>(null);

    const openWindow = (id: string) => {
        setWindows((prev) => {
            const window = prev[id];
            if (!window) return prev;

            return {
                ...prev,
                [id]: {
                    ...window,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: nextZIndex,
                },
            };
        });
        setNextZIndex((prev) => prev + 1);
    };

    const closeWindow = (id: string) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isOpen: false, isMinimized: false },
        }));
    };

    const minimizeWindow = (id: string) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: true },
        }));
    };

    const restoreWindow = (id: string) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: false, zIndex: nextZIndex },
        }));
        setNextZIndex((prev) => prev + 1);
    };

    const toggleFullscreen = (id: string) => {
        setWindows((prev) => {
            const window = prev[id];
            if (!window) return prev;

            if (window.isFullscreen) {
                // Restore to previous size
                return {
                    ...prev,
                    [id]: {
                        ...window,
                        isFullscreen: false,
                        zIndex: nextZIndex,
                    },
                };
            } else {
                // Save current size and go fullscreen
                // Use a very high z-index for fullscreen windows (higher than topbar z-50)
                return {
                    ...prev,
                    [id]: {
                        ...window,
                        isFullscreen: true,
                        zIndex: 1000, // Higher than topbar's z-50
                    },
                };
            }
        });
        setNextZIndex((prev) => prev + 1);
    };

    const bringToFront = (id: string) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], zIndex: nextZIndex },
        }));
        setNextZIndex((prev) => prev + 1);
    };

    const closeAllWindows = () => {
        setWindows((prev) => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach((key) => {
                newWindows[key] = {
                    ...newWindows[key],
                    isOpen: false,
                    isMinimized: false,
                    isFullscreen: false,
                };
            });
            return newWindows;
        });
    };

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        bringToFront(id);
        setDraggingWindow(id);
        const window = windows[id];
        if (window) {
            setDragOffset({
                x: e.clientX - window.position.x,
                y: e.clientY - window.position.y,
            });
        }
    };

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
            newY = Math.max(topBarHeight - win.size.height + minVisibleHeight, Math.min(newY, maxY));

            setWindows((prev) => ({
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

    return {
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
    };
};
