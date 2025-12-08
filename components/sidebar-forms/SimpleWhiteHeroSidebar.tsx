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
import ResumeUpload from "../Shared/ResumeUpload";
import SocialLinksEditor from "../Shared/SocialLinksEditor";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { SocialLink } from "@/types/canvas";

interface ContentType {
    // Hero Data
    name: string;
    title: string;
    summary: string;

    // User Info Data
    shortSummary: string;
    email: string;
    location: string;
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
        shortSummary: "",
        email: "",
        location: "",
        resumeLink: "",
    };

    const [content, setContent] = useState<ContentType>(emptyContent);
    const [leftSocials, setLeftSocials] = useState<SocialLink[]>([]);
    const [rightSocials, setRightSocials] = useState<SocialLink[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (portfolioData) {
            setContent({
                name: heroData.name || "",
                title: heroData.title || "",
                summary: heroData.summary || "",
                shortSummary: heroData.shortSummary || "",
                email: contactData.email || "",
                location: contactData.location || "",
                resumeLink: contactData.resumeLink || "",
            });

            // Handle Left Socials
            if (contactData.leftSocials && Array.isArray(contactData.leftSocials)) {
                setLeftSocials(contactData.leftSocials);
            } else {
                // Migration: Convert individual fields to social links if leftSocials doesn't exist
                const newLinks: SocialLink[] = [];
                if (contactData.github) newLinks.push({ id: crypto.randomUUID(), platform: "github", url: contactData.github });
                if (contactData.linkedin) newLinks.push({ id: crypto.randomUUID(), platform: "linkedin", url: contactData.linkedin });
                setLeftSocials(newLinks);
            }

            // Handle Right Socials
            if (contactData.rightSocials && Array.isArray(contactData.rightSocials)) {
                setRightSocials(contactData.rightSocials);
            } else {
                setRightSocials([]);
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
                shortSummary: content.shortSummary,
            };

            // Prepare User Info Update
            const userInfoUpdate = {
                ...contactData,
                email: rightSocials.find(l => l.platform === "email")?.url || content.email,
                location: rightSocials.find(l => l.platform === "location")?.url || content.location,
                resumeLink: content.resumeLink,
                leftSocials: leftSocials,
                rightSocials: rightSocials,
                // Keep legacy fields for backward compatibility
                github: leftSocials.find(l => l.platform === "github")?.url || contactData.github,
                linkedin: leftSocials.find(l => l.platform === "linkedin")?.url || contactData.linkedin,
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



                    {/* Resume Upload */}
                    <ResumeUpload
                        value={content.resumeLink}
                        onChange={(url) => setContent({ ...content, resumeLink: url })}
                    />

                    {/* Social Links Tabs */}
                    <Tabs defaultValue="left" className="w-full">
                        <style jsx global>{`
                            .custom-tab[data-state="active"] {
                                background-color: ${ColorTheme.primary} !important;
                                color: ${ColorTheme.textPrimary} !important;
                            }
                        `}</style>
                        <TabsList className="w-full grid grid-cols-2" style={{ backgroundColor: ColorTheme.bgNav, borderColor: ColorTheme.borderLight }}>
                            <TabsTrigger
                                value="left"
                                className="custom-tab"
                                style={{ color: ColorTheme.textPrimary }}
                            >
                                Left Socials
                            </TabsTrigger>
                            <TabsTrigger
                                value="right"
                                className="custom-tab"
                                style={{ color: ColorTheme.textPrimary }}
                            >
                                Right Socials
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="left" className="mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400">Social links on the left side (Hero)</Label>
                                <SocialLinksEditor
                                    links={leftSocials}
                                    onChange={setLeftSocials}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="right" className="mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400">Social links on the right side (About)</Label>
                                <SocialLinksEditor
                                    links={rightSocials}
                                    onChange={setRightSocials}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

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
