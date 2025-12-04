"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { ColorTheme } from "@/lib/colorThemes";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label = "Image",
    className
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files[0]) return;

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
        );

        try {
            setIsUploading(true);
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onChange(data.secure_url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="text-sm font-medium" style={{ color: ColorTheme.textPrimary }}>
                {label}
            </Label>

            <div className="mt-1 flex flex-col items-center">
                {value ? (
                    <div className="relative w-full group">
                        <div className="relative w-full h-48 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                            <img
                                src={value}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <label className="w-full cursor-pointer group">
                        <div
                            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
                            style={{
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textSecondary
                            }}
                        >
                            {isUploading ? (
                                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                            ) : (
                                <>
                                    <Cloud className="h-10 w-10 mb-3 group-hover:text-emerald-500 transition-colors" />
                                    <p className="text-sm font-medium group-hover:text-emerald-500 transition-colors">
                                        Click to upload image
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                        </div>
                    </label>
                )}
            </div>

            {!value && (
                <div className="mt-2">
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            value={value || ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Or paste image URL"
                            className="pl-9"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
