"use client";

import React, { useState } from "react";
import { X, Save, RotateCcw, Layout, Type, Clock, Calendar, MessageSquare, Monitor } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePortfolioData } from "@/slices/dataSlice";
import { updateSection } from "@/app/actions/portfolio";

interface DesktopWidgetVisualEditorProps {
    onClose?: () => void;
    portfolioId?: string;
    theme?: string;
}

const DesktopWidgetVisualEditor: React.FC<DesktopWidgetVisualEditorProps> = ({
    onClose,
    portfolioId,
    theme,
}) => {
    const dispatch = useDispatch();
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const widgetData = portfolioData?.find((item: any) => item.type === "desktopWidget")?.data || {
        isVisible: true,
        showTime: true,
        showDate: true,
        showGreeting: true,
        position: "top-right",
        style: "modern",
        customGreeting: "",
    };

    const [config, setConfig] = useState(widgetData);

    const handleSave = async () => {
        try {
            toast.loading("Saving widget settings...", { id: "saveWidget" });

            // Update Redux
            dispatch(
                updatePortfolioData({
                    sectionType: "desktopWidget",
                    newData: config,
                    sectionTitle: "Desktop Widget",
                    sectionDescription: "Customizable desktop clock and greeting",
                })
            );

            // Update Database
            if (portfolioId) {
                const result = await updateSection({
                    portfolioId,
                    sectionName: "desktopWidget",
                    sectionContent: config,
                    sectionTitle: "Desktop Widget",
                    sectionDescription: "Customizable desktop clock and greeting",
                });

                if (result.success) {
                    toast.success("Widget settings saved!", { id: "saveWidget" });
                    onClose?.();
                } else {
                    throw new Error("Failed to save to database");
                }
            } else {
                toast.success("Widget settings saved (Local Only)!", { id: "saveWidget" });
                onClose?.();
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save widget settings", { id: "saveWidget" });
        }
    };

    const isDark = theme === "dark";

    const updateConfig = (key: string, value: any) => {
        const newConfig = { ...config, [key]: value };
        setConfig(newConfig);

        // Live Preview: Update Redux immediately
        dispatch(
            updatePortfolioData({
                sectionType: "desktopWidget",
                newData: newConfig,
                sectionTitle: "Desktop Widget",
                sectionDescription: "Customizable desktop clock and greeting",
            })
        );
    };

    return (
        <div className={`w-full h-full flex flex-col ${isDark ? "bg-[#1a1a1a] text-gray-200" : "bg-white text-gray-800"}`}>
            {/* Creator Visibility Notice */}
            <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center text-center">
                Only visible to you (Creator)
            </div>

            {/* Content */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto custom-scrollbar">

                {/* Visibility Toggle */}
                <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Monitor className={isDark ? "text-emerald-400" : "text-emerald-600"} size={20} />
                            <div>
                                <h3 className="font-medium">Show Widget</h3>
                                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Display time and date on desktop</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={config.isVisible}
                                onChange={(e) => updateConfig("isVisible", e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>

                {/* Position Selection */}
                <div className="space-y-3">
                    <label className={`text-xs font-medium uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <Layout size={14} /> Position
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {["top-left", "center", "top-right", "bottom-left", "center-bottom", "bottom-right"].map((pos) => {
                            if (pos === "center-bottom") return <div key={pos} />; // Spacer
                            return (
                                <button
                                    key={pos}
                                    onClick={() => updateConfig("position", pos)}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${config.position === pos
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                                        : isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {pos.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Style Selection */}
                <div className="space-y-3">
                    <label className={`text-xs font-medium uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <Type size={14} /> Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {["modern", "classic", "minimal", "glass", "neumorphic"].map((style) => (
                            <button
                                key={style}
                                onClick={() => updateConfig("style", style)}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${config.style === style
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                                    : isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Toggles */}
                <div className="space-y-3">
                    <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Content
                    </label>
                    <div className={`rounded-xl border divide-y ${isDark ? "border-gray-700 divide-gray-700 bg-gray-800/30" : "border-gray-200 divide-gray-200 bg-gray-50/50"}`}>
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <Clock size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
                                <span className="text-sm">Show Time</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.showTime}
                                onChange={(e) => updateConfig("showTime", e.target.checked)}
                                className="accent-emerald-500 w-4 h-4"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
                                <span className="text-sm">Show Date</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.showDate}
                                onChange={(e) => updateConfig("showDate", e.target.checked)}
                                className="accent-emerald-500 w-4 h-4"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
                                <span className="text-sm">Show Greeting</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.showGreeting}
                                onChange={(e) => updateConfig("showGreeting", e.target.checked)}
                                className="accent-emerald-500 w-4 h-4"
                            />
                        </div>
                    </div>
                </div>

                {/* Custom Greeting */}
                {config.showGreeting && (
                    <div className="space-y-2">
                        <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            Custom Greeting (Optional)
                        </label>
                        <input
                            type="text"
                            value={config.customGreeting}
                            onChange={(e) => updateConfig("customGreeting", e.target.value)}
                            placeholder="Leave empty for dynamic greeting"
                            className={`w-full px-3 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${isDark
                                ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                                : "bg-white border-gray-300 text-gray-700 placeholder-gray-400"
                                }`}
                        />
                    </div>
                )}

            </div>

            {/* Footer */}
            <div
                className={`px-6 py-4 border-t flex justify-between items-center mt-auto ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                    }`}
            >
                <button
                    onClick={() => setConfig(widgetData)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isDark
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <RotateCcw size={14} />
                    Reset
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                        style={{
                            background: "linear-gradient(135deg, #10b981, #059669)",
                        }}
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesktopWidgetVisualEditor;
