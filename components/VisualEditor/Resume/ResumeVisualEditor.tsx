"use client";

import React, { useState } from "react";
import { X, Upload, FileText, RotateCcw } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { ColorTheme } from "@/lib/colorThemes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { updateSection } from "@/app/actions/portfolio";
import { useDispatch } from "react-redux";
import { updatePortfolioData } from "@/slices/dataSlice";

interface ResumeVisualEditorProps {
    isOpen: boolean;
    onClose: () => void;
    resumeLink: string;
    portfolioId: string;
    primaryColor?: string;
    primaryDarkColor?: string;
}

export const ResumeVisualEditor: React.FC<ResumeVisualEditorProps> = ({
    isOpen,
    onClose,
    resumeLink: initialResumeLink,
    portfolioId,
    primaryColor = ColorTheme.primary,
    primaryDarkColor = ColorTheme.primaryDark,
}) => {
    const dispatch = useDispatch();
    const { dragRef, isDragging, position: windowPosition, handleMouseDown } = useDraggable({
        x: 100,
        y: 100,
    });

    const [resumeLink, setResumeLink] = useState(initialResumeLink);
    const [isUploading, setIsUploading] = useState(false);

    const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files[0]) return;

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string);

        try {
            setIsUploading(true);
            toast.loading("Uploading resume...", { id: "resumeUpload" });

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
            setResumeLink(data.secure_url);
            toast.success("Resume uploaded successfully!", { id: "resumeUpload" });
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload resume", { id: "resumeUpload" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            toast.loading("Saving changes...", { id: "saveResume" });

            // Update Redux
            dispatch(updatePortfolioData({
                sectionType: "resume",
                newData: { resumeLink },
                sectionTitle: "",
                sectionDescription: "",
            }));

            // Update Database
            const result = await updateSection({
                portfolioId,
                sectionName: "resume",
                sectionContent: { resumeLink },
                sectionTitle: "",
                sectionDescription: "",
            });

            if (result.success) {
                toast.success("Resume updated successfully!", { id: "saveResume" });
                onClose();
            } else {
                throw new Error("Failed to save to database");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save changes", { id: "saveResume" });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                ref={dragRef}
                className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-96 overflow-hidden"
                style={{
                    left: `${windowPosition.x}px`,
                    top: `${windowPosition.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800"
                    onMouseDown={handleMouseDown}
                >
                    <h3 className="text-lg font-bold text-white">Edit Resume</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Label className="text-white">Upload Resume (PDF)</Label>

                        {resumeLink ? (
                            <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                                <FileText className="text-blue-400 h-8 w-8" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">Resume.pdf</p>
                                    <p className="text-xs text-gray-400 truncate">{resumeLink}</p>
                                </div>
                                <button
                                    onClick={() => setResumeLink("")}
                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-400">
                                        <span className="font-semibold">Click to upload</span>
                                    </p>
                                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleResumeUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Or paste URL</Label>
                        <Input
                            value={resumeLink}
                            onChange={(e) => setResumeLink(e.target.value)}
                            placeholder="https://example.com/resume.pdf"
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-700 p-4 bg-zinc-800">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setResumeLink(initialResumeLink)}
                            className="flex items-center gap-1 flex-1 py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors justify-center"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isUploading}
                            className="flex-1 py-2 px-3 text-sm text-white rounded transition-colors font-medium"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})`,
                                opacity: isUploading ? 0.7 : 1,
                            }}
                        >
                            {isUploading ? "Uploading..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={onClose}
            />
        </>
    );
};
