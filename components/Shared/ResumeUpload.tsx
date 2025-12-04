"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud, X, Loader2, FileText, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { ColorTheme } from "@/lib/colorThemes";

interface ResumeUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
    value,
    onChange,
    label = "Resume",
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
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
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
            toast.success("Resume uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload resume");
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

            <div className="mt-1">
                {value ? (
                    <div className="relative w-full">
                        <div
                            className="flex items-center justify-between w-full p-3 rounded-md border border-zinc-200 dark:border-zinc-800"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                            }}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 rounded bg-emerald-500/10 text-emerald-500">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate" style={{ color: ColorTheme.textPrimary }}>
                                        Resume Uploaded
                                    </span>
                                    <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-zinc-500 hover:text-emerald-500 truncate hover:underline"
                                    >
                                        View File
                                    </a>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label className="w-full cursor-pointer group">
                        <div
                            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-32 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
                            style={{
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textSecondary
                            }}
                        >
                            {isUploading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                            ) : (
                                <>
                                    <Cloud className="h-8 w-8 mb-2 group-hover:text-emerald-500 transition-colors" />
                                    <p className="text-sm font-medium group-hover:text-emerald-500 transition-colors">
                                        Upload Resume
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        PDF up to 10MB
                                    </p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="application/pdf"
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
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            value={value || ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Or paste resume URL"
                            className="pl-9"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary
                            }}
                        />
                    </div>
                    <p className="text-xs mt-1.5 text-zinc-500">
                        Link to your resume (PDF recommended)
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
