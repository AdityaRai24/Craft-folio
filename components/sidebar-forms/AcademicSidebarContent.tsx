"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { updateSection } from "@/app/actions/portfolio";
import { redirect, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePortfolioData } from "@/slices/dataSlice";
import toast from "react-hot-toast";
import React from "react";
import { Cloud, X } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";

interface ContentType {
    // Hero Data
    name: string;
    title: string;
    summary: string;

    // User Info Data
    email: string;
    github: string;
    linkedin: string;
    resumeLink: string;
    profileImage: string;
}

const AcademicSidebarContent = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const portfolioId = params.portfolioId as string;
    const { portfolioData } = useSelector((state: RootState) => state.data);

    // Get Hero Data
    const heroSectionData = portfolioData?.find(
        (section: any) => section.type === "hero"
    );
    const heroData = heroSectionData?.data || {};

    // Get User Info Data
    const contactSectionData = portfolioData?.find(
        (section: any) => section.type === "userInfo"
    );
    const contactData = contactSectionData?.data || {};

    const emptyContent: ContentType = {
        name: "",
        title: "",
        summary: "",
        email: "",
        github: "",
        linkedin: "",
        resumeLink: "",
        profileImage: "",
    };

    const [content, setContent] = useState<ContentType>(emptyContent);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    useEffect(() => {
        if (portfolioData) {
            setContent({
                name: heroData.name || "",
                title: heroData.title || "",
                summary: heroData.summary || "",
                email: contactData.email || "",
                github: contactData.github || "",
                linkedin: contactData.linkedin || "",
                resumeLink: contactData.resumeLink || "",
                profileImage: contactData.profileImage || "",
            });
            setIsUploaded(!!contactData.resumeLink);
        }
    }, [portfolioData]);

    if (!portfolioId) {
        return redirect("/choose-templates");
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Prepare Hero Update
            const heroUpdate = {
                ...heroData,
                name: content.name,
                title: content.title,
                summary: content.summary,
            };

            // Prepare User Info Update
            const userInfoUpdate = {
                ...contactData,
                email: content.email,
                github: content.github,
                linkedin: content.linkedin,
                resumeLink: content.resumeLink,
                profileImage: content.profileImage,
            };

            // Dispatch Redux Updates
            dispatch(
                updatePortfolioData({
                    sectionType: "hero",
                    newData: heroUpdate,
                    sectionTitle: heroSectionData?.sectionTitle || "Hero",
                    sectionDescription: heroSectionData?.sectionDescription || "Hero section",
                })
            );
            dispatch(
                updatePortfolioData({
                    sectionType: "userInfo",
                    newData: userInfoUpdate,
                    sectionTitle: contactSectionData?.sectionTitle || "User Info",
                    sectionDescription: contactSectionData?.sectionDescription || "User information section",
                })
            );

            // Save to Database
            const heroResult = await updateSection({
                sectionName: "hero",
                portfolioId: portfolioId,
                sectionContent: heroUpdate,
                sectionTitle: heroSectionData?.sectionTitle || "Hero",
                sectionDescription: heroSectionData?.sectionDescription || "Hero section",
            });

            const userInfoResult = await updateSection({
                sectionName: "userInfo",
                portfolioId: portfolioId,
                sectionContent: userInfoUpdate,
                sectionTitle: contactSectionData?.sectionTitle || "User Info",
                sectionDescription: contactSectionData?.sectionDescription || "User information section",
            });

            if (!heroResult.success || !userInfoResult.success) {
                throw new Error("Database update failed");
            }

            toast.success("Information updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update information.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!event.target.files) return;
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
        );

        try {
            toast.loading("Uploading image...", { id: "imageUpload" });

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                toast.error("Upload failed", { id: "imageUpload" });
                return;
            }

            const data = await response.json();
            setContent({ ...content, profileImage: data.secure_url });
            toast.success("Image uploaded successfully!", { id: "imageUpload" });
        } catch (error) {
            toast.error("An error occurred during upload", { id: "imageUpload" });
            console.error("Upload error:", error);
        }
    };

    const handleResumeUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!event.target.files) return;
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
        );

        try {
            toast.loading("Uploading resume...", { id: "resumeUpload" });

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                toast.error("Upload failed", { id: "resumeUpload" });
                return;
            }

            const data = await response.json();
            setContent({ ...content, resumeLink: data.secure_url });
            setIsUploaded(true);
            toast.success("Resume uploaded successfully!", { id: "resumeUpload" });
        } catch (error) {
            toast.error("An error occurred during upload", { id: "resumeUpload" });
            console.error("Upload error:", error);
        }
    };

    const removeResume = () => {
        setContent({ ...content, resumeLink: "" });
        setIsUploaded(false);
    };

    return (
        <div className="flex-1 custom-scrollbar h-full">
            <Card
                className="min-h-screen rounded-none"
                style={{
                    backgroundColor: ColorTheme.bgMain,
                    borderColor: ColorTheme.borderLight,
                }}
            >
                <CardHeader>
                    <CardTitle style={{ color: ColorTheme.textPrimary }}>
                        Sidebar Content
                    </CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>
                        Manage your social links and resume.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Profile Image Upload */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="profileImage"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Profile Image
                        </Label>
                        <div className="flex items-center gap-4">
                            {content.profileImage && (
                                <img
                                    src={content.profileImage}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover border"
                                    style={{ borderColor: ColorTheme.borderLight }}
                                />
                            )}
                            <label className="cursor-pointer">
                                <div
                                    className="px-4 py-2 rounded-md text-sm font-medium transition-colors border"
                                    style={{
                                        backgroundColor: ColorTheme.bgCard,
                                        borderColor: ColorTheme.borderLight,
                                        color: ColorTheme.textPrimary,
                                    }}
                                >
                                    Upload Image
                                </div>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="title"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={content.title}
                            onChange={(e) =>
                                setContent({ ...content, title: e.target.value })
                            }
                            placeholder="PhD Candidate, Professor, etc."
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={content.email}
                            onChange={(e) =>
                                setContent({ ...content, email: e.target.value })
                            }
                            placeholder="Enter your email"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* GitHub Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="github"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            GitHub URL
                        </Label>
                        <Input
                            id="github"
                            value={content.github}
                            onChange={(e) =>
                                setContent({ ...content, github: e.target.value })
                            }
                            placeholder="https://github.com/..."
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* LinkedIn Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="linkedin"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            LinkedIn URL
                        </Label>
                        <Input
                            id="linkedin"
                            value={content.linkedin}
                            onChange={(e) =>
                                setContent({ ...content, linkedin: e.target.value })
                            }
                            placeholder="https://linkedin.com/in/..."
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="resumeUpload"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Resume
                        </Label>
                        <div className="mt-1 flex flex-col items-center">
                            {content.resumeLink ? (
                                <div className="relative w-full">
                                    <div
                                        className="flex items-center justify-between w-full p-3 rounded-md"
                                        style={{
                                            backgroundColor: ColorTheme.bgCard,
                                            borderColor: ColorTheme.borderLight,
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <span
                                                style={{ color: ColorTheme.textPrimary }}
                                                className="truncate max-w-xs"
                                            >
                                                Resume.pdf
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeResume}
                                            style={{
                                                backgroundColor: ColorTheme.bgCardHover,
                                                color: ColorTheme.textPrimary,
                                            }}
                                            className="h-8 w-8 p-0 hover:bg-opacity-50 rounded-full"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <label className="w-full cursor-pointer">
                                    <div
                                        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-32 hover:border-opacity-50 transition-colors"
                                        style={{
                                            borderColor: ColorTheme.borderLight,
                                        }}
                                    >
                                        <Cloud
                                            className="h-8 w-8"
                                            style={{ color: ColorTheme.textSecondary }}
                                        />
                                        <p
                                            className="mt-2 text-sm"
                                            style={{ color: ColorTheme.textSecondary }}
                                        >
                                            Upload resume
                                        </p>
                                        <p
                                            className="mt-1 text-xs"
                                            style={{ color: ColorTheme.textMuted }}
                                        >
                                            PDF up to 10MB
                                        </p>
                                        <input
                                            type="file"
                                            id="resumeUpload"
                                            accept="application/pdf"
                                            onChange={handleResumeUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </label>
                            )}
                        </div>

                        {!isUploaded && !content.resumeLink && (
                            <div className="mt-2">
                                <Label
                                    htmlFor="resumeLink"
                                    className="text-sm font-medium"
                                    style={{ color: ColorTheme.textPrimary }}
                                >
                                    Or paste resume URL
                                </Label>
                                <Input
                                    id="resumeLink"
                                    value={content.resumeLink}
                                    onChange={(e) =>
                                        setContent({ ...content, resumeLink: e.target.value })
                                    }
                                    placeholder="Enter your resume link"
                                    style={{
                                        backgroundColor: ColorTheme.bgCard,
                                        borderColor: ColorTheme.borderLight,
                                        color: ColorTheme.textPrimary,
                                    }}
                                    className="mt-2"
                                />
                                <p
                                    className="text-xs mt-2"
                                    style={{ color: ColorTheme.textSecondary }}
                                >
                                    Link to your resume (PDF recommended)
                                </p>
                            </div>
                        )}
                    </div>

                </CardContent>

                <CardFooter className="pt-4 pb-6">
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{
                            backgroundColor: ColorTheme.primary,
                            color: ColorTheme.textPrimary,
                            boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                        }}
                    >
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AcademicSidebarContent;
