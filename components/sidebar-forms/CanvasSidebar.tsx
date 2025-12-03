"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { updateSection } from '@/app/actions/portfolio';
import { redirect, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updatePortfolioData } from '@/slices/dataSlice';
import toast from 'react-hot-toast';
import React from 'react';
import { ColorTheme } from '@/lib/colorThemes';

import SocialLinksEditor from '../Shared/SocialLinksEditor';
import { SocialLink, SocialPlatform } from '@/types/canvas';

const CanvasSidebar = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const portfolioId = params.portfolioId as string;
    const { portfolioData } = useSelector((state: RootState) => state.data);

    const heroSection = portfolioData?.find((section: any) => section.type === "hero");
    const userInfoSection = portfolioData?.find((section: any) => section.type === "userInfo");

    const [name, setName] = useState(heroSection?.data?.name || "");
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (heroSection) setName(heroSection.data?.name || "");
        if (userInfoSection) {
            const data = userInfoSection.data || {};

            // Check if data is already in array format (new) or object format (old)
            if (Array.isArray(data)) {
                // Ensure all links have IDs (migration fix for links created before ID was added)
                const linksWithIds = data.map(link => ({
                    ...link,
                    id: link.id || crypto.randomUUID()
                }));
                setSocialLinks(linksWithIds);
            } else {
                // Convert old object format to array
                const converted: SocialLink[] = Object.entries(data).map(([key, value]) => {
                    if (!value) return null;
                    return {
                        id: crypto.randomUUID(),
                        platform: key as SocialPlatform,
                        url: value as string
                    };
                }).filter(Boolean) as SocialLink[];
                setSocialLinks(converted);
            }
        }
    }, [heroSection, userInfoSection]);

    if (!portfolioId) {
        return redirect("/choose-templates");
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Update Hero (Name)
            if (heroSection) {
                const newHeroData = { ...heroSection.data, name };
                dispatch(updatePortfolioData({
                    sectionType: "hero",
                    newData: newHeroData,
                    sectionTitle: heroSection.sectionTitle,
                    sectionDescription: heroSection.sectionDescription
                }));
                await updateSection({
                    portfolioId,
                    sectionName: "hero",
                    sectionContent: newHeroData,
                    sectionTitle: heroSection.sectionTitle,
                    sectionDescription: heroSection.sectionDescription
                });
            }

            // Update UserInfo (Socials)
            if (userInfoSection) {
                // Save as array directly
                const newUserInfoData = socialLinks;

                dispatch(updatePortfolioData({
                    sectionType: "userInfo",
                    newData: newUserInfoData,
                    sectionTitle: userInfoSection.sectionTitle,
                    sectionDescription: userInfoSection.sectionDescription
                }));
                await updateSection({
                    portfolioId,
                    sectionName: "userInfo",
                    sectionContent: newUserInfoData,
                    sectionTitle: userInfoSection.sectionTitle,
                    sectionDescription: userInfoSection.sectionDescription
                });
            }

            toast.success("Changes saved successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 custom-scrollbar h-full">
            <Card className="min-h-screen rounded-none" style={{ backgroundColor: ColorTheme.bgMain, borderColor: ColorTheme.borderLight }}>
                <CardHeader>
                    <CardTitle style={{ color: ColorTheme.textPrimary }}>Canvas Settings</CardTitle>
                    <CardDescription style={{ color: ColorTheme.textSecondary }}>Manage your portfolio name and social links.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" style={{ color: ColorTheme.textPrimary }}>Name / Logo Text</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            style={{ backgroundColor: ColorTheme.bgCard, borderColor: ColorTheme.borderLight, color: ColorTheme.textPrimary }}
                        />
                    </div>

                    <div className="space-y-4">
                        <SocialLinksEditor
                            links={socialLinks}
                            onChange={setSocialLinks}
                        />
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{ backgroundColor: ColorTheme.primary, color: ColorTheme.textPrimary }}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CanvasSidebar;
