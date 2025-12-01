"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Save, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePortfolioData } from "@/slices/dataSlice";
import { updateSection } from "@/app/actions/portfolio";

interface WallpaperVisualEditorProps {
    initialWallpaper?: string;
    onClose?: () => void;
    portfolioId?: string;
    theme?: string;
}

const defaultWallpapers = [
    "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Dawn-thumb.jpeg",
    "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Night-thumb.jpeg",
    "https://512pixels.net/downloads/macos-wallpapers-6k/15-Sequoia-Sunrise.png",
    "https://512pixels.net/wp-content/uploads/2025/06/11-0-Day-thumbnail.jpg"
];

const WallpaperVisualEditor: React.FC<WallpaperVisualEditorProps> = ({
    initialWallpaper,
    onClose,
    portfolioId,
    theme,
}) => {
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const heroData = portfolioData?.find((item: any) => item.type === "hero")?.data || {};
    const currentWallpaper = heroData.image || defaultWallpapers[0];

    const [wallpaperUrl, setWallpaperUrl] = useState(initialWallpaper || currentWallpaper);
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
        );

        try {
            setIsUploading(true);
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setWallpaperUrl(data.secure_url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            toast.loading("Saving wallpaper...", { id: "saveWallpaper" });

            // Update Redux
            dispatch(
                updatePortfolioData({
                    sectionType: "hero",
                    newData: { image: wallpaperUrl },
                    sectionTitle: "",
                    sectionDescription: "",
                })
            );

            // Update Database
            if (portfolioId) {
                const result = await updateSection({
                    portfolioId,
                    sectionName: "hero",
                    sectionContent: { image: wallpaperUrl },
                    sectionTitle: "",
                    sectionDescription: "",
                });

                if (result.success) {
                    toast.success("Wallpaper updated!", { id: "saveWallpaper" });
                    onClose?.(); // Close the window after saving
                } else {
                    throw new Error("Failed to save to database");
                }
            } else {
                toast.success("Wallpaper updated (Local Only)!", { id: "saveWallpaper" });
                onClose?.();
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save wallpaper", { id: "saveWallpaper" });
        }
    };

    const isDark = theme === "dark";

    return (
        <div className={`w-full h-full flex flex-col ${isDark ? "bg-[#1a1a1a] text-gray-200" : "bg-white text-gray-800"}`}>
            {/* Creator Visibility Notice */}
            <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center text-center">
                Only visible to you (Creator)
            </div>

            {/* Content */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Preview */}
                <div className="space-y-2">
                    <label
                        className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                    >
                        Preview
                    </label>
                    <div
                        className={`relative h-48 w-full rounded-lg overflow-hidden border-2 border-dashed ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
                            }`}
                    >
                        {wallpaperUrl ? (
                            <img
                                src={wallpaperUrl}
                                alt="Wallpaper Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <ImageIcon size={32} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Default Wallpapers */}
                <div className="space-y-2">
                    <label
                        className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                    >
                        Default Options
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {defaultWallpapers.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setWallpaperUrl(url)}
                                className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all ${wallpaperUrl === url
                                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                    : isDark ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <img
                                    src={url}
                                    alt={`Default ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                    <label
                        className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                    >
                        Image URL
                    </label>
                    <input
                        type="text"
                        value={wallpaperUrl}
                        onChange={(e) => setWallpaperUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className={`w-full px-3 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${isDark
                            ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-700 placeholder-gray-400"
                            }`}
                    />
                </div>

                {/* Upload Button */}
                <div className="relative pt-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                    />
                    <button
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${isDark
                            ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {isUploading ? (
                            <span className="animate-pulse">Uploading...</span>
                        ) : (
                            <>
                                <Upload size={16} />
                                Upload New Image
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div
                className={`px-6 py-4 border-t flex justify-between items-center mt-auto ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                    }`}
            >
                <button
                    onClick={() => setWallpaperUrl(initialWallpaper)}
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

export default WallpaperVisualEditor;
