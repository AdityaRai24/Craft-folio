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
import { Cloud, X } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import SocialLinksEditor from "../Shared/SocialLinksEditor";
import ResumeUpload from "../Shared/ResumeUpload";
import { SocialLink } from "@/types/canvas";

interface ContentType {
    // Hero Data
    name: string;
    title: string;
    summary: string;
    longSummary: string;

    // User Info Data
    shortSummary: string;
    email: string;
    location: string;
    github: string;
    linkedin: string;
    resumeLink: string;
}

const SimpleWhiteHeroSidebar = () => {
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
        longSummary: "",
        shortSummary: "",
        email: "",
        location: "",
        github: "",
        linkedin: "",
        resumeLink: "",
    };

    const [content, setContent] = useState<ContentType>(emptyContent);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    useEffect(() => {
        if (portfolioData) {
            setContent({
                name: heroData.name || "",
                title: heroData.title || "",
                summary: heroData.summary || "",
                longSummary: heroData.longSummary || "",
                shortSummary: contactData.shortSummary || "",
                email: contactData.email || "",
                location: contactData.location || "",
                github: contactData.github || "",
                linkedin: contactData.linkedin || "",
                resumeLink: contactData.resumeLink || "",
            });
            setIsUploaded(!!contactData.resumeLink);

            // Handle Social Links
            if (contactData.socials && Array.isArray(contactData.socials)) {
                setSocialLinks(contactData.socials);
            } else {
                // Migration
                const newLinks: SocialLink[] = [];
                if (contactData.email) newLinks.push({ id: crypto.randomUUID(), platform: "email", url: contactData.email });
                if (contactData.linkedin) newLinks.push({ id: crypto.randomUUID(), platform: "linkedin", url: contactData.linkedin });
                if (contactData.github) newLinks.push({ id: crypto.randomUUID(), platform: "github", url: contactData.github });
                if (contactData.location) newLinks.push({ id: crypto.randomUUID(), platform: "location", url: contactData.location });
                setSocialLinks(newLinks);
            }
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
                longSummary: content.longSummary,
            };

            // Prepare User Info Update
            // Extract individual fields for backward compatibility
            const email = socialLinks.find(l => l.platform === "email")?.url || "";
            const linkedin = socialLinks.find(l => l.platform === "linkedin")?.url || "";
            const github = socialLinks.find(l => l.platform === "github")?.url || "";
            const location = socialLinks.find(l => l.platform === "location")?.url || "";

            const userInfoUpdate = {
                ...contactData,
                shortSummary: content.shortSummary,
                email,
                location,
                github,
                linkedin,
                resumeLink: content.resumeLink,
                socials: socialLinks
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
                        Hero & Contact Info
                    </CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>
                        Manage your main profile information.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={content.name}
                            onChange={(e) =>
                                setContent({ ...content, name: e.target.value })
                            }
                            placeholder="Enter your name"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
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
                            placeholder="Enter your professional title"
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
                            Main Summary
                        </Label>
                        <Textarea
                            id="summary"
                            value={content.summary}
                            onChange={(e) =>
                                setContent({ ...content, summary: e.target.value })
                            }
                            placeholder="Enter your main hero summary"
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
                            Long Summary (My Story)
                        </Label>
                        <Textarea
                            id="longSummary"
                            value={content.longSummary}
                            onChange={(e) =>
                                setContent({ ...content, longSummary: e.target.value })
                            }
                            placeholder="Enter your detailed story"
                            className="resize-none h-32"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Short Summary Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="shortSummary"
                            className="text-sm font-medium"
                            style={{ color: ColorTheme.textPrimary }}
                        >
                            Short Summary (About Me)
                        </Label>
                        <Textarea
                            id="shortSummary"
                            value={content.shortSummary}
                            onChange={(e) =>
                                setContent({ ...content, shortSummary: e.target.value })
                            }
                            placeholder="Enter a shorter summary for the About Me card"
                            className="resize-none h-20"
                            style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                            }}
                        />
                    </div>

                    {/* Social Links Editor */}
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Social Links</Label>
                        <SocialLinksEditor
                            links={socialLinks}
                            onChange={setSocialLinks}
                        />
                    </div>

                    {/* Resume Upload */}
                    <ResumeUpload
                        value={content.resumeLink}
                        onChange={(url) => setContent({ ...content, resumeLink: url })}
                    />

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

export default SimpleWhiteHeroSidebar;
