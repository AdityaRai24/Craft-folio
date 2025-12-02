"use client";

import React, { useState } from "react";
import { Upload, Save, RotateCcw, Image as ImageIcon, Sliders } from "lucide-react";
import toast from "react-hot-toast";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultWindowsHeroStyles } from "@/types/windows/hero";

interface WallpaperVisualEditorProps {
    initialWallpaper?: string;
    onClose?: () => void;
    portfolioId?: string;
    theme?: string;
}

const defaultWallpapers = [
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1764656024/wp6016634-windows-10-dark-wallpapers_wm6k98.jpg",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1764655975/6708614_cb0sk9.jpg",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1764655987/image_x96ado.jpg",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1764656047/wp8971714-desk-setup-wallpapers_xwbas0.jpg",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1764656052/wp11368618-dark-mode-pc-wallpapers_rdudr0.jpg"
];

const WallpaperVisualEditor: React.FC<WallpaperVisualEditorProps> = ({
    onClose,
    portfolioId,
    theme,
}) => {
    const {
        customization,
        updateDraftCustomization,
        saveDraftCustomization,
        resetCustomization,
        draftCustomization,
        openVisualEditor
    } = useCustomization("hero", defaultWindowsHeroStyles, portfolioId || "");

    React.useEffect(() => {
        openVisualEditor();
    }, []);

    const [isUploading, setIsUploading] = useState(false);

    // Use draft customization for live preview if available, otherwise fall back to saved customization
    const currentStyles = draftCustomization || customization;

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
            updateDraftCustomization("image", data.secure_url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        await saveDraftCustomization();
        onClose?.();
    };

    const isDark = theme === "dark";

    return (
        <div className={`w-full h-full flex flex-col ${isDark ? "bg-[#1a1a1a] text-gray-200" : "bg-white text-gray-800"}`}>
            {/* Creator Visibility Notice */}
            <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center text-center">
                Only visible to you (Creator)
            </div>

            {/* Content */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto custom-scrollbar">
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
                        {currentStyles.image ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={currentStyles.image}
                                    alt="Wallpaper Preview"
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: `blur(${currentStyles.blur}px) grayscale(${currentStyles.grayscale}%) brightness(${currentStyles.brightness}%)`
                                    }}
                                />
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundColor: `rgba(0,0,0,${currentStyles.overlayOpacity / 100})`
                                    }}
                                />
                            </div>
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
                    <div className="grid grid-cols-3 gap-2">
                        {defaultWallpapers.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => updateDraftCustomization("image", url)}
                                className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all ${currentStyles.image === url
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
                        value={currentStyles.image}
                        onChange={(e) => updateDraftCustomization("image", e.target.value)}
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

                {/* Adjustments */}
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label
                        className={`text-xs font-medium uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                    >
                        <Sliders size={14} /> Adjustments
                    </label>

                    {/* Overlay Opacity */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Overlay Opacity</span>
                            <span className={isDark ? "text-gray-500" : "text-gray-400"}>{currentStyles.overlayOpacity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="90"
                            value={currentStyles.overlayOpacity}
                            onChange={(e) => updateDraftCustomization("overlayOpacity", parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Blur */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Blur</span>
                            <span className={isDark ? "text-gray-500" : "text-gray-400"}>{currentStyles.blur}px</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={currentStyles.blur}
                            onChange={(e) => updateDraftCustomization("blur", parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Grayscale */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Grayscale</span>
                            <span className={isDark ? "text-gray-500" : "text-gray-400"}>{currentStyles.grayscale}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentStyles.grayscale}
                            onChange={(e) => updateDraftCustomization("grayscale", parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Brightness */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Brightness</span>
                            <span className={isDark ? "text-gray-500" : "text-gray-400"}>{currentStyles.brightness}%</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="150"
                            value={currentStyles.brightness}
                            onChange={(e) => updateDraftCustomization("brightness", parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                className={`px-6 py-4 border-t flex justify-between items-center mt-auto ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                    }`}
            >
                <button
                    onClick={resetCustomization}
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
