"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Save, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updatePortfolioData } from "@/slices/dataSlice";
import { updateSection } from "@/app/actions/portfolio";

interface WallpaperVisualEditorProps {
    initialWallpaper: string;
    onClose: () => void;
    portfolioId: string;
    currentTheme: string;
}

const WallpaperVisualEditor: React.FC<WallpaperVisualEditorProps> = ({
    initialWallpaper,
    onClose,
    portfolioId,
    currentTheme,
}) => {
    const [wallpaperUrl, setWallpaperUrl] = useState(initialWallpaper);
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();
    const { position, dragRef, handleMouseDown } = useDraggable({
        x: window.innerWidth / 2 - 200,
        y: window.innerHeight / 2 - 150,
    });

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
            const result = await updateSection({
                portfolioId,
                sectionName: "hero",
                sectionContent: { image: wallpaperUrl },
                sectionTitle: "",
                sectionDescription: "",
            });

            if (result.success) {
                toast.success("Wallpaper updated!", { id: "saveWallpaper" });
                onClose();
            } else {
                throw new Error("Failed to save to database");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save wallpaper", { id: "saveWallpaper" });
        }
    };

    const isDark = currentTheme === "dark";

    return (
        <div
            ref={dragRef}
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                zIndex: 50,
            }}
            className={`w-[400px] rounded-xl shadow-2xl overflow-hidden border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                }`}
        >
            {/* Header */}
            <div
                onMouseDown={handleMouseDown}
                className={`px-4 py-3 flex items-center justify-between cursor-move select-none border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                    }`}
            >
                <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-emerald-500" />
                    <span
                        className={`font-medium text-sm ${isDark ? "text-gray-200" : "text-gray-700"
                            }`}
                    >
                        Edit Wallpaper
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className={`p-1 rounded-md transition-colors ${isDark
                        ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                        : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Preview */}
                <div className="space-y-2">
                    <label
                        className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                    >
                        Preview
                    </label>
                    <div
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 border-dashed ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
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
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                className={`px-6 py-4 border-t flex justify-between items-center ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
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
