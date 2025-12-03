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
import { Textarea } from "../ui/textarea";
import { ColorTheme } from "@/lib/colorThemes";
import { Cloud, X } from "lucide-react";

interface ContentType {
    title: string;
    summary: string;
    longSummary: string;
    heroImage: string;
}

const AcademicHeroContent = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const portfolioId = params.portfolioId as string;
    const { portfolioData } = useSelector((state: RootState) => state.data);

    // Get Hero Data
    const heroSectionData = portfolioData?.find(
        (section: any) => section.type === "hero"
    );
    const heroData = heroSectionData?.data || {};

    const emptyContent: ContentType = {
        title: "",
        summary: "",
        longSummary: "",
        heroImage: "",
    };

    const [content, setContent] = useState<ContentType>(emptyContent);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    useEffect(() => {
        if (portfolioData) {
            setContent({
                title: heroData.title || "",
                summary: heroData.summary || "",
                longSummary: heroData.longSummary || "",
                heroImage: heroData.heroImage || "",
            });
            setIsUploaded(!!heroData.heroImage);
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
                title: content.title,
                summary: content.summary,
                longSummary: content.longSummary,
                heroImage: content.heroImage,
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

            // Save to Database
            const heroResult = await updateSection({
                sectionName: "hero",
                portfolioId: portfolioId,
                sectionContent: heroUpdate,
                sectionTitle: heroSectionData?.sectionTitle || "Hero",
                sectionDescription: heroSectionData?.sectionDescription || "Hero section",
            });

            if (!heroResult.success) {
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
            setContent({ ...content, heroImage: data.secure_url });
            setIsUploaded(true);
            toast.success("Image uploaded successfully!", { id: "imageUpload" });
        } catch (error) {
            toast.error("An error occurred during upload", { id: "imageUpload" });
            console.error("Upload error:", error);
        }
    };

    const removeImage = () => {
        setContent({ ...content, heroImage: "" });
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
                        Hero Content
                    </CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>
                        Manage your introduction and summary.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="title"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Title / Greeting
                        </Label>
                        <Input
                            id="title"
                            value={content.title}
                            onChange={(e) =>
                                setContent({ ...content, title: e.target.value })
                            }
                            placeholder="e.g., Hello, I'm a Researcher."
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Summary Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="summary"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Short Summary
                        </Label>
                        <Textarea
                            id="summary"
                            value={content.summary}
                            onChange={(e) =>
                                setContent({ ...content, summary: e.target.value })
                            }
                            placeholder="A brief introduction..."
                            className="resize-none h-24"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Long Summary Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="longSummary"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Long Summary (About Me)
                        </Label>
                        <Textarea
                            id="longSummary"
                            value={content.longSummary}
                            onChange={(e) =>
                                setContent({ ...content, longSummary: e.target.value })
                            }
                            placeholder="Detailed description of your work and interests..."
                            className="resize-none h-40"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Hero Image Upload */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="heroImage"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Hero Image (Optional)
                        </Label>
                        <div className="mt-1 flex flex-col items-center">
                            {content.heroImage ? (
                                <div className="relative w-full">
                                    <div
                                        className="flex items-center justify-between w-full p-3 rounded-md"
                                        style={{
                                            backgroundColor: ColorTheme.bgCard,
                                            borderColor: ColorTheme.borderLight,
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src={content.heroImage}
                                                alt="Hero"
                                                className="w-10 h-10 object-cover rounded mr-3"
                                            />
                                            <span
                                                style={{ color: ColorTheme.textPrimary }}
                                                className="truncate max-w-xs"
                                            >
                                                Image Uploaded
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeImage}
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
                                            Upload Image
                                        </p>
                                        <p
                                            className="mt-1 text-xs"
                                            style={{ color: ColorTheme.textMuted }}
                                        >
                                            JPG, PNG up to 5MB
                                        </p>
                                        <input
                                            type="file"
                                            id="heroImage"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </label>
                            )}
                        </div>
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

export default AcademicHeroContent;
